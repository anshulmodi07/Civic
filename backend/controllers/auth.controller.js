const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

exports.login = async (req, res) => {
  try {
    const { email, role, name } = req.body;   // ← include name

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role required" });
    }

    let user = await User.findOne({ email, role });

    if (!user && role === "citizen") {
      user = await User.create({
        name: name || "Citizen",
        email,
        role,
      });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        department: user.department || null,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};