import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * TEMP REGISTER HANDLER
   * (Until backend register API is added)
   */
  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // 🔥 TEMP: No backend register yet
      Alert.alert(
        "Registration Info",
        "Registration is not implemented yet.\nPlease login directly.",
        [
          {
            text: "Go to Login",
            onPress: () => router.push("/login"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join the civic platform
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Register</Text>

              {/* Name */}
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                style={styles.input}
              />

              {/* Email */}
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
              />

              {/* Password */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  style={styles.passwordInput}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              {/* Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#2563eb", "#1e40af"]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? "Processing..." : "Register"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Switch to login */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 20 }}
              >
                <Text style={{ textAlign: "center", color: "#2563eb" }}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* STYLES (clean + minimal) */
const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  header: {
    marginTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    color: "#ddd",
  },

  formContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    height: 50,
  },

  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});