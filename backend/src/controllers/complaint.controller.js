// src/controllers/complaint.controller.js

import {
  createComplaintService,
  getAllComplaintsService,
  getMyComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
} from "../services/complaint.service.js";

export const createComplaint = async (req, res) => {
  try {
    const complaint = await createComplaintService(req.body, req.user.id);

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
  const complaints = await getAllComplaintsService();
  res.json({ success: true, data: complaints });
};

export const getMyComplaints = async (req, res) => {
  const complaints = await getMyComplaintsService(req.user.id);
  res.json({ success: true, data: complaints });
};

export const getComplaintById = async (req, res) => {
  const complaint = await getComplaintByIdService(req.params.id);

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json({ success: true, data: complaint });
};
export const updateComplaint = async (req, res) => {
  try {
    const data = await updateComplaintService(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    res.status(400).json({ message: err.message });
  }
};