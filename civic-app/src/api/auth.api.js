import api from "./axios";

const handleError = (error, label) => {
  const requestUrl = `${error?.config?.baseURL || ""}${error?.config?.url || ""}`;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  console.log(`${label} ERROR:`, {
    message,
    url: requestUrl || "unknown",
    status: error?.response?.status,
  });
  throw new Error(message);
};

const normalizeAccount = (payload) => {
  const account = payload?.user || payload?.worker || payload?.admin || payload;
  if (!account) return account;

  return {
    ...account,
    role: account.role === "user" ? "client" : account.role,
  };
};

export const userLogin = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/user/login", { email, password });
    return res.data;
  } catch (error) {
    handleError(error, "USER LOGIN");
  }
};

export const userRegister = async ({ name, email, password }) => {
  try {
    const res = await api.post("/auth/user/register", { name, email, password });
    return res.data;
  } catch (error) {
    handleError(error, "USER REGISTER");
  }
};

export const workerLogin = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/worker/login", { email, password });
    return res.data;
  } catch (error) {
    handleError(error, "WORKER LOGIN");
  }
};

export const adminLogin = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/admin/login", { email, password });
    return res.data;
  } catch (error) {
    handleError(error, "ADMIN LOGIN");
  }
};

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return normalizeAccount(res.data);
  } catch (error) {
    handleError(error, "GET ME");
  }
};

export const logoutUser = async () => ({ ok: true });
