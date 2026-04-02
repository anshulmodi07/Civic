import {
  View,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import { getMyTasks, startTask } from "../../src/api/tasks.api";
import { useFocusEffect, useRouter } from "expo-router";
import TaskCard from "../../src/components/TaskCard";
import { Text } from "react-native";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await getMyTasks();
    setTasks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleStart = async (id) => {
    await startTask(id);
    loadTasks();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {/* CARD */}
            <TaskCard
              task={item}
              onPress={() =>
                router.push({
                  pathname: "/task-detail",
                  params: { task: JSON.stringify(item) },
                })
              }
            />

            {/* START BUTTON */}
            {item.status === "accepted" && (
              <Button
                title="Start Task"
                onPress={() => handleStart(item.id)}
              />
            )}

            {/* STATUS TEXT */}
            {item.status === "in-progress" && (
              <Text style={{ color: "blue" }}>
                Work in progress...
              </Text>
            )}

            {item.status === "completed" && (
              <Text style={{ color: "green" }}>
                ✅ Completed
              </Text>
            )}

            {item.status === "incomplete" && (
              <Text style={{ color: "red" }}>
                ❌ Incomplete
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});