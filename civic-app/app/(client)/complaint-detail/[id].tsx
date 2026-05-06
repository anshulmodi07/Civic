import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "@/src/components/StatusBadge";
import { getAssetUrl, getComplaintById, toggleUpvote } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  type: "hostel" | "campus";
  departmentId?: string | { _id: string; name: string };
  departmentName?: string;
  description: string;
  status: string;
  assignedTask?: {
    status?: string;
    notes?: string;
    history?: { status: string; changedAt?: string; note?: string }[];
    proofImages?: string[];
  };
  upvotes?: number;
  upvotesCount?: number;
  hasUpvoted?: boolean;
  createdAt: string;
  images?: string[];
  location?: { lat: number; lng: number };
  hostelName?: string;
  floor?: string;
  roomNumber?: string;
  landmark?: string;
  area?: string;
  locationAddress?: string;
  visibility?: "public" | "private";
};

const getDepartmentName = (complaint: Complaint) => {
  if (complaint.departmentName) return complaint.departmentName;
  const dept = complaint.departmentId;
  if (!dept) return "";
  return typeof dept === "string" ? dept : dept.name || "";
};

const getDisplayStatus = (complaint: Complaint) =>
  complaint.assignedTask?.status || complaint.status || "pending";

const getSupportCount = (complaint: Complaint) =>
  complaint.upvotesCount ?? complaint.upvotes ?? 0;

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    const loadComplaint = async () => {
      if (!id) return;

      try {
        const response = await getComplaintById(Array.isArray(id) ? id[0] : id);
        setComplaint(response);
        setHasUpvoted(Boolean(response?.hasUpvoted));
      } catch (error) {
        console.log("Complaint detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  const handleUpvote = async () => {
    if (!complaint) return;
    
    setIsUpvoting(true);
    try {
      const result = await toggleUpvote(complaint._id);
      setComplaint(prev => prev ? { ...prev, upvotes: result.upvotes, upvotesCount: result.upvotes } : null);
      setHasUpvoted(result.upvoted);
      Alert.alert("Success", "Thank you for your support!", [{ text: "OK" }]);
    } catch (error: any) {
      const message = error.response?.data?.message || "Unable to upvote";
      Alert.alert("Error", message);
    } finally {
      setIsUpvoting(false);
    }
  };

  const getIssueIcon = (issueType: string) => {
    const iconMap: Record<string, string> = {
      electrician: "flash",
      plumber: "water",
      civil: "hammer",
      carpenter: "construct",
      wifi: "wifi",
    };
    return iconMap[issueType] || "alert-circle";
  };

  const getTimelineSteps = (status: string) => {
    if (status === "incompleted") return ["pending", "accepted", "in-progress", "incompleted"];
    return ["pending", "accepted", "in-progress", "completed"];
  };

  const isStepActive = (steps: string[], currentStatus: string, step: string) => {
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    return currentIndex >= stepIndex && stepIndex >= 0;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hours ago`;
    return "just now";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Complaint not found</Text>
      </View>
    );
  }

  const departmentName = getDepartmentName(complaint);
  const displayStatus = getDisplayStatus(complaint);
  const supportCount = getSupportCount(complaint);
  const timelineSteps = getTimelineSteps(displayStatus);
  const history = complaint.assignedTask?.history || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push("/(client)/browse")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.headerContent}>
            <View style={styles.issueTypeContainer}>
              <Ionicons name={getIssueIcon(departmentName) as any} size={22} color="#2563eb" />
              <Text style={styles.issueType}>{departmentName || "Department"}</Text>
            </View>
            <StatusBadge status={displayStatus} />
          </View>

          <Text style={styles.description}>{complaint.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#64748b" />
              <Text style={styles.metaText}>{timeAgo(complaint.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#64748b" />
              <Text style={styles.metaText}>{complaint.type === "hostel" ? "Hostel" : "Campus"}</Text>
            </View>
          </View>

          {/* Upvote Button */}
          <TouchableOpacity
            style={[styles.upvoteButton, hasUpvoted && styles.upvoteButtonActive]}
            onPress={handleUpvote}
            disabled={isUpvoting || hasUpvoted}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hasUpvoted ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color={hasUpvoted ? "#fff" : "#06b6d4"}
            />
            <Text style={[styles.upvoteText, hasUpvoted && styles.upvoteTextActive]}>
              {supportCount} {supportCount === 1 ? "Support" : "Supports"}
            </Text>
            {isUpvoting && <ActivityIndicator color="#06b6d4" style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location" size={16} color="#334155" /> Location Details
          </Text>
          {complaint.type === "hostel" ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hostel</Text>
                <Text style={styles.detailValue}>{complaint.hostelName || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Floor</Text>
                <Text style={styles.detailValue}>Floor {complaint.floor || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room Number</Text>
                <Text style={styles.detailValue}>
                  {complaint.visibility === "private" ? complaint.roomNumber || "N/A" : "Public area"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Landmark</Text>
                <Text style={styles.detailValue}>{complaint.landmark || "N/A"}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Landmark / Area</Text>
                <Text style={styles.detailValue}>{complaint.area || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{complaint.locationAddress || "N/A"}</Text>
              </View>
            </>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>GPS Coordinates</Text>
            <Text style={[styles.detailValue, { fontFamily: "monospace", fontSize: 12 }]}>
              {complaint.location ? `${complaint.location.lat.toFixed(4)}, ${complaint.location.lng.toFixed(4)}` : "N/A"}
            </Text>
          </View>
        </View>

        {/* Images */}
        {complaint.images && complaint.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="image" size={16} color="#334155" /> Attached Photos
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {complaint.images.map((img, index) => (
                <Image key={index} source={{ uri: getAssetUrl(img) }} style={styles.thumbnail} />
              ))}
            </ScrollView>
          </View>
        )}

        {displayStatus === "completed" && complaint.assignedTask?.proofImages?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="checkmark-done" size={16} color="#15803d" /> Proof of Completion
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {complaint.assignedTask.proofImages.map((img, index) => (
                <Image key={index} source={{ uri: getAssetUrl(img) }} style={styles.thumbnail} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="list" size={16} color="#334155" /> Status
          </Text>
          <View style={styles.statusTimeline}>
            {timelineSteps.map((status, index) => (
              <View key={status} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineCircle,
                    isStepActive(timelineSteps, displayStatus, status)
                      ? styles.timelineCircleActive
                      : styles.timelineCircleInactive,
                    status === "incompleted" && isStepActive(timelineSteps, displayStatus, status)
                      ? styles.timelineCircleError
                      : null,
                  ]}
                >
                  {isStepActive(timelineSteps, displayStatus, status) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                {index < timelineSteps.length - 1 && <View style={styles.timelineLine} />}
              </View>
            ))}
          </View>
          <View style={styles.statusLabels}>
            {timelineSteps.map((status) => (
              <Text key={status} style={styles.statusLabel}>{status.replace("-", " ")}</Text>
            ))}
          </View>
          {history.length ? (
            <View style={styles.historyList}>
              {history.map((item, index) => (
                <View key={`${item.status}-${index}`} style={styles.historyItem}>
                  <Text style={styles.historyTitle}>{item.status.replace("-", " ")}</Text>
                  {item.changedAt ? <Text style={styles.historyDate}>{timeAgo(item.changedAt)}</Text> : null}
                  {item.note ? <Text style={styles.historyNote}>{item.note}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { padding: 10, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 0.3 },
  spacer: { width: 44 },
  body: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  issueTypeContainer: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  issueType: { fontWeight: "700", fontSize: 16, color: "#2563eb", textTransform: "capitalize" },
  description: { color: "#334155", fontSize: 15, lineHeight: 23, marginBottom: 16 },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  upvoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#06b6d4",
    backgroundColor: "#ecf7fb",
    gap: 8,
  },
  upvoteButtonActive: { backgroundColor: "#06b6d4", borderColor: "#06b6d4" },
  upvoteText: { fontSize: 14, fontWeight: "700", color: "#06b6d4" },
  upvoteTextActive: { color: "#fff" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#334155", marginBottom: 14, letterSpacing: 0.3 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  detailLabel: { fontSize: 14, color: "#64748b", fontWeight: "600" },
  detailValue: { fontSize: 14, color: "#1e293b", fontWeight: "500", textAlign: "right", maxWidth: "60%" },
  imagesScroll: { marginVertical: 8 },
  thumbnail: { width: 120, height: 120, borderRadius: 12, marginRight: 12 },
  statusTimeline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20 },
  timelineItem: { alignItems: "center", flex: 1 },
  timelineCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  timelineCircleActive: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
  timelineCircleError: { backgroundColor: "#ef4444", borderColor: "#dc2626" },
  timelineCircleInactive: { backgroundColor: "#f1f5f9", borderColor: "#cbd5e1" },
  timelineLine: { height: 2, backgroundColor: "#cbd5e1", flex: 0.8, marginHorizontal: 8 },
  statusLabels: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  statusLabel: { fontSize: 12, color: "#64748b", fontWeight: "600", textTransform: "capitalize" },
  historyList: { marginTop: 18, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 12 },
  historyItem: { paddingVertical: 8 },
  historyTitle: { fontSize: 13, color: "#334155", fontWeight: "700", textTransform: "capitalize" },
  historyDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
  historyNote: { fontSize: 13, color: "#475569", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  errorText: { fontSize: 16, fontWeight: "700", color: "#ef4444", marginTop: 12 },
});
