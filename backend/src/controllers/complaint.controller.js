// src/controllers/complaint.controller.js

import Interaction from "../models/interaction.js";
import {
  createComplaintService,
  getAllComplaintsService,
  getMyComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
  getNearbyComplaintsService,
} from "../services/complaint.service.js";

const parseMaybeJson = (value) => {
  if (value === undefined || value === null) return value;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeComplaintBody = (req) => {
  const body = { ...(req.body || {}) };
  body.location = parseMaybeJson(body.location);

  // map legacy frontend keys -> final schema keys
  if (body.locationLandmark && !body.area) body.area = body.locationLandmark;

  // if hostel flow doesn’t send visibility, default to private
  if (body.type === "hostel" && !body.visibility) body.visibility = "private";

  // attach uploaded image URLs
  if (req.files?.length) {
    const urls = req.files.map((f) => `/uploads/complaints/${f.filename}`);
    body.images = [...(Array.isArray(body.images) ? body.images : []), ...urls];
  }

  return body;
};

export const createComplaint = async (req, res) => {
  try {
    const payload = normalizeComplaintBody(req);
    const complaint = await createComplaintService(payload, req.user.id);

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await getAllComplaintsService(req.query || {});
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await getMyComplaintsService(req.user.id);
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await getComplaintByIdService(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const updateComplaint = async (req, res) => {
  try {
    const payload = normalizeComplaintBody(req);
    const data = await updateComplaintService(
      req.params.id,
      payload,
      req.user.id
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const data = await deleteComplaintService(
      req.params.id,
      req.user.id
    );

    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getNearbyComplaints = async (req, res) => {
  try {
    const { lat, lng, radiusKm } = req.query;
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = radiusKm === undefined ? 5 : Number(radiusKm);

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      return res.status(400).json({ success: false, message: "lat and lng are required numbers" });
    }

    const complaints = await getNearbyComplaintsService(latNum, lngNum, radiusNum);
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const toggleSupport = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;

    const existing = await Interaction.findOne({ complaintId, userId, type: "upvote" });
    if (existing) {
      await existing.deleteOne();
    } else {
      // interaction schema currently requires commentText even for upvote
      await Interaction.create({ complaintId, userId, type: "upvote", commentText: "" });
    }

    const upvotes = await Interaction.countDocuments({ complaintId, type: "upvote" });
    res.json({ success: true, data: { upvotes, upvoted: !existing } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listComments = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const comments = await Interaction.find({ complaintId, type: "comment" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body || {};
    if (!text || String(text).trim().length < 1) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const created = await Interaction.create({
      complaintId,
      userId,
      type: "comment",
      commentText: String(text).trim(),
    });

    const populated = await Interaction.findById(created._id).populate("userId", "name email");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getComplaintTimeline = async (req, res) => {
  try {
    const complaint = await getComplaintByIdService(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

    const events = [
      { type: "complaint_created", status: complaint.status, at: complaint.createdAt },
    ];

    const history = complaint?.assignedTask?.history || [];
    for (const h of history) {
      events.push({
        type: "task_status",
        status: h.status,
        at: h.changedAt,
        note: h.note,
        changedBy: h.changedBy,
      });
    }

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
