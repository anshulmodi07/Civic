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
      const savedUserStr = await AsyncStorage.getItem("user");

      if (savedToken && savedUserStr) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUserStr));
        } catch(e) {
          console.error("Failed to parse user from storage", e);
        }
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
    const userData = role === "worker" ? res.worker : res.user;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
  };

  // 🔥 logout
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
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