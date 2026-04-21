import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getMyTasks, reviveTask } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";

export default function IncompleteTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data.filter((t) => t.status === "incomplete"));
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, []));

  const handleRevive = async (id: string) => {
    await reviveTask(id);
    await loadTasks();
  };

  const renderItem = ({ item }: { item: Task }) => (
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
        <Text style={styles.cardTitle}>{item.issueType}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Incomplete</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <View style={[styles.metaDot, { backgroundColor: "#378ADD" }]} />
          <Text style={styles.metaText}>
            {item.type === "campus"
              ? item.landmark
              : `${item.hostelName} — Floor ${item.floor}, Room ${item.room}`}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <View style={[styles.metaDot, { backgroundColor: "#B4B2A9" }]} />
          <Text style={styles.metaText}>{item.reportedAt}</Text>
        </View>
      </View>

      {item.note && (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Worker's note</Text>
          <Text style={styles.noteText}>{item.note}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.reviveBtn} onPress={() => handleRevive(item.id)}>
        <Ionicons name="refresh" size={15} color="#fff" />
        <Text style={styles.reviveBtnText}>Revive task</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
        keyExtractor={(item) => item.id}
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
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a" },
  pageSub: { fontSize: 13, color: "#888780", marginTop: 4, marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#0f172a", flex: 1, marginRight: 8 },
  badge: {
    backgroundColor: "#FCEBEB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "500", color: "#A32D2D" },

  metaRow: { flexDirection: "row", gap: 14, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaDot: { width: 5, height: 5, borderRadius: 3 },
  metaText: { fontSize: 12, color: "#888780" },

  noteBox: {
    backgroundColor: "#FAEEDA",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#EF9F27",
    padding: 12,
    marginBottom: 12,
  },
  noteLabel: { fontSize: 11, fontWeight: "500", color: "#854F0B", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  noteText: { fontSize: 13, color: "#633806", lineHeight: 18 },

  reviveBtn: {
    backgroundColor: "#185FA5",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  reviveBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },

  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});