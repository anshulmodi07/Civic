import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCallback, useContext, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { getAllTasks, acceptTask } from "@/src/api/tasks.api";
import TaskCard from "@/src/components/TaskCard";
import { Task } from "@/src/types/task";
import { AuthContext } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data.filter((t) => t.issueType === user?.department));
    } catch (e) {
      console.log("Error loading tasks:", e);
    }
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, [user]));

  const handleAccept = async (id: string) => {
    await acceptTask(id);
    await loadTasks();
  };

  const stats = {
    available: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.cardWrapper}>
      <TaskCard
        task={item}
        onPress={() =>
          router.push({
            pathname: "/(worker)/task-detail",
            params: { task: JSON.stringify(item) },
          } as any)
        }
      />
      {item.status === "pending" && (
        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
          <Text style={styles.acceptBtnText}>Accept task</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* BACK */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#185FA5" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>All tasks</Text>
      <Text style={styles.pageSub}>Tasks available for your department</Text>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { num: stats.available, label: "Available" },
          { num: stats.pending, label: "Pending" },
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
            <Text style={styles.emptyText}>No tasks for your department</Text>
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
    flex: 1,
    backgroundColor: "#F1EFE8",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  statNum: { fontSize: 20, fontWeight: "500", color: "#185FA5" },
  statLabel: { fontSize: 11, color: "#888780" },

  cardWrapper: { marginBottom: 14 },
  acceptBtn: {
    marginTop: 8,
    backgroundColor: "#3B6D11",
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptBtnText: { color: "#fff", fontWeight: "500", fontSize: 14 },

  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});