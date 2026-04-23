// src/services/complaint.service.js

import Complaint from "../models/Complaint.js";
import { validateComplaint } from "../utils/validateComplaint.js";

export const createComplaintService = async (data, userId) => {
  validateComplaint(data);
  return await Complaint.create({
    ...data,
    userId,
  });
};

export const getAllComplaintsService = async (filters = {}) => {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.departmentId) query.departmentId = filters.departmentId;

  return await Complaint.find(query).sort({ createdAt: -1 });
};

export const getMyComplaintsService = async (userId) => {
  return await Complaint.find({ userId });
};

export const getComplaintByIdService = async (id) => {
  return await Complaint.findById(id);
};

export const updateComplaintService = async (id, data, userId) => {
  const complaint = await Complaint.findById(id);

  if (!complaint) throw new Error("Complaint not found");

  if (complaint.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return await Complaint.findByIdAndUpdate(id, data, { new: true });
};

export const deleteComplaintService = async (id, userId) => {
  const complaint = await Complaint.findById(id);

  if (!complaint) throw new Error("Complaint not found");

  if (complaint.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await complaint.deleteOne();

  return { success: true };
};

export const getNearbyComplaintsService = async (lat, lng, radiusKm = 5) => {
  return await Complaint.find({
    coordinates: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          radiusKm / 6378.1,
        ],
      },
    },
  });
};