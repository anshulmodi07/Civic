import {
  View,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllTasks, acceptTask } from "@/src/api/tasks.api";
import TaskCard from "@/src/components/TaskCard";
import { useRouter } from "expo-router";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  const handleAccept = async (id) => {
    await acceptTask(id);
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

            {/* ACCEPT BUTTON */}
            {item.status === "pending" && (
              <Button
                title="Accept Task"
                onPress={() => handleAccept(item.id)}
              />
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