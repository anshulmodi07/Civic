import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 your backend URL
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

// 🔥 attach token automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    console.log("TOKEN USED:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired");
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;