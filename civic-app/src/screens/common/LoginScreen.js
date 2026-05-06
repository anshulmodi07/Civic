import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/context/AuthContext";
import { API_BASE } from "@/src/api/axios";

const DEMO_USER_EMAIL = "demo@nitdelhi.ac.in";
const DEMO_USER_PASSWORD = "123456";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("user");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Details", "Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await login({
        method: loginType === "worker" ? "worker" : "user",
        email: email.trim(),
        password,
      });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Invalid credentials";
      const detail =
        message === "Network Error"
          ? `Could not reach ${API_BASE}. Confirm the backend is running and this exact URL opens on your phone.`
          : message;
      Alert.alert("Login Failed", detail);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = () => {
    setLoginType("user");
    setEmail(DEMO_USER_EMAIL);
    setPassword(DEMO_USER_PASSWORD);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={44} color="#fff" />
          </View>
          <Text style={styles.title}>Civic Portal</Text>
          <Text style={styles.subtitle}>Sign in to manage civic complaints</Text>
        </View>

        <View style={styles.formContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Sign In</Text>
              <Text style={styles.formSubtitle}>Use your registered email and password</Text>

              <TouchableOpacity
                style={styles.demoButton}
                onPress={fillDemoUser}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Ionicons name="flash-outline" size={18} color="#2563eb" />
                <View style={styles.demoContent}>
                  <Text style={styles.demoTitle}>Use demo user</Text>
                  <Text style={styles.demoSubtitle}>{DEMO_USER_EMAIL}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>

              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segmentButton, loginType === "user" && styles.segmentButtonActive]}
                  onPress={() => setLoginType("user")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={loginType === "user" ? "#fff" : "#2563eb"}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      loginType === "user" && styles.segmentTextActive,
                    ]}
                  >
                    User
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.segmentButton, loginType === "worker" && styles.segmentButtonActive]}
                  onPress={() => setLoginType("worker")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="construct-outline"
                    size={18}
                    color={loginType === "worker" ? "#fff" : "#2563eb"}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      loginType === "worker" && styles.segmentTextActive,
                    ]}
                  >
                    Worker
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={styles.loginButton}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#fff" />
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </>
                )}
              </TouchableOpacity>

              {loginType === "user" && (
                <>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>New user?</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push("/register")}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-add-outline" size={20} color="#2563eb" />
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.footer}>
                <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                <Text style={styles.footerText}>Official College Portal</Text>
              </View>
              {__DEV__ ? <Text style={styles.apiText}>API: {API_BASE}</Text> : null}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a8a",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 76,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.82)",
    fontWeight: "500",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: "0px 16px 40px rgba(15, 23, 42, 0.08)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 20,
    fontWeight: "500",
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "700",
  },
  demoSubtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  segmentButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  segmentButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  segmentText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    flexDirection: "row",
    gap: 8,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  registerButton: {
    flexDirection: "row",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 6,
    fontWeight: "500",
  },
  apiText: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 11,
    textAlign: "center",
  },
});
