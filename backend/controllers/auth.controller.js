const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

exports.login = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role required" });
  }

  let user = await User.findOne({ email, role });

  if (!user) {
    user = await User.create({
      name: role.toUpperCase(),
      email,
      role,
    });
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
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-passwordHash");
  res.json(user);
};
