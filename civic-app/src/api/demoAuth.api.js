import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEMO_PASSWORD } from "./config";

const TOKEN_STORAGE_KEY = "token";

const demoUsers = [
  {
    id: "demo-worker",
    name: "Demo Worker",
    email: "worker@demo.com",
    role: "worker",
    password: DEMO_PASSWORD,
  },
  {
    id: "demo-citizen",
    name: "Demo Citizen",
    email: "demo@civicmitra.com",
    role: "citizen",
    password: DEMO_PASSWORD,
  },
];

const findUser = ({ email, role }) =>
  demoUsers.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() && user.role === role
  );

const createCitizenUser = ({ email, name, password }) => {
  const newUser = {
    id: `demo-citizen-${Date.now()}`,
    name: name || "Demo Citizen",
    email: email.toLowerCase(),
    role: "citizen",
    password: password || DEMO_PASSWORD,
  };

  demoUsers.push(newUser);
  return newUser;
};

export const login = async ({ email, name, role, password }) => {
  const backendRole = role === "client" ? "citizen" : role;
  const normalizedEmail = email?.trim().toLowerCase();

  let user = findUser({ email: normalizedEmail, role: backendRole });

  if (!user && backendRole === "citizen") {
    user = createCitizenUser({ email: normalizedEmail, name, password });
  }

  if (!user) {
    const error = new Error("User not found");
    error.response = { data: { message: "User not found" } };
    throw error;
  }

  if (!password || password !== user.password) {
    const error = new Error("Invalid credentials");
    error.response = { data: { message: "Invalid credentials" } };
    throw error;
  }

  const token = `demo:${user.email}`;
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMe = async () => {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token || !token.startsWith("demo:")) {
    const error = new Error("No demo session");
    error.response = { data: { message: "Not authenticated" } };
    throw error;
  }

  const email = token.replace("demo:", "");
  const user = demoUsers.find((item) => item.email === email);

  if (!user) {
    const error = new Error("Session expired");
    error.response = { data: { message: "Session expired" } };
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  return { ok: true };
};
