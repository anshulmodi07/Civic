import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";
import { Task } from "@/src/types/task";

type Props = {
  task: Task;
  onPress?: () => void;
};

export default function TaskCard({ task, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        task.status === "completed" && styles.completedCard,
      ]}
      onPress={onPress || (() => {})}
      activeOpacity={0.85}
    >
      <View style={styles.cardContent}>
        {/* LEFT ICON */}
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={22} color="#2563eb" />
        </View>

        {/* TASK INFO */}
        <View style={styles.taskInfo}>
          <Text style={styles.title}>{task.issueType}</Text>

          {task.type === "campus" ? (
            <>
              <Text style={styles.subText}>
                📍 {task.landmark || "Location"}
              </Text>
              <Text style={styles.subText}>
                🏠 {task.address || "Address"}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.subText}>
                🏢 {task.hostelName || "Hostel"}
              </Text>
              <Text style={styles.subText}>
                📍 Floor {task.floor || "-"} | Room {task.room || "-"}
              </Text>
            </>
          )}

          <Text style={styles.time}>🕒 {task.reportedAt}</Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightSection}>
          <StatusBadge status={task.status} compact />

          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  completedCard: {
    backgroundColor: "#f1f5f9",
    opacity: 0.75,
  },

  cardContent: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },

  taskInfo: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },

  subText: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },

  time: {
    marginTop: 6,
    fontSize: 12,
    color: "#94a3b8",
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
});