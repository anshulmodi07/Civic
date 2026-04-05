import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllTasks, acceptTask } from "@/src/api/tasks.api";
import TaskCard from "@/src/components/TaskCard";
import { useRouter } from "expo-router";
import { Task } from "@/src/types/task";

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  const handleAccept = async (id: string) => {
    await acceptTask(id);
    loadTasks();
  };

  /* ---------------- STATS ---------------- */
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.cardWrapper}>
      <TaskCard
        task={item}
        onPress={() =>
          router.push({
            pathname: "/task-detail",
            params: { task: JSON.stringify(item) },
          })
        }
      />

      {/* ACCEPT BUTTON */}
      {item.status === "pending" && (
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>All Tasks</Text>
        <Text style={styles.subHeading}>Available tasks to pick</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks available 🚀</Text>
          </View>
        }
      />
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
    marginBottom: 16,
  },

  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },

  subHeading: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

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

  cardWrapper: {
    marginBottom: 16,
  },

  acceptButton: {
    marginTop: 8,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  acceptButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyState: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
});