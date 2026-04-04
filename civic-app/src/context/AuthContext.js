import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe, login as loginAPI } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch (err) {
        console.log("Session restore failed:", err.message);
        await AsyncStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 🔐 LOGIN
  const login = async ({ email, name, role, password }) => {
    try {
      const response = await loginAPI({ email, name, role, password });

      const token = response.token;

      await AsyncStorage.setItem("token", token);

      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  // 🧠 ROLE HELPERS
  const isWorker = user?.role === "worker";
  const isClient = user?.role === "client";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isWorker,
        isClient,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};