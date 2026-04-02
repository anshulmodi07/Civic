import { View, FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getMyTasks } from "../../src/api/tasks.api";
import TaskCard from "../../src/components/TaskCard";

export default function IncompleteTasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data.filter((t) => t.status === "incomplete"));
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
        renderItem={({ item }) => <TaskCard task={item} />}
      />
    </View>
  );
}