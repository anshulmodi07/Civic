import { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe, userLogin, userRegister, workerLogin } from "../api/auth.api";

export const AuthContext = createContext();

const TOKEN_STORAGE_KEY = "token";

const getTokenFromResponse = (response) => response?.token;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch (_err) {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (data) => {
    let response;

    if (data.method === "worker") {
      response = await workerLogin({
        email: data.email,
        password: data.password,
      });
    } else {
      response = await userLogin({
        email: data.email,
        password: data.password,
      });
    }

    const token = getTokenFromResponse(response);
    if (!token) throw new Error("Login did not return a session token");

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    const userData = await getMe();
    setUser(userData);
  };

  const register = async (data) => {
    const response = await userRegister(data);
    const token = getTokenFromResponse(response);
    if (!token) throw new Error("Registration did not return a session token");

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    const userData = await getMe();
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isWorker: user?.role === "worker",
      isUser: user?.role === "client",
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
