import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

/**
 * TaskCard Component
 * Displays a task in a card format with status, ID, and navigation
 * 
 * @param {string} complaintId - The complaint ID
 * @param {string} status - The task status
 * @param {function} onPress - Callback when card is pressed
 */
export default function TaskCard({ complaintId, status, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Status Badge */}
        <StatusBadge status={status} size="medium" />

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <View style={styles.complaintRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.complaintId}>
              Complaint ID: {complaintId}
            </Text>
          </View>
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  complaintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  complaintId: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});