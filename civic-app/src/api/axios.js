import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getToken } from "../utils/storage";

const normalizeApiBase = (url) =>
  String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

const getDefaultApiBase = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;
  const host = hostUri?.split(":")?.[0];

  if (host) return `http://${host}:3000`;
  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
};

export const API_BASE = normalizeApiBase(
  process.env.EXPO_PUBLIC_API_URL || getDefaultApiBase()
);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
