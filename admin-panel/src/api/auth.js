// src/api/auth.js

import { ADMINS } from "../mock/admins";

const USE_MOCK = true;

// ✅ MOCK LOGIN
const mockLogin = async ({ email, password }) => {
  await new Promise(res => setTimeout(res, 300));

  const user = ADMINS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    departmentId: user.departmentId
  };

  return {
    token: "mock-jwt-token",
    user: safeUser
  };
};

// ✅ REAL LOGIN
const realLogin = async (payload) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

// 🔥 MAIN LOGIN
export const loginUser = async (payload) => {
  return USE_MOCK ? mockLogin(payload) : realLogin(payload);
};

// ✅ GET USER
export const getUser = async () => {
  return JSON.parse(localStorage.getItem("user"));
};

// ✅ LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};