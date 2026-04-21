import api from "./axios";
import { USE_DEMO_API } from "./config";
import { login as demoLogin, getMe as demoGetMe, logoutUser as demoLogout } from "./demoAuth.api";

const normalizeRole = (role) => (role === "client" ? "citizen" : role);

/**
 * Unified login for BOTH roles (worker + client)
 * Backend decides role based on input
 */
export const login = async ({ email, name, role, password }) => {
  const normalizedRole = normalizeRole(role);

  if (USE_DEMO_API) {
    return demoLogin({ email, name, role: normalizedRole, password });
  }

  try {
    const res = await api.post("/auth/login", {
      email,
      name,
      role: normalizedRole,
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
  if (USE_DEMO_API) {
    return demoGetMe();
  }

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
  if (USE_DEMO_API) {
    return demoLogout();
  }

  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.log("Logout API error:", error.response?.data || error.message);
    throw error;
  }
};