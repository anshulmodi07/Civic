import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getMyTasks } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMyTasks();
    setTasks(data);
  };

  // 🔥 STATS
  const active = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;

  // 🔥 SHIFT (for now from tasks)
  const todayShift = tasks[0]?.shift || "off";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Worker Dashboard 👷</Text>

      {/* SHIFT CARD */}
      <View style={styles.shiftCard}>
        <Text style={styles.shiftLabel}>Today's Shift</Text>
        <Text style={styles.shiftValue}>
          {todayShift.toUpperCase()}
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/all-tasks")}
      >
        <Text style={styles.actionTitle}>All Tasks</Text>
        <Text style={styles.actionSub}>
          View available tasks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/my-tasks")}
      >
        <Text style={styles.actionTitle}>My Tasks</Text>
        <Text style={styles.actionSub}>
          Track your assigned work
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/incomplete-tasks")}
      >
        <Text style={styles.actionTitle}>Incomplete Tasks</Text>
        <Text style={styles.actionSub}>
          Tasks needing attention
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0f172a",
  },

  /* SHIFT */
  shiftCard: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  shiftLabel: {
    color: "#c7d2fe",
    fontSize: 13,
  },

  shiftValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
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

  /* ACTIONS */
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0f172a",
  },

  actionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  actionSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});