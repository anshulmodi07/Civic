import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getMyTasks } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await getMyTasks();
    setTasks(data);
  };

  const active = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const todayShift = tasks[0]?.shift || "off";

  const actions = [
    {
      title: "All Tasks",
      sub: "Browse available work",
      route: "/all-tasks",
      icon: "list-outline" as const,
      color: "#185FA5",
      bg: "#E6F1FB",
    },
    {
      title: "My Tasks",
      sub: "Track assigned work",
      route: "/my-tasks",
      icon: "checkmark-circle-outline" as const,
      color: "#3B6D11",
      bg: "#EAF3DE",
    },
    {
      title: "Incomplete Tasks",
      sub: "Tasks needing attention",
      route: "/incomplete-tasks",
      icon: "time-outline" as const,
      color: "#854F0B",
      bg: "#FAEEDA",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Good morning</Text>
      <Text style={styles.pageTitle}>Worker Dashboard</Text>

      {/* SHIFT CARD */}
      <View style={styles.shiftCard}>
        <Text style={styles.shiftLabel}>Today's shift</Text>
        <View style={styles.shiftRow}>
          <Text style={styles.shiftName}>{todayShift.toUpperCase()}</Text>
          <View style={styles.shiftTimePill}>
            <Text style={styles.shiftTimeText}>6:00 AM – 2:00 PM</Text>
          </View>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { num: active, label: "Active" },
          { num: completed, label: "Completed" },
          { num: total, label: "Total" },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick actions</Text>
      {actions.map((a) => (
        <TouchableOpacity
          key={a.route}
          style={styles.actionCard}
          onPress={() => router.push(a.route as any)}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
              <Ionicons name={a.icon} size={18} color={a.color} />
            </View>
            <View>
              <Text style={styles.actionTitle}>{a.title}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#B4B2A9" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  greeting: { fontSize: 13, color: "#888780", marginTop: 8 },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a", marginBottom: 20, marginTop: 4 },

  shiftCard: {
    backgroundColor: "#185FA5",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  shiftLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8 },
  shiftRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  shiftName: { fontSize: 20, fontWeight: "500", color: "#fff" },
  shiftTimePill: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  shiftTimeText: { fontSize: 12, color: "rgba(255,255,255,0.85)" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#F1EFE8",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNum: { fontSize: 20, fontWeight: "500", color: "#185FA5" },
  statLabel: { fontSize: 11, color: "#888780", marginTop: 2 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888780",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: { fontSize: 14, fontWeight: "500", color: "#0f172a" },
  actionSub: { fontSize: 12, color: "#888780", marginTop: 1 },
});