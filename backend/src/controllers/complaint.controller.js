import Complaint from "../models/complaint.js";
import Department from "../models/department.js";
import mongoose from "mongoose";

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
/**
 * GET /complaints/dashboard/citizen
 * Returns aggregated stats for the logged-in citizen.
 */
export const getCitizenDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const mine = await Complaint.find({ userId });

    const myComplaints = mine.length;
    const activeComplaints = mine.filter(
      (c) => c.status === "in-progress" || c.status === "assigned" || c.status === "accepted"
    ).length;
    const pendingComplaints = mine.filter(
      (c) => c.status === "pending" || c.status === "new"
    ).length;
    const resolvedComplaints = mine.filter(
      (c) => c.status === "closed" || c.status === "completed"
    ).length;

    res.json({
      myComplaints,
      activeComplaints,
      pendingComplaints,
      resolvedComplaints,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET ALL COMPLAINTS ────────────────────────────────────────────────────────
/**
 * GET /complaints
 * Returns all complaints with optional filters: status, type, issueType
 */
export const getAllComplaints = async (req, res) => {
  try {
    const { status, type, issueType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (issueType) filter.issueType = issueType;

    const complaints = await Complaint.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET MY COMPLAINTS ─────────────────────────────────────────────────────────
/**
 * GET /complaints/my
 * Returns complaints created by the current user.
 */
export const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET COMPLAINT BY ID ───────────────────────────────────────────────────────
/**
 * GET /complaints/:id
 */
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email")
      .populate("comments.userId", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET NEARBY COMPLAINTS ─────────────────────────────────────────────────────
/**
 * GET /complaints/nearby?lat=...&lng=...&radiusKm=5
 * Returns complaints within the given radius using geospatial query.
 * Falls back to all complaints if no coordinates are given.
 */
export const getNearbyComplaints = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 5 } = req.query;

    if (lat && lng) {
      const complaints = await Complaint.find({
        coordinates: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              parseFloat(radiusKm) / 6371, // convert km to radians
            ],
          },
        },
      }).sort({ createdAt: -1 });

      return res.json(complaints);
    }

    // Fallback: return all
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CREATE COMPLAINT ──────────────────────────────────────────────────────────
/**
 * POST /complaints
 * Creates a new complaint. Accepts JSON or multipart/form-data.
 */
export const createComplaint = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      type,
      visibility,
      hostelName,
      floor,
      roomNumber,
      landmark,
      area,
      locationLandmark,
      locationAddress,
      description,
      issueType,
      priority,
      departmentId,
      location,
      images,
    } = req.body;

    // Parse location if it's a string (from FormData)
    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch {
        parsedLocation = { lat: 0, lng: 0 };
      }
    }
    
    if (!parsedLocation || typeof parsedLocation.lat !== "number") {
      parsedLocation = { lat: 28.545, lng: 77.192 }; // fallback if missing
    }

    let finalDeptId = departmentId;
    if (!finalDeptId && issueType) {
      const dept = await Department.findOne({ name: issueType.toLowerCase() });
      if (dept) finalDeptId = dept._id;
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else if (images) {
      imageUrls = images;
    }

    const complaint = await Complaint.create({
      userId,
      type,
      visibility: visibility || (type === "campus" ? "public" : "private"),
      hostelName,
      floor,
      roomNumber,
      landmark: landmark || (type === "hostel" ? locationLandmark : undefined),
      area: area || (type === "campus" ? locationLandmark : undefined),
      locationAddress,
      description,
      issueType,
      priority: priority || "medium",
      departmentId: finalDeptId || undefined,
      status: "pending",
      location: parsedLocation,
      images: imageUrls,
      supporters: [],
      comments: [],
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Complaint creation error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ─── TOGGLE SUPPORT/UPVOTE ─────────────────────────────────────────────────────
/**
 * POST /complaints/:id/support
 * Toggles the user's support on a complaint.
 */
export const toggleSupport = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);
    const idx = complaint.supporters.findIndex(
      (s) => s.toString() === userId
    );

    let message;
    if (idx === -1) {
      complaint.supporters.push(userObjId);
      message = "Complaint supported";
    } else {
      complaint.supporters.splice(idx, 1);
      message = "Support removed";
    }

    await complaint.save();

    res.json({
      supporters: complaint.supporters,
      message,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADD COMMENT ───────────────────────────────────────────────────────────────
/**
 * POST /complaints/:id/comments
 * Adds a comment to a complaint.
 */
export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.comments.push({
      userId,
      text,
      createdAt: new Date(),
    });

    await complaint.save();

    // Return populated comments
    const updated = await Complaint.findById(req.params.id)
      .populate("comments.userId", "name email");

    res.status(201).json(updated.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE STATUS ─────────────────────────────────────────────────────────────
/**
 * PATCH /complaints/:id/status
 * Updates complaint status (admin / staff).
 */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "new", "pending", "assigned", "accepted",
      "in-progress", "completed", "incompleted", "closed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE COMPLAINT ──────────────────────────────────────────────────────────
/**
 * DELETE /complaints/:id
 * Deletes a complaint (owner or admin).
 */
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Allow owner or admin to delete
    const isOwner = complaint.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this complaint" });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
