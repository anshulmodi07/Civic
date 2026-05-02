import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { getMyTasks } from "@/src/api/task.api";
import { useFocusEffect, useRouter } from "expo-router";
import { Task } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  "accepted":    { bg: "#E6F1FB", color: "#185FA5", label: "Pending" },
  "in-progress": { bg: "#FAEEDA", color: "#854F0B", label: "In Progress" },
  "completed":   { bg: "#EAF3DE", color: "#3B6D11", label: "Completed" },
};

export default function MyTasks() {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyTasks();
      // incompleted tasks live in their own tab
      setTasks((data || []).filter((t: Task) => t.status !== "incompleted"));
    } catch (e: any) {
      console.log("Error:", e.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const getLocation = (t: Task) => {
    const c = t.complaintId;
    if (c.type === "campus") return c.area;
    if (c.visibility === "public") return `${c.hostelName} — ${c.landmark}`;
    return `${c.hostelName} — Floor ${c.floor}, Room ${c.roomNumber}`;
  };

  const renderItem = ({ item }: { item: Task }) => {
    const c = item.complaintId;
    const s = STATUS_STYLE[item.status];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/(worker)/task-detail",
            params: { task: JSON.stringify(item) },
          } as any)
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDesc} numberOfLines={2}>{c.description}</Text>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
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

        {item.status === "accepted" && (
          <View style={styles.hint}>
            <Ionicons name="play-circle-outline" size={13} color="#185FA5" />
            <Text style={styles.hintText}>Tap to open and start</Text>
          </View>
        )}
        {item.status === "in-progress" && (
          <View style={styles.hint}>
            <Ionicons name="ellipse" size={8} color="#854F0B" />
            <Text style={[styles.hintText, { color: "#854F0B" }]}>Currently in progress</Text>
          </View>
        )}
      </TouchableOpacity>
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

      <Text style={styles.pageTitle}>My tasks</Text>
      <Text style={styles.pageSub}>Manage your assigned work</Text>

      <View style={styles.statsRow}>
        {[
          { num: tasks.length,                                         label: "Total" },
          { num: tasks.filter(t => t.status === "in-progress").length, label: "Active" },
          { num: tasks.filter(t => t.status === "completed").length,   label: "Done" },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a" },
  pageSub: { fontSize: 13, color: "#888780", marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#F1EFE8", borderRadius: 12, padding: 14, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "500", color: "#185FA5" },
  statLabel: { fontSize: 11, color: "#888780" },
  card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#D3D1C7", padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 },
  cardDesc: { fontSize: 14, fontWeight: "500", color: "#0f172a", flex: 1, lineHeight: 20 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, flexShrink: 0 },
  badgeText: { fontSize: 11, fontWeight: "500" },
  metaRow: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "#888780" },
  hint: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  hintText: { fontSize: 12, color: "#185FA5" },
  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});