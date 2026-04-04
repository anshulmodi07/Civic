import { View, FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { getMyTasks } from "../../../src/api/tasks.api";
import TaskCard from "../../../src/components/TaskCard";


type Task = {
  id: string;
  status: string;
  [key: string]: any;
};

export default function IncompleteTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data.filter((t: Task) => t.status === "incomplete"));
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => router.push(`/task/${item.id}`)} // ✅ FIXED
          />
        )}
      />
    </View>
  );
}