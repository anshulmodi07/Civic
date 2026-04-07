import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useCallback, useContext } from "react";
import { useRouter, useFocusEffect } from "expo-router";

import { getMyTasks, getAllTasks } from "@/src/api/tasks.api";
import { Task } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/context/AuthContext";

export default function Dashboard() {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  /* ---------------- LOAD TASKS ---------------- */

  const loadTasks = async () => {
    try {
      const [my, all] = await Promise.all([
        getMyTasks(),
        getAllTasks(),
      ]);

      // 🔥 filter by department
      const filteredAll = all.filter(
        (t) => t.issueType === user?.department
      );

      const filteredMy = my.filter(
        (t) => t.issueType === user?.department
      );

      setMyTasks(filteredMy);
      setAllTasks(filteredAll);
    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  };

  /* ---------------- REFRESH ON FOCUS ---------------- */

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [user])
  );

  /* ---------------- STATS ---------------- */

  const stats = {
    active: myTasks.filter((t) => t.status === "in-progress").length,
    completed: myTasks.filter((t) => t.status === "completed").length,
    total: myTasks.length, // accepted + in-progress
    pending: allTasks.length, // available tasks
    incomplete: myTasks.filter((t) => t.status === "incomplete").length,
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome 👷</Text>
          <Text style={styles.name}>Worker Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() =>
            router.push("/(worker)/(tabs)/profile" as any)
          }
        >
          <Ionicons
            name="person-circle-outline"
            size={38}
            color="#2563eb"
          />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* ALL TASKS */}
      <TouchableOpacity
        style={styles.navCard}
        onPress={() =>
          router.push("/(worker)/(tabs)/all-tasks" as any)
        }
      >
        <View style={styles.navCardLeft}>
          <View style={[styles.iconBox, { backgroundColor: "#dbeafe" }]}>
            <Ionicons name="list-outline" size={22} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.navCardTitle}>All Tasks</Text>
            <Text style={styles.navCardSub}>
              Tasks available for you
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          {stats.pending > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {stats.pending} pending
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94a3b8"
          />
        </View>
      </TouchableOpacity>

      {/* MY TASKS */}
      <TouchableOpacity
        style={styles.navCard}
        onPress={() =>
          router.push("/(worker)/(tabs)/my-tasks" as any)
        }
      >
        <View style={styles.navCardLeft}>
          <View style={[styles.iconBox, { backgroundColor: "#d1fae5" }]}>
            <Ionicons name="briefcase-outline" size={22} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.navCardTitle}>My Tasks</Text>
            <Text style={styles.navCardSub}>
              Track your assigned work
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          {stats.active > 0 && (
            <View style={[styles.badge, { backgroundColor: "#dbeafe" }]}>
              <Text style={[styles.badgeText, { color: "#2563eb" }]}>
                {stats.active} active
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94a3b8"
          />
        </View>
      </TouchableOpacity>

      {/* INCOMPLETE TASKS */}
      <TouchableOpacity
        style={styles.navCard}
        onPress={() =>
          router.push("/(worker)/(tabs)/incomplete-tasks" as any)
        }
      >
        <View style={styles.navCardLeft}>
          <View style={[styles.iconBox, { backgroundColor: "#fee2e2" }]}>
            <Ionicons name="alert-circle-outline" size={22} color="#dc2626" />
          </View>
          <View>
            <Text style={styles.navCardTitle}>Incomplete Tasks</Text>
            <Text style={styles.navCardSub}>
              Tasks needing attention
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          {stats.incomplete > 0 && (
            <View style={[styles.badge, { backgroundColor: "#fee2e2" }]}>
              <Text style={[styles.badgeText, { color: "#dc2626" }]}>
                {stats.incomplete} incomplete
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94a3b8"
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },

  welcome: {
    fontSize: 14,
    color: "#64748b",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },

  profileBtn: {
    padding: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },

  navCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  navCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  navCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  navCardSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  badge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d97706",
  },
});