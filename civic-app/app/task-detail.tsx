import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  startTask,
  completeTask,
  getAllTasks,
  getMyTasks,
} from "@/src/api/tasks.api";
import ImagePreview from "@/src/components/ImagePreview";
import StatusBadge from "@/src/components/StatusBadge";

export default function TaskDetail() {
  const router = useRouter();
  const { task } = useLocalSearchParams();

  const taskString = Array.isArray(task) ? task[0] : task;
  const parsedTask = JSON.parse(taskString!);

  const [currentTask, setCurrentTask] = useState(parsedTask);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  /* ---------------- IMAGE ---------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentTask.issueType}</Text>
        <StatusBadge status={currentTask.status} />
      </View>

      {/* DETAILS CARD */}
      <View style={styles.card}>
        {currentTask.type === "campus" ? (
          <>
            <Text style={styles.label}>📍 Location</Text>
            <Text style={styles.value}>{currentTask.landmark}</Text>

            <Text style={styles.value}>{currentTask.address}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>🏢 Hostel</Text>
            <Text style={styles.value}>{currentTask.hostelName}</Text>

            <Text style={styles.value}>
              Floor {currentTask.floor} | Room {currentTask.room}
            </Text>
          </>
        )}

        <Text style={styles.time}>🕒 {currentTask.reportedAt}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>
          {currentTask.description || "No description provided"}
        </Text>
      </View>

      {/* START BUTTON */}
      {currentTask.status === "accepted" && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            await startTask(currentTask.id);
            router.back();
          }}
        >
          <Text style={styles.primaryText}>Start Task</Text>
        </TouchableOpacity>
      )}

      {/* IN PROGRESS */}
      {currentTask.status === "in-progress" && (
        <View style={styles.section}>
          {/* IMAGE ACTIONS */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
              <Text>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={openCamera}>
              <Text>Camera</Text>
            </TouchableOpacity>
          </View>

          {/* IMAGE PREVIEW */}
          {image && (
            <ImagePreview uri={image} size={180} />
          )}

          {/* NOTE */}
          <TextInput
            placeholder="Add remarks..."
            value={note}
            onChangeText={setNote}
            style={styles.input}
            multiline
          />

          {/* ACTIONS */}
          <TouchableOpacity
            style={styles.successBtn}
            onPress={async () => {
              await completeTask(currentTask.id, "completed", note, image || "");
              router.back();
            }}
          >
            <Text style={styles.btnText}>Mark Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={async () => {
              await completeTask(currentTask.id, "incomplete", note, image || "");
              router.back();
            }}
          >
            <Text style={styles.btnText}>Mark Incomplete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 10,
  },

  value: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    color: "#334155",
  },

  time: {
    marginTop: 10,
    fontSize: 12,
    color: "#94a3b8",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  section: {
    gap: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 12,
    minHeight: 80,
  },

  successBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  dangerBtn: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});