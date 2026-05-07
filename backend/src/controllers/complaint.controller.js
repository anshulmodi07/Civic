import Interaction from "../models/interaction.js";
import {
  createComplaintService,
  deleteComplaintService,
  getAllComplaintsService,
  getComplaintByIdService,
  getMyComplaintsService,
  getNearbyComplaintsService,
  updateComplaintService,
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

  if (body.locationLandmark && !body.area) body.area = body.locationLandmark;
  if (body.type === "hostel" && !body.visibility) body.visibility = "private";

  if (req.files?.length) {
    const urls = req.files.map((file) => `/uploads/complaints/${file.filename}`);
    body.images = [...(Array.isArray(body.images) ? body.images : []), ...urls];
  }

  return body;
};

export const createComplaint = async (req, res) => {
  try {
    const complaint = await createComplaintService(normalizeComplaintBody(req), req.user.id);
    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
    const complaint = await updateComplaintService(req.params.id, normalizeComplaintBody(req), req.user.id);
    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const data = await deleteComplaintService(req.params.id, req.user.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getNearbyComplaints = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = req.query.radiusKm === undefined ? 5 : Number(req.query.radiusKm);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ success: false, message: "lat and lng are required numbers" });
    }

    const complaints = await getNearbyComplaintsService(lat, lng, radiusKm);
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const toggleSupport = async (req, res) => {
  try {
    const { id: complaintId } = req.params;
    const userId = req.user.id;

    const existing = await Interaction.findOne({ complaintId, userId, type: "upvote" });
    if (existing) {
      await existing.deleteOne();
    } else {
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
    const comments = await Interaction.find({ complaintId: req.params.id, type: "comment" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || String(text).trim().length < 1) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const created = await Interaction.create({
      complaintId: req.params.id,
      userId: req.user.id,
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
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const events = [{ type: "complaint_created", status: complaint.status, at: complaint.createdAt }];
    const history = complaint?.assignedTask?.history || [];

    for (const item of history) {
      events.push({
        type: "task_status",
        status: item.status,
        at: item.changedAt,
        note: item.note,
        changedBy: item.changedBy,
      });
    }

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
