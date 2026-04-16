import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { getMyTasks, startTask } from "@/src/api/tasks.api";
import { useFocusEffect, useRouter } from "expo-router";
import TaskCard from "@/src/components/TaskCard";
import { Task } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
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
      <View style={[styles.cardWrapper, isCompleted && styles.cardFaded]}>
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
            <TouchableOpacity style={styles.startBtn} onPress={() => handleStart(item.id)}>
              <Ionicons name="play" size={14} color="#fff" />
              <Text style={styles.startBtnText}>Start task</Text>
            </TouchableOpacity>
          )}
          {item.status === "in-progress" && (
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: "#378ADD" }]} />
              <Text style={[styles.statusText, { color: "#185FA5" }]}>In progress</Text>
            </View>
          )}
          {item.status === "completed" && (
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: "#3B6D11" }]} />
              <Text style={[styles.statusText, { color: "#3B6D11" }]}>Completed</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#185FA5" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>My tasks</Text>
      <Text style={styles.pageSub}>Manage your assigned work</Text>

      <View style={styles.statsRow}>
        {[
          { num: stats.total, label: "Total" },
          { num: stats.inProgress, label: "Active" },
          { num: stats.completed, label: "Completed" },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a" },
  pageSub: { fontSize: 13, color: "#888780", marginTop: 4, marginBottom: 20 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: "#F1EFE8", borderRadius: 12, padding: 14, alignItems: "center",
  },
  statNum: { fontSize: 20, fontWeight: "500", color: "#185FA5" },
  statLabel: { fontSize: 11, color: "#888780" },

  cardWrapper: { marginBottom: 14 },
  cardFaded: { opacity: 0.5 },
  actions: { marginTop: 8, alignItems: "flex-start" },

  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#185FA5",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  startBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },

  statusPill: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 13, fontWeight: "500" },

  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});