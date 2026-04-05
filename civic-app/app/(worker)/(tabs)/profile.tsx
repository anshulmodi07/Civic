import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.heading}>Profile</Text>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👷</Text>
        </View>

        <Text style={styles.name}>Worker</Text>
        <Text style={styles.role}>Maintenance Staff</Text>
      </View>

      {/* OPTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.option}>
          <Text style={styles.optionText}>Edit Profile</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Settings</Text>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push("/signout")}
      >
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 30,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },

  role: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 10,
  },

  option: {
    paddingVertical: 10,
  },

  optionText: {
    fontSize: 15,
    color: "#0f172a",
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});