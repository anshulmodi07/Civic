import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "../utils/storage";

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

const normalizeApiBase = (url) =>
  String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

export const API_BASE = normalizeApiBase(
  process.env.EXPO_PUBLIC_API_URL || getDefaultApiBase()
);

if (__DEV__) {
  console.log("API BASE:", API_BASE);
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    const requestUrl = `${config.baseURL || ""}${config.url || ""}`;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log("API REQUEST:", String(config.method || "GET").toUpperCase(), requestUrl);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    if (__DEV__) {
      const requestUrl = `${error.config?.baseURL || ""}${error.config?.url || ""}`;
      console.log("API ERROR:", {
        method: String(error.config?.method || "GET").toUpperCase(),
        url: requestUrl,
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
