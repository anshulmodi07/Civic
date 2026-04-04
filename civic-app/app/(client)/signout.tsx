import { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";

export default function ClientSignOut() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const doSignOut = async () => {
      await logout();
      router.replace("/login");
    };

    doSignOut();
  }, [logout, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signing out...</Text>
      <Text style={styles.subtitle}>Please wait while we return you to login.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
  },
});
