import api from "./axios";

const normalizeAccount = (payload) => {
  const account = payload?.user || payload?.worker || payload?.admin || payload;
  if (!account) return account;

  return {
    ...account,
    role: account.role === "user" ? "client" : account.role,
  };
};

export const userLogin = async ({ email, password }) => {
  const res = await api.post("/auth/user/login", { email, password });
  return res.data;
};

export const userRegister = async ({ name, email, password }) => {
  const res = await api.post("/auth/user/register", { name, email, password });
  return res.data;
};

export const workerLogin = async ({ email, password }) => {
  const res = await api.post("/auth/worker/login", { email, password });
  return res.data;
};

export const adminLogin = async ({ email, password }) => {
  const res = await api.post("/auth/admin/login", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return normalizeAccount(res.data);
};

export const logoutUser = async () => ({ ok: true });
