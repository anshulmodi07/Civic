import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Modal, Alert, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { startTask, completeTask, markIncomplete, reviveTask, getMyTasks } from "@/src/api/task.api";
import { Task } from "@/src/types/task";
import StatusBadge from "@/src/components/StatusBadge";
import { Ionicons } from "@expo/vector-icons";

export default function TaskDetail() {
  const router = useRouter();
  const { task } = useLocalSearchParams();
  const taskString  = Array.isArray(task) ? task[0] : task;
  const parsedTask: Task = JSON.parse(taskString!);

  const [currentTask, setCurrentTask] = useState<Task>(parsedTask);
  const [image, setImage]             = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType]     = useState<"completed" | "incomplete" | null>(null);
  const [modalNote, setModalNote]     = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const loadTask = async () => {
    try {
      const all: Task[] = await getMyTasks();
      const updated = all.find(t => t._id === parsedTask._id);
      if (updated) {
        setCurrentTask(updated);
        setImage(null);
        setModalVisible(false);
        setModalType(null);
        setModalNote("");
      }
    } catch (e: any) {
      console.log("Reload error:", e.message);
    }
  };

  useFocusEffect(useCallback(() => { loadTask(); }, []));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleStart = async () => {
    setSubmitting(true);
    try {
      await startTask(currentTask._id);
      setCurrentTask(prev => ({ ...prev, status: "in-progress" }));
    } catch (e: any) {
      console.log("Start error:", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevive = async () => {
    setSubmitting(true);
    try {
      await reviveTask(currentTask._id);
      router.back();
    } catch (e: any) {
      console.log("Revive error:", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!modalType) return;
    if (modalType === "completed" && !image) {
      Alert.alert("Photo required", "Please upload a photo before submitting.");
      setModalVisible(false);
      return;
    }
    if (modalType === "incomplete" && !modalNote.trim()) {
      Alert.alert("Comment required", "Please explain why the task is incomplete.");
      setModalVisible(false);
      return;
    }
    setSubmitting(true);
    try {
      if (modalType === "completed") {
        await completeTask(currentTask._id, [image!]);
      } else {
        await markIncomplete(currentTask._id, modalNote);
      }
      await loadTask();
    } catch (e: any) {
      console.log("Confirm error:", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const c = currentTask.complaintId;

  const locationText = c.type === "campus"
    ? `${c.area}${c.locationAddress ? `, ${c.locationAddress}` : ""}`
    : c.visibility === "public"
      ? `${c.hostelName} — ${c.landmark}`
      : `${c.hostelName}, Floor ${c.floor}, Room ${c.roomNumber}`;

  const isAccepted    = currentTask.status === "accepted";
  const isInProgress  = currentTask.status === "in-progress";
  const isIncompleted = currentTask.status === "incompleted";
  const isCompleted   = currentTask.status === "completed";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#185FA5" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={3}>{c.description}</Text>
        <StatusBadge status={currentTask.status} />
      </View>

      {/* DETAIL CARD */}
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{c.type === "campus" ? "Campus" : "Hostel"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue} numberOfLines={2}>{locationText}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reported</Text>
          <Text style={styles.detailValue}>
            {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </Text>
        </View>
      </View>

      {/* ACCEPTED → Start */}
      {isAccepted && (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStart} disabled={submitting}>
          <Ionicons name="play" size={15} color="#fff" />
          <Text style={styles.primaryBtnText}>{submitting ? "Starting..." : "Start task"}</Text>
        </TouchableOpacity>
      )}

      {/* IN PROGRESS → upload + actions */}
      {isInProgress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload proof of work</Text>
          <View style={styles.uploadZone}>
            <Text style={styles.uploadZoneTitle}>Photo required before submitting</Text>
            <View style={styles.uploadBtnRow}>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                <Ionicons name="images-outline" size={15} color="#5F5E5A" />
                <Text style={styles.uploadBtnText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBtn} onPress={openCamera}>
                <Ionicons name="camera-outline" size={15} color="#5F5E5A" />
                <Text style={styles.uploadBtnText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {image && (
            <View style={styles.photoSelectedBox}>
              <Ionicons name="checkmark-circle" size={16} color="#3B6D11" />
              <Text style={styles.photoSelectedText}>Photo selected</Text>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.successBtn} onPress={() => { setModalType("completed"); setModalNote(""); setModalVisible(true); }}>
              <Text style={styles.actionBtnText}>Mark completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerBtn} onPress={() => { setModalType("incomplete"); setModalNote(""); setModalVisible(true); }}>
              <Text style={styles.actionBtnText}>Mark incomplete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* INCOMPLETED → revive only, no photo */}
      {isIncompleted && (
        <View style={styles.section}>
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Task marked incomplete</Text>
            <Text style={styles.warningText}>Revive this task to resume and re-submit.</Text>
          </View>
          {currentTask.notes && (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Worker's note</Text>
              <Text style={styles.noteText}>{currentTask.notes}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleRevive} disabled={submitting}>
            <Ionicons name="refresh" size={15} color="#fff" />
            <Text style={styles.primaryBtnText}>{submitting ? "Reviving..." : "Revive task"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COMPLETED */}
      {isCompleted && (
        <View style={styles.completedBox}>
          <Ionicons name="checkmark-circle" size={20} color="#3B6D11" />
          <Text style={styles.completedText}>Task completed successfully</Text>
        </View>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalType === "completed" ? "Mark as completed" : "Mark as incomplete"}
            </Text>
            <Text style={styles.modalSub}>
              {modalType === "completed"
                ? "Add a note about what was done."
                : "Explain why the task cannot be completed right now."}
            </Text>
            <TextInput
              placeholder="Write your note..."
              placeholderTextColor="#B4B2A9"
              value={modalNote}
              onChangeText={setModalNote}
              style={styles.modalInput}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalType === "completed" ? styles.confirmSuccessBtn : styles.confirmDangerBtn}
                onPress={handleConfirm}
                disabled={submitting}
              >
                <Text style={styles.actionBtnText}>{submitting ? "Saving..." : "Confirm"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 10 },
  title: { fontSize: 18, fontWeight: "500", color: "#0f172a", flex: 1, lineHeight: 26 },
  detailCard: { backgroundColor: "#F1EFE8", borderRadius: 14, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 4 },
  detailLabel: { fontSize: 12, color: "#888780" },
  detailValue: { fontSize: 13, fontWeight: "500", color: "#0f172a", textAlign: "right", maxWidth: "60%" },
  divider: { height: 0.5, backgroundColor: "#D3D1C7", marginVertical: 8 },
  primaryBtn: { backgroundColor: "#185FA5", borderRadius: 12, paddingVertical: 13, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 7, marginBottom: 20 },
  primaryBtnText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  section: { gap: 12, marginBottom: 30 },
  sectionTitle: { fontSize: 12, fontWeight: "500", color: "#888780", textTransform: "uppercase", letterSpacing: 0.6 },
  uploadZone: { borderWidth: 1.5, borderStyle: "dashed", borderColor: "#B4B2A9", borderRadius: 12, padding: 18, alignItems: "center" },
  uploadZoneTitle: { fontSize: 13, fontWeight: "500", color: "#0f172a", marginBottom: 12 },
  uploadBtnRow: { flexDirection: "row", gap: 10 },
  uploadBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F1EFE8", borderWidth: 0.5, borderColor: "#D3D1C7", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  uploadBtnText: { fontSize: 13, fontWeight: "500", color: "#444441" },
  photoSelectedBox: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EAF3DE", borderRadius: 10, padding: 12 },
  photoSelectedText: { fontSize: 13, fontWeight: "500", color: "#3B6D11" },
  actionRow: { flexDirection: "row", gap: 10 },
  successBtn: { flex: 1, backgroundColor: "#3B6D11", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  dangerBtn: { flex: 1, backgroundColor: "#A32D2D", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  actionBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  warningBox: { backgroundColor: "#FAEEDA", borderRadius: 12, borderLeftWidth: 3, borderLeftColor: "#EF9F27", padding: 14 },
  warningTitle: { fontSize: 13, fontWeight: "500", color: "#854F0B", marginBottom: 4 },
  warningText: { fontSize: 12, color: "#BA7517", lineHeight: 18 },
  noteBox: { backgroundColor: "#F1EFE8", borderRadius: 10, padding: 12 },
  noteLabel: { fontSize: 11, fontWeight: "500", color: "#888780", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  noteText: { fontSize: 13, color: "#444441", lineHeight: 20 },
  completedBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EAF3DE", borderRadius: 12, padding: 14, marginBottom: 20 },
  completedText: { fontSize: 14, fontWeight: "500", color: "#3B6D11" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 10 },
  modalTitle: { fontSize: 17, fontWeight: "500", color: "#0f172a" },
  modalSub: { fontSize: 13, color: "#888780" },
  modalInput: { borderWidth: 0.5, borderColor: "#D3D1C7", borderRadius: 12, padding: 12, minHeight: 100, backgroundColor: "#F8FAFC", color: "#0f172a", fontSize: 14, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: "#F1EFE8", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelBtnText: { color: "#5F5E5A", fontWeight: "500" },
  confirmSuccessBtn: { flex: 1, backgroundColor: "#3B6D11", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  confirmDangerBtn: { flex: 1, backgroundColor: "#A32D2D", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
});