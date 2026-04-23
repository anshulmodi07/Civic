import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, StatusBar } from "react-native";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DEMO_CLIENT_EMAIL = "demo@civicmitra.com";
const DEMO_WORKER_EMAIL = "worker@demo.com";
const DEMO_PASSWORD = "demo1234";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState(null); // "user" | "worker"

  useEffect(() => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });
}, []);

  const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

   if (!userInfo.idToken) {
  throw new Error("Google ID token not found");
  }

    await login({
      method: "google",
      token: userInfo.idToken,
    });

  } catch (err) {
    Alert.alert("Login Failed", err.message || "Google login failed");
  } finally {
    setIsLoading(false);
  }
};

const handleWorkerLogin = async () => {
  try {
    setIsLoading(true);

    await login({
      method: "worker",
      email,
      password,
    });

  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Invalid credentials";

    Alert.alert("Login Failed", message);
  } finally {
    setIsLoading(false);
  }
};

  const fillDemoCredentials = () => {
  if (!loginType) {
    Alert.alert("Please select login type first");
    return;
  }

  const demoEmail =
    loginType === "worker"
      ? DEMO_WORKER_EMAIL
      : DEMO_CLIENT_EMAIL;

  setEmail(demoEmail);
  setPassword(DEMO_PASSWORD);
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield-checkmark" size={48} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>Civic Portal</Text>
          <Text style={styles.subtitle}>Empowering Citizens, Building Communities</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ paddingBottom: 40 }}
  >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>Access your civic dashboard</Text>

            {/* <Button color="blue" height = {50} title="Test Backend" onPress={testBackend} /> */}

            {/* Email Input */}
            {/* <View style={styles.inputGroup}>
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
            </View> */}

            {/* Password Input */}
            {/* <View style={styles.inputGroup}>
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
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Demo Badge */}
            <TouchableOpacity 
              style={styles.demoBadge}
              onPress={fillDemoCredentials}
              activeOpacity={0.7}
            >
              <Ionicons name="flash" size={14} color="#f59e0b" />
              <Text style={styles.demoText}>Quick Demo: auto-fill client or worker credentials</Text>
            </TouchableOpacity>

            {!loginType && (
  <View style={{ marginBottom: 20, gap: 10 }}>
    <TouchableOpacity
      style={styles.loginButton}
      onPress={() => setLoginType("user")}
    >
      <Text style={styles.loginButtonText}>Login as User</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.loginButton, { backgroundColor: '#1e40af' }]}
      onPress={() => setLoginType("worker")}
    >
      <Text style={styles.loginButtonText}>Login as Worker</Text>
    </TouchableOpacity>
  </View>
)}

{loginType === "user" && (
  <TouchableOpacity
    onPress={handleGoogleLogin}
    style={styles.loginButton}
    disabled={isLoading}
  >
    <Text style={styles.loginButtonText}>
      {isLoading ? "Please wait..." : "Continue with Google"}
    </Text>
  </TouchableOpacity>
)}

{loginType === "worker" && (
  <>
    {/* Email Input */}
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

    {/* Password Input */}
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
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748b"
          />
        </TouchableOpacity>
      </View>
    </View>

    {/* Login Button */}
    <TouchableOpacity onPress={handleWorkerLogin} disabled={isLoading} style={styles.loginButton}>
      <Text style={styles.loginButtonText}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Text>
    </TouchableOpacity>
  </>
)}

{loginType && (
  <TouchableOpacity
    onPress={() => setLoginType(null)}
    style={{ marginTop: 10 }}
  >
    <Text style={{ textAlign: "center", color: "#2563eb" }}>
      ← Change Login Type
    </Text>
  </TouchableOpacity>
)}

            

            {/* Divider
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Don't have an account?</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={20} color="#2563eb" />
              <Text style={styles.registerButtonText}>Create New Account</Text>
            </TouchableOpacity> */}

            {/* Footer Info */}
            <View style={styles.footer}>
              <Ionicons name="information-circle-outline" size={16} color="#64748b" />
              <Text style={styles.footerText}>Official College Portal - Secure Login</Text>
            </View>
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
    backgroundColor: '#1e3a8a',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 16px 40px rgba(15, 23, 42, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 24,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  demoText: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '600',
    marginLeft: 6,
  },
  loginButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(37, 99, 235, 0.18)',
      },
      default: {
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  registerButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
});