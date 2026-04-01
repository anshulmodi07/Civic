import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { acceptTask, startTask, uploadProgress } from "../../api/task.api";
import api from "../../api/axios";

export default function TaskDetailScreen({ route, navigation }) {
  const { task: initialTask } = route.params;
  const [task, setTask] = useState(initialTask);
  const [loading, setLoading] = useState(false);

  const handleAcceptTask = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await api.post(`/tasks/${task._id}/accept`);
    setTask((prev) => ({ ...prev, status: "accepted" }));
    Alert.alert("Success", "Task accepted!");
  } catch (err) {
  console.log("ERROR:", err.response?.data || err.message);
  Alert.alert("Error", "Failed to accept task");
} finally {
    setLoading(false);
  }
};

const handleStartTask = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await api.post(`/tasks/${task._id}/start`);
    setTask((prev) => ({ ...prev, status: "in-progress" }));
    Alert.alert("Success", "Task started!");
  } catch (err) {
  console.log("ERROR:", err.response?.data || err.message);
  Alert.alert("Error", "Failed to accept task");
}finally {
    setLoading(false);
  }
};

const handleUploadProgress = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await api.post(`/tasks/${task._id}/progress`);

    setTask((prev) => ({ ...prev, status: "in-progress" }));

    Alert.alert("Success", "Progress uploaded!");
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    Alert.alert("Error", "Failed to upload progress");
  } finally {
    setLoading(false);
  }
};

  const handleCompleteTask = () => {
    navigation.navigate("CompleteTask", { task });
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: "#F59E0B",
      accepted: "#8B5CF6",
      "in-progress": "#3B82F6",
      resolved: "#10B981",
    };
    return colors[status] || "#6B7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      assigned: "document-text",
      accepted: "checkmark-circle",
      "in-progress": "time",
      resolved: "checkmark-done",
    };
    return icons[status] || "document";
  };

  const getStatusBgColor = (status) => {
    const colors = {
      assigned: "#FEF3C7",
      accepted: "#F3E8FF",
      "in-progress": "#DBEAFE",
      resolved: "#D1FAE5",
    };
    return colors[status] || "#F3F4F6";
  };

  const getStatusGradient = (status) => {
    const gradients = {
      assigned: ["#F59E0B", "#D97706"],
      accepted: ["#8B5CF6", "#7C3AED"],
      "in-progress": ["#3B82F6", "#2563EB"],
      resolved: ["#10B981", "#059669"],
    };
    return gradients[status] || ["#6B7280", "#4B5563"];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <LinearGradient
          colors={getStatusGradient(task.status)}
          style={styles.statusCard}
        >
          <View style={styles.statusCardContent}>
            <Ionicons
              name={getStatusIcon(task.status)}
              size={32}
              color="#fff"
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <Text style={styles.statusValue}>
                {task.status.toUpperCase().replace("-", " ")}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Task Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#2E5BFF" />
            <Text style={styles.infoTitle}>Task Information</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="key-outline" size={18} color="#6B7280" />
              <Text style={styles.infoLabel}>Task ID</Text>
            </View>
            <Text style={styles.infoValue}>#{task._id.slice(-8)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#6B7280" />
              <Text style={styles.infoLabel}>Complaint ID</Text>
            </View>
            <Text style={styles.infoValue}>{task.complaintId}</Text>
          </View>

          {task.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoColumn}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="document-text-outline" size={18} color="#6B7280" />
                  <Text style={styles.infoLabel}>Description</Text>
                </View>
                <Text style={styles.descriptionText}>{task.description}</Text>
              </View>
            </>
          )}

          {task.assignedDate && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                  <Text style={styles.infoLabel}>Assigned Date</Text>
                </View>
                <Text style={styles.infoValue}>
                  {new Date(task.assignedDate).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Timeline Card */}
        <View style={styles.timelineCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="git-commit-outline" size={24} color="#2E5BFF" />
            <Text style={styles.infoTitle}>Task Timeline</Text>
          </View>

          <View style={styles.timeline}>
            {/* Assigned Step */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: "#F59E0B" }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Task Assigned</Text>
                <Text style={styles.timelineSubtitle}>
                  {task.assignedDate
                    ? new Date(task.assignedDate).toLocaleString()
                    : "Pending"}
                </Text>
              </View>
              {task.status !== "assigned" && <View style={styles.timelineLine} />}
            </View>

            {/* Accepted Step */}
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor:
                      task.status === "accepted" || task.status === "in-progress" || task.status === "resolved"
                        ? "#8B5CF6"
                        : "#E5E7EB",
                  },
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineTitle,
                    task.status === "assigned" && styles.timelineTitleInactive,
                  ]}
                >
                  Task Accepted
                </Text>
                <Text style={styles.timelineSubtitle}>
                  {task.status === "accepted" || task.status === "in-progress" || task.status === "resolved"
                    ? "Worker has accepted the task"
                    : "Waiting for acceptance"}
                </Text>
              </View>
              {(task.status === "accepted" || task.status === "in-progress" || task.status === "resolved") && <View style={styles.timelineLine} />}
            </View>

            {/* In Progress Step */}
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor:
                      task.status === "in-progress" || task.status === "resolved"
                        ? "#3B82F6"
                        : "#E5E7EB",
                  },
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineTitle,
                    (task.status === "assigned" || task.status === "accepted") && styles.timelineTitleInactive,
                  ]}
                >
                  In Progress
                </Text>
                <Text style={styles.timelineSubtitle}>
                  {task.status === "in-progress" || task.status === "resolved"
                    ? "Currently working"
                    : "Not started"}
                </Text>
              </View>
              {task.status === "resolved" && <View style={styles.timelineLine} />}
            </View>

            {/* Resolved Step */}
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor:
                      task.status === "resolved" ? "#10B981" : "#E5E7EB",
                  },
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineTitle,
                    task.status !== "resolved" && styles.timelineTitleInactive,
                  ]}
                >
                  Resolved
                </Text>
                <Text style={styles.timelineSubtitle}>
                  {task.status === "resolved"
                    ? task.completedDate
                      ? new Date(task.completedDate).toLocaleString()
                      : "Just now"
                    : "Pending resolution"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {task.status === "assigned" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAcceptTask}
            disabled={loading}
          >
            <LinearGradient
              colors={getStatusGradient(task.status)}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>
                {loading ? "Accepting..." : "Accept Task"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {task.status === "accepted" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartTask}
            disabled={loading}
          >
            <LinearGradient
              colors={getStatusGradient(task.status)}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>
                {loading ? "Starting..." : "Start Work"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {task.status === "in-progress" && (
          <View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUploadProgress}
              disabled={loading}
            >
              <LinearGradient
                colors={["#F59E0B", "#D97706"]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {loading ? "Uploading..." : "Upload Progress"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 12 }]}
              onPress={handleCompleteTask}
            >
              <LinearGradient
                colors={getStatusGradient("resolved")}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Complete Task</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Badge */}
        {task.status === "resolved" && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            <Text style={styles.completedText}>Task Resolved</Text>
            <Text style={styles.completedSubtext}>
              Great job! This task has been marked as resolved.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statusCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoColumn: {
    paddingVertical: 12,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  descriptionText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  timelineCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: 12,
  },
  timelineLine: {
    position: "absolute",
    left: 7,
    top: 24,
    width: 2,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  timelineTitleInactive: {
    color: "#9CA3AF",
  },
  timelineSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  actionButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2E5BFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  completedBadge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A7F3D0",
    marginBottom: 16,
  },
  completedText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#047857",
    marginTop: 12,
  },
  completedSubtext: {
    fontSize: 14,
    color: "#059669",
    textAlign: "center",
    marginTop: 8,
  },
});