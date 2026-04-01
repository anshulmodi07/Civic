// central axios instance
import axios from "axios";
import { getToken } from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ replace with your computer IP
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

instance.interceptors.request.use(
  async (config) => {

    const token = await getToken();

    console.log("TOKEN USED:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired");

      await AsyncStorage.removeItem("token");
      // later: trigger logout from context
    }
    return Promise.reject(error);
  }
);

export default instance;