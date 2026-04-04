import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/signout") }>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});