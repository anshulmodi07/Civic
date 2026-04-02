import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

export default function TaskCard({ task, onPress }) {
  return (
    <TouchableOpacity
  style={[
    styles.card,
    task.status === "completed" && {
  backgroundColor: "#E5E7EB",
  opacity: 0.7
}
  ]}
  onPress={onPress}
  activeOpacity={0.7}
>
      <View style={styles.cardContent}>
        {/* LEFT ICON */}
        <Ionicons name="construct-outline" size={22} color="#4F46E5" />

        {/* TASK INFO */}
        <View style={styles.taskInfo}>
          {/* TITLE */}
          <Text style={styles.title}>{task.issueType}</Text>

          {/* TYPE BASED */}
          {task.type === "campus" ? (
            <>
              <Text style={styles.subText}>📍 {task.landmark}</Text>
              <Text style={styles.subText}>🏠 {task.address}</Text>
            </>
          ) : (
            <>
              <Text style={styles.subText}>🏢 {task.hostelName}</Text>
              <Text style={styles.subText}>
                📍 Floor {task.floor} | Room {task.room}
              </Text>
            </>
          )}

          {/* TIME */}
          <Text style={styles.time}>🕒 {task.reportedAt}</Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightSection}>
          <StatusBadge status={task.status} size="small" />

          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subText: {
    fontSize: 13,
    color: "#6B7280",
  },

  time: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },

  rightSection: {
    alignItems: "flex-end",
    gap: 6,
  },

  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});