import api from "./axios";

export const loginWorker = async (email, password) => {
  const res = await api.post("/auth/worker/login", {
    email,
    password,
  });

  return res.data; // { token, worker }
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/user/login", {
    email,
    password,
  });

  return res.data; // { token, user }
};