import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getMyTasks } from "@/src/api/tasks.api";
import TaskCard from "@/src/components/TaskCard";
import { Task } from "@/src/types/task";

export default function IncompleteTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data.filter((t) => t.status === "incomplete"));
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() =>
        router.push(
          `/task-detail?task=${encodeURIComponent(JSON.stringify(item))}`
        )
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.heading}>Incomplete Tasks</Text>
      <Text style={styles.subHeading}>
        Tasks that need rework or attention
      </Text>

      {/* LIST */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No incomplete tasks 🎉
            </Text>
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
    padding: 16,
    backgroundColor: "#f8fafc",
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },

  subHeading: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
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