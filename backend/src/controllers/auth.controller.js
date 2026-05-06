import Worker from "../models/worker.js";
import Admin from "../models/admin.js";
import User from "../models/User.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const sanitizeAccount = (account, role) => ({
  id: account._id,
  name: account.name,
  email: account.email,
  role,
  departmentId: account.departmentId || null,
});

const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 6;

export const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body || {};
    const email = normalizeEmail(req.body?.email);

    if (!name?.trim() || !email || !isValidPassword(password)) {
      return res.status(400).json({
        message: "Name, valid email, and password of at least 6 characters are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing?.password) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = existing
      ? await User.findByIdAndUpdate(
          existing._id,
          { name: name.trim(), password: hashedPassword },
          { new: true, runValidators: true }
        )
      : await User.create({
          name: name.trim(),
          email,
          password: hashedPassword,
        });

    const token = generateToken(user._id, "user");

    return res.status(201).json({
      token,
      user: sanitizeAccount(user, "client"),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body || {};

    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, "user");

    return res.json({
      token,
      user: sanitizeAccount(user, "client"),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginWorker = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body || {};

    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(400).json({ message: "Worker not found" });
    }

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(worker._id, "worker");

    return res.json({
      token,
      worker: sanitizeAccount(worker, "worker"),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body || {};

    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id, "admin");

    return res.json({
      token,
      admin: sanitizeAccount(admin, "admin"),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { id, role } = req.user || {};
    let account;
    let responseRole = role;

    if (role === "worker") {
      account = await Worker.findById(id);
    } else if (role === "admin") {
      account = await Admin.findById(id);
    } else {
      account = await User.findById(id);
      responseRole = "client";
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json({
      user: sanitizeAccount(account, responseRole),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
