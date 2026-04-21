import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                  // payload
    process.env.JWT_SECRET,        // secret key
    { expiresIn: "7d" }            // expiry
  );
};