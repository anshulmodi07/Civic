import jwt from "jsonwebtoken";

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production");
    }

    console.warn("JWT_SECRET missing. Using local development secret.");
    return "local-dev-jwt-secret";
  }

  return process.env.JWT_SECRET;
};

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                  // payload
    getJwtSecret(),                // secret key
    { expiresIn: "7d" }            // expiry
  );
};
