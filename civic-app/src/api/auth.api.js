import api from "./axios";
import { USE_DEMO_API } from "./config";
import {
  login as demoLogin,
  getMe as demoGetMe,
  logoutUser as demoLogout,
} from "./demoAuth.api";

/* ---------------- HELPER ---------------- */

const handleError = (error, label) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  console.log(`${label} ERROR:`, message);
  throw new Error(message);
};

/* ---------------- AUTH APIs ---------------- */

/**
 * USER LOGIN (Google OAuth)
 */
export const googleLogin = async (token) => {
  if (USE_DEMO_API) {
    // simulate google login via demo
    return demoLogin({
      email: "demo@civicmitra.com",
      role: "citizen",
      password: "demo1234",
    });
  }

  try {
    const res = await api.post("/auth/google-login", { token });
    return res.data;
  } catch (error) {
    handleError(error, "GOOGLE LOGIN");
  }
};

/**
 * WORKER LOGIN
 */
export const workerLogin = async ({ email, password }) => {
  if (USE_DEMO_API) {
    return demoLogin({
      email,
      role: "worker",
      password,
    });
  }

  try {
    const res = await api.post("/auth/worker/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    handleError(error, "WORKER LOGIN");
  }
};

/**
 * ADMIN LOGIN (future use)
 */
export const adminLogin = async ({ email, password }) => {
  if (USE_DEMO_API) {
    return demoLogin({
      email,
      role: "admin",
      password,
    });
  }

  try {
    const res = await api.post("/auth/admin/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    handleError(error, "ADMIN LOGIN");
  }
};

/**
 * GET CURRENT USER
 */
export const getMe = async () => {
  if (USE_DEMO_API) {
    return demoGetMe();
  }

  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    handleError(error, "GET ME");
  }
};

/**
 * LOGOUT
 */
export const logoutUser = async () => {
  if (USE_DEMO_API) {
    return demoLogout();
  }

  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    handleError(error, "LOGOUT");
  }
};