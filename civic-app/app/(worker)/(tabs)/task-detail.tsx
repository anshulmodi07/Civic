import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";

import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  startTask,
  completeTask,
  getAllTasks,
  getMyTasks,
  reviveTask,
} from "@/src/api/tasks.api";
import ImagePreview from "@/src/components/ImagePreview";
import StatusBadge from "@/src/components/StatusBadge";

export default function TaskDetail() {
  const router = useRouter();
  const { task } = useLocalSearchParams();

  const taskString = Array.isArray(task) ? task[0] : task;
  const parsedTask = JSON.parse(taskString!);

  const [currentTask, setCurrentTask] = useState(parsedTask);
  const [image, setImage] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"completed" | "incomplete" | null>(null);
  const [modalNote, setModalNote] = useState("");

  const loadTask = async () => {
    const allTasks = [
      ...(await getAllTasks()),
      ...(await getMyTasks()),
    ];
    const updated = allTasks.find((t) => t.id === parsedTask.id) || parsedTask;
    setCurrentTask(updated);
    setImage(null);
    setModalVisible(false);
    setModalType(null);
    setModalNote("");
  };

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [parsedTask.id])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const openModal = (type: "completed" | "incomplete") => {
    setModalType(type);
    setModalNote("");
    setModalVisible(true);
  };

  const handleRevive = async () => {
    await reviveTask(currentTask.id);
    router.back();
  };

  const handleConfirm = async () => {
    if (!modalType) return;

    if (!image) {
      Alert.alert(
        "Photo Required",
        "Please upload a photo of the work before marking as complete or incomplete.",
        [{ text: "OK" }]
      );
      setModalVisible(false);
      return;
    }

    await completeTask(currentTask.id, modalType, modalNote, image);
    await loadTask();
  };

  return (
    <ScrollView style={styles.container}>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

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

      {/* START BUTTON — accepted only */}
      {currentTask.status === "accepted" && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            await startTask(currentTask.id);
            setCurrentTask({ ...currentTask, status: "in-progress" });
          }}
        >
          <Text style={styles.primaryText}>▶ Start Task</Text>
        </TouchableOpacity>
      )}

      {/* IN PROGRESS — upload + complete/incomplete actions only rendered here */}
      {currentTask.status === "in-progress" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Proof of Work</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
              <Text style={styles.secondaryBtnText}>🖼 Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={openCamera}>
              <Text style={styles.secondaryBtnText}>📷 Camera</Text>
            </TouchableOpacity>
          </View>

          {image && <ImagePreview uri={image} size={180} />}

          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => openModal("completed")}
          >
            <Text style={styles.btnText}>✅ Mark Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => openModal("incomplete")}
          >
            <Text style={styles.btnText}>❌ Mark Incomplete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* INCOMPLETE — read-only view + revive only, no other actions */}
      {currentTask.status === "incomplete" && (
        <View style={styles.section}>
          <View style={styles.incompleteNotice}>
            <Text style={styles.incompleteTitle}>⚠️ Task Incomplete</Text>
            <Text style={styles.incompleteText}>
              This task has been marked incomplete. Revive it to restart work.
            </Text>
          </View>

          {currentTask.completedImage ? (
            <>
              <Text style={styles.sectionTitle}>Previous Photo</Text>
              <ImagePreview uri={currentTask.completedImage} size={180} />
            </>
          ) : null}

          {currentTask.note ? (
            <View style={styles.commentBox}>
              <Text style={styles.commentLabel}>Last Note</Text>
              <Text style={styles.commentText}>{currentTask.note}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.reviveBtn} onPress={handleRevive}>
            <Text style={styles.reviveBtnText}>🔄 Revive Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONFIRMATION MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalType === "completed" ? "✅ Mark as Completed" : "❌ Mark as Incomplete"}
            </Text>

            <Text style={styles.modalSubtitle}>
              {modalType === "completed"
                ? "Please describe what was done."
                : "Please explain why the task is incomplete."}
            </Text>

            <TextInput
              placeholder="Write your reason..."
              value={modalNote}
              onChangeText={setModalNote}
              style={styles.modalInput}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalType === "completed" ? styles.confirmSuccessBtn : styles.confirmDangerBtn}
                onPress={handleConfirm}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  backBtn: {
    marginBottom: 12,
    marginTop: 8,
  },
  backText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
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
  secondaryBtnText: {
    fontWeight: "600",
    color: "#334155",
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
    marginBottom: 30,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Incomplete notice block
  incompleteNotice: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  incompleteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9a3412",
  },
  incompleteText: {
    fontSize: 13,
    color: "#c2410c",
    lineHeight: 18,
  },
  commentBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  commentLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  commentText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 12,
    minHeight: 100,
    backgroundColor: "#f8fafc",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelText: {
    color: "#64748b",
    fontWeight: "600",
  },
  confirmSuccessBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#16a34a",
  },
  confirmDangerBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#dc2626",
  },
  reviveBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  reviveBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
