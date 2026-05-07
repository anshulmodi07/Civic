import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import Department from "../models/department.js";
import { validateComplaint } from "../utils/validateComplaint.js";

const toObjectId = (value) => {
  if (!value) return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid id");
  }
  return new mongoose.Types.ObjectId(value);
};

const buildMatch = (filters = {}) => {
  const match = {};
  if (filters.type) match.type = filters.type;
  if (filters.status) match.status = filters.status;
  if (filters.issueType) match.issueType = filters.issueType;
  if (filters.departmentId) match.departmentId = toObjectId(filters.departmentId);
  return match;
};

const DEPARTMENT_ALIASES = {
  ac: "electrician",
  construction: "civil",
  sanitation: "civil",
  pest_control: "civil",
  furniture: "carpenter",
};

const resolveDepartmentFromIssueType = async (issueType) => {
  const rawName = String(issueType || "").trim();
  if (!rawName) return null;

  const names = [rawName, DEPARTMENT_ALIASES[rawName.toLowerCase()]].filter(Boolean);
  return Department.findOne({
    name: {
      $in: names.map((name) => new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")),
    },
  });
};

const complaintWithTaskPipeline = (match, currentUserId = null) => [
  ...(match && Object.keys(match).length ? [{ $match: match }] : []),
  { $sort: { createdAt: -1 } },
  {
    $lookup: {
      from: "departments",
      localField: "departmentId",
      foreignField: "_id",
      as: "department",
    },
  },
  {
    $unwind: {
      path: "$department",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "complaintId",
      as: "task",
    },
  },
  {
    $lookup: {
      from: "interactions",
      let: { complaintId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$complaintId", "$$complaintId"] },
                { $eq: ["$type", "upvote"] },
              ],
            },
          },
        },
      ],
      as: "upvoteDocs",
    },
  },
  {
    $lookup: {
      from: "interactions",
      let: { complaintId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$complaintId", "$$complaintId"] },
                { $eq: ["$type", "comment"] },
              ],
            },
          },
        },
        { $count: "count" },
      ],
      as: "commentStats",
    },
  },
  {
    $addFields: {
      assignedTask: { $first: "$task" },
      departmentId: "$department",
      departmentName: "$department.name",
      upvotesCount: { $size: "$upvoteDocs" },
      upvotes: { $size: "$upvoteDocs" },
      commentsCount: {
        $ifNull: [{ $first: "$commentStats.count" }, 0],
      },
      hasUpvoted: currentUserId
        ? { $in: [toObjectId(currentUserId), "$upvoteDocs.userId"] }
        : false,
    },
  },
  { $project: { task: 0, department: 0, upvoteDocs: 0, commentStats: 0 } },
];

export const createComplaintService = async (data, userId) => {
  if (!data.departmentId && data.issueType) {
    const department = await resolveDepartmentFromIssueType(data.issueType);
    if (department) data.departmentId = department._id;
  }

  validateComplaint(data);
  return Complaint.create({
    ...data,
    userId,
  });
};

export const getAllComplaintsService = async (filters = {}) => {
  const match = buildMatch(filters);
  return Complaint.aggregate(complaintWithTaskPipeline(match));
};

export const getMyComplaintsService = async (userId) => {
  return Complaint.aggregate(complaintWithTaskPipeline({ userId: toObjectId(userId) }, userId));
};

export const getComplaintByIdService = async (id) => {
  const results = await Complaint.aggregate(complaintWithTaskPipeline({ _id: toObjectId(id) }));
  return results[0] || null;
};

export const updateComplaintService = async (id, data, userId) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");
  if (complaint.userId.toString() !== userId) throw new Error("Unauthorized");

  if (!data.departmentId && data.issueType) {
    const department = await resolveDepartmentFromIssueType(data.issueType);
    if (department) data.departmentId = department._id;
  }

  return Complaint.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteComplaintService = async (id, userId) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");
  if (complaint.userId.toString() !== userId) throw new Error("Unauthorized");

  await complaint.deleteOne();
  return { success: true };
};

export const getNearbyComplaintsService = async (lat, lng, radiusKm = 5) => {
  return Complaint.aggregate([
    {
      $match: {
        coordinates: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusKm / 6378.1],
          },
        },
      },
    },
    ...complaintWithTaskPipeline({}),
  ]);
};
