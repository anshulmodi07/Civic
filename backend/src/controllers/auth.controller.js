import Worker from "../models/worker.js";
import Admin from "../models/admin.js";
import User from "../models/user.js";

import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/jwt.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// 🔥 WORKER LOGIN
export const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });

    if (!worker) {
      return res.status(400).json({ message: "Worker not found" });
    }

    const isMatch = await bcrypt.compare(password, worker.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(worker._id, "worker");

    res.json({
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id, "admin");

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 GOOGLE LOGIN (USER)
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 2. Domain restriction
    if (!email.endsWith("@nitdelhi.ac.in")) {
      return res.status(403).json({
        message: "Only NIT Delhi users allowed",
      });
    }

    // 3. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name });
    }

    // 4. Generate JWT
    const jwtToken = generateToken(user._id, "user");

    res.json({
      token: jwtToken,
      user,
    });

  } catch (error) {
    console.error(error); //
    res.status(401).json({ message: "Google auth failed" });
  }
};