import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginWorker, loginUser } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 load token on app start
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        // optional: fetch user later if needed
      }

      setLoading(false);
    };

    loadAuth();
  }, []);

  // 🔥 login
  const login = async (email, password, role = "worker") => {
    let res;
    if (role === "worker") {
      res = await loginWorker(email, password);
    } else {
      res = await loginUser(email, password);
    }

    const token = res.token;

    await AsyncStorage.setItem("token", token);

    setToken(token);
    setUser(role === "worker" ? res.worker : res.user);
  };

  // 🔥 logout
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 hook
export const useAuth = () => useContext(AuthContext);