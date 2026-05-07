import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getMyTasks, reviveTask } from "@/src/api/task.api";
import { Task } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";

export default function IncompleteTasks() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviving, setReviving] = useState<string | null>(null);
  const router = useRouter();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyTasks();
      setTasks((data || []).filter((t: Task) => t.status === "incompleted"));
    } catch (e: any) {
      console.log("Error:", e.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const handleRevive = async (taskId: string) => {
    setReviving(taskId);
    try {
      await reviveTask(taskId);
      await loadTasks();
    } catch (e: any) {
      console.log("Revive error:", e.message);
    } finally {
      setReviving(null);
    }
  };

  const getLocation = (t: Task) => {
    const c = t.complaintId;
    if (c.type === "campus") return c.area;
    if (c.visibility === "public") return `${c.hostelName} — ${c.landmark}`;
    return `${c.hostelName} — Floor ${c.floor}, Room ${c.roomNumber}`;
  };

  const renderItem = ({ item }: { item: Task }) => {
    const c = item.complaintId;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDesc} numberOfLines={2}>{c.description}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Incomplete</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="#378ADD" />
            <Text style={styles.metaText} numberOfLines={1}>{getLocation(item)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#B4B2A9" />
            <Text style={styles.metaText}>
              {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </Text>
          </View>
        </View>

        {item.notes && (
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Worker note</Text>
            <Text style={styles.noteText}>{item.notes}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.reviveBtn, reviving === item._id && styles.reviveBtnDisabled]}
          onPress={() => handleRevive(item._id)}
          disabled={reviving === item._id}
        >
          <Ionicons name="refresh" size={15} color="#fff" />
          <Text style={styles.reviveBtnText}>
            {reviving === item._id ? "Reviving..." : "Revive task"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#185FA5" />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#185FA5" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Incomplete tasks</Text>
      <Text style={styles.pageSub}>Tasks that need rework or attention</Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No incomplete tasks</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a" },
  pageSub: { fontSize: 13, color: "#888780", marginTop: 4, marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#D3D1C7", padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 },
  cardDesc: { fontSize: 14, fontWeight: "500", color: "#0f172a", flex: 1, lineHeight: 20 },
  badge: { backgroundColor: "#FCEBEB", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, flexShrink: 0 },
  badgeText: { fontSize: 11, fontWeight: "500", color: "#A32D2D" },
  metaRow: { flexDirection: "row", gap: 14, marginBottom: 12, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "#888780" },
  noteBox: { backgroundColor: "#FAEEDA", borderRadius: 10, borderLeftWidth: 3, borderLeftColor: "#EF9F27", padding: 12, marginBottom: 12 },
  noteLabel: { fontSize: 11, fontWeight: "500", color: "#854F0B", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  noteText: { fontSize: 13, color: "#633806", lineHeight: 18 },
  reviveBtn: { backgroundColor: "#185FA5", borderRadius: 10, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  reviveBtnDisabled: { backgroundColor: "#888780" },
  reviveBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});
