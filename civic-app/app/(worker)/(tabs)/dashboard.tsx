import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getMyTasks } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data);
  };

  /* ---------------- STATS ---------------- */
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome 👷</Text>
        <Text style={styles.name}>Worker Dashboard</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.primaryCard}
        onPress={() => router.push("/all-tasks")}
      >
        <Text style={styles.primaryTitle}>View All Tasks</Text>
        <Text style={styles.primarySubtitle}>
          Browse and accept available work
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryCard}
        onPress={() => router.push("/my-tasks")}
      >
        <Text style={styles.secondaryTitle}>My Tasks</Text>
        <Text style={styles.secondarySubtitle}>
          Track your assigned work
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryCard}
        onPress={() => router.push("/incomplete-tasks")}
      >
        <Text style={styles.secondaryTitle}>Incomplete Tasks</Text>
        <Text style={styles.secondarySubtitle}>
          Tasks marked incomplete
        </Text>
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

  header: {
    marginBottom: 20,
  },

  welcome: {
    fontSize: 14,
    color: "#64748b",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },

  primaryCard: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  primaryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  primarySubtitle: {
    color: "#dbeafe",
    fontSize: 12,
    marginTop: 4,
  },

  secondaryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  secondaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  secondarySubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});