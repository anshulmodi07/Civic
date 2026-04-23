import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe, googleLogin, workerLogin } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch (err) {
        await AsyncStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  // 🔐 LOGIN HANDLER
  const login = async (data) => {
    let response;

    if (data.method === "google") {
      response = await googleLogin(data.token);
    } else if (data.method === "worker") {
      response = await workerLogin({
        email: data.email,
        password: data.password,
      });
    }

    const token = response.token;
    await AsyncStorage.setItem("token", token);

    const userData = await getMe();
    setUser(userData);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isWorker: user?.role === "worker",
        isUser: user?.role === "user",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};