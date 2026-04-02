import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  startTask,
  completeTask,
  getAllTasks,
  getMyTasks,
} from "../src/api/tasks.api";

export default function TaskDetail() {
  const router = useRouter();
  const { task } = useLocalSearchParams();

  // ✅ FIX: handle string | string[]
  const taskString = Array.isArray(task) ? task[0] : task;
  const parsedTask = JSON.parse(taskString);

  const [currentTask, setCurrentTask] = useState(parsedTask);
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  // 🔄 LOAD LATEST TASK
  const loadTask = async () => {
    const allTasks = [
      ...(await getAllTasks()),
      ...(await getMyTasks()),
    ];

    const updated = allTasks.find((t) => t.id === parsedTask.id);
    if (updated) setCurrentTask(updated);
  };

  useEffect(() => {
    loadTask();
  }, []);

  // 📸 GALLERY
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 📷 CAMERA
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>{currentTask.issueType}</Text>

      {/* TYPE BASED DETAILS */}
      {currentTask.type === "campus" ? (
        <>
          <Text>📍 {currentTask.landmark}</Text>
          <Text>🏠 {currentTask.address}</Text>
        </>
      ) : (
        <>
          <Text>🏢 {currentTask.hostelName}</Text>
          <Text>
            📍 Floor {currentTask.floor} | Room {currentTask.room}
          </Text>
        </>
      )}

      <Text>🕒 {currentTask.reportedAt}</Text>
      <Text>Description: {currentTask.description}</Text>

      {/* START BUTTON */}
      {currentTask.status === "accepted" && (
        <Button
          title="Start Task"
          onPress={async () => {
            await startTask(currentTask.id);
            router.back(); // 🔥 go back → auto refresh
          }}
        />
      )}

      {/* IN PROGRESS */}
      {currentTask.status === "in-progress" && (
        <>
          <Button title="Upload from Gallery" onPress={pickImage} />
          <Button title="Open Camera" onPress={openCamera} />

          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          <TextInput
            placeholder="Enter remarks..."
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />

          <Button
            title="Complete"
            onPress={async () => {
              await completeTask(
                currentTask.id,
                "completed",
                note,
                image
              );
              router.back();
            }}
          />

          <Button
            title="Mark Incomplete"
            onPress={async () => {
              await completeTask(
                currentTask.id,
                "incomplete",
                note,
                image
              );
              router.back();
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },

  image: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});