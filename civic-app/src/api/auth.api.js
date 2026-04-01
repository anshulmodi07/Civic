import api from "./axios";

/**
 * Unified login for BOTH roles (worker + client)
 * Backend decides role based on input
 */
export const login = async ({ email, name, role }) => {
  try {
    const res = await api.post("/auth/login", {
      email,
      name,
      role,
    });

    return res.data; // expected: { token, user }
  } catch (error) {
    console.log("Login API error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current logged-in user
 */
export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data; // expected: { id, role, ... }
  } catch (error) {
    console.log("GetMe API error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Optional: Logout API (only if backend supports it)
 */
export const logoutUser = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.log("Logout API error:", error.response?.data || error.message);
    throw error;
  }
};