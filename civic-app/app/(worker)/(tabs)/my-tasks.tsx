import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { getMyTasks, startTask } from "@/src/api/tasks.api";
import { useFocusEffect, useRouter } from "expo-router";
import TaskCard from "@/src/components/TaskCard";
import { Task } from "@/src/types/task";

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
    // exclude incomplete tasks — they go to incomplete screen
    setTasks(data.filter((t) => t.status !== "incomplete"));
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const handleStart = async (id: string) => {
    await startTask(id);
    loadTasks();
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const renderItem = ({ item }: { item: Task }) => {
    const isCompleted = item.status === "completed";

    return (
      <View style={[styles.cardWrapper, isCompleted && styles.cardWrapperGrey]}>
        <TaskCard
          task={item}
          onPress={() =>
            router.push({
              pathname: "/(worker)/task-detail",
              params: { task: JSON.stringify(item) },
            } as any)
          }
        />

        <View style={styles.actions}>
          {item.status === "accepted" && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStart(item.id)}
            >
              <Text style={styles.startButtonText}>▶ Start Task</Text>
            </TouchableOpacity>
          )}
          {item.status === "in-progress" && (
            <Text style={styles.inProgressText}>🔄 In Progress</Text>
          )}
          {item.status === "completed" && (
            <Text style={styles.completedText}>✅ Completed</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.heading}>My Tasks</Text>
        <Text style={styles.subHeading}>Manage your assigned work</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet 🚀</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  backBtn: { marginBottom: 12, marginTop: 8 },
  backText: { fontSize: 14, color: "#2563eb", fontWeight: "600" },
  header: { marginBottom: 16 },
  heading: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  subHeading: { fontSize: 13, color: "#64748b", marginTop: 4 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: "#fff", padding: 14, borderRadius: 14,
    alignItems: "center", marginHorizontal: 4,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: "700", color: "#2563eb" },
  statLabel: { fontSize: 12, color: "#64748b" },
  cardWrapper: { marginBottom: 16 },
  cardWrapperGrey: { opacity: 0.5 }, // 👈 grey out completed
  actions: { marginTop: 8, alignItems: "flex-start" },
  startButton: {
    backgroundColor: "#2563eb", paddingVertical: 10,
    paddingHorizontal: 16, borderRadius: 12,
  },
  startButtonText: { color: "#fff", fontWeight: "600" },
  inProgressText: { color: "#3b82f6", fontWeight: "600" },
  completedText: { color: "#16a34a", fontWeight: "600" },
  emptyState: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#64748b", fontSize: 14 },
});