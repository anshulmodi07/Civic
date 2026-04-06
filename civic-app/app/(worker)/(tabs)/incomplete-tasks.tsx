import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getMyTasks } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";

export default function IncompleteTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data.filter((t) => t.status === "incomplete"));
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.issueType}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>❌ INCOMPLETE</Text>
        </View>
      </View>

      <Text style={styles.location}>
        {item.type === "campus"
          ? `📍 ${item.landmark}`
          : `🏢 ${item.hostelName} — Floor ${item.floor}, Room ${item.room}`}
      </Text>

      <Text style={styles.time}>🕒 {item.reportedAt}</Text>

      {/* WORKER COMMENT */}
      {item.note && (
        <View style={styles.commentBox}>
          <Text style={styles.commentLabel}>Worker's Note:</Text>
          <Text style={styles.commentText}>{item.note}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Incomplete Tasks</Text>
      <Text style={styles.subHeading}>Tasks that need rework or attention</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No incomplete tasks 🎉</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  backBtn: { marginBottom: 12, marginTop: 8 },
  backText: { fontSize: 14, color: "#2563eb", fontWeight: "600" },
  heading: { fontSize: 22, fontWeight: "800", color: "#0f172a", marginBottom: 4 },
  subHeading: { fontSize: 13, color: "#64748b", marginBottom: 16 },
  card: {
    backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a", flex: 1 },
  badge: { backgroundColor: "#fee2e2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#dc2626" },
  location: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  time: { fontSize: 12, color: "#94a3b8", marginBottom: 8 },
  commentBox: {
    backgroundColor: "#fef9c3", padding: 10, borderRadius: 10,
    borderLeftWidth: 3, borderLeftColor: "#eab308",
  },
  commentLabel: { fontSize: 11, fontWeight: "700", color: "#92400e", marginBottom: 4 },
  commentText: { fontSize: 13, color: "#1c1917" },
  emptyState: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#64748b", fontSize: 14 },
});