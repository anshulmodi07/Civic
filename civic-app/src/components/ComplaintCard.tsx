import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";
import { Task } from "@/src/types/task";

type Props = {
  task: Task;
  onPress?: () => void;
};

export default function TaskCard({ task, onPress }: Props) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "#8b5cf6";
      case "in-progress":
        return "#3b82f6";
      case "completed":
        return "#22c55e";
      case "incomplete":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${getStatusColor(task.status)}15` },
            ]}
          >
            <Ionicons
              name="construct-outline"
              size={22}
              color={getStatusColor(task.status)}
            />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {task.issueType}
            </Text>
            <Text style={styles.date}>{task.reportedAt}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      {/* DESCRIPTION */}
      <Text style={styles.summary} numberOfLines={2}>
        {task.description || "No description provided"}
      </Text>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.badges}>
          <StatusBadge status={task.status} compact />
        </View>

        <View style={styles.meta}>
          {task.type === "campus" ? (
            <Text style={styles.metaText}>📍 {task.landmark}</Text>
          ) : (
            <Text style={styles.metaText}>
              🏢 {task.hostelName} | {task.room}
            </Text>
          )}
        </View>
      </View>

      {/* PRIORITY BAR */}
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: getStatusColor(task.status) },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    position: "relative",
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },

  date: {
    fontSize: 13,
    color: "#64748b",
  },

  summary: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badges: {
    flexDirection: "row",
    gap: 8,
  },

  meta: {},

  metaText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  priorityBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});