import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getMyComplaints, toggleUpvote } from "@/src/api/complaint.api";
import { checkSLA } from "@/src/utils/sla";

type FilterValue = "all" | "pending" | "in_progress" | "resolved";

type Complaint = {
  _id: string;
  type: "hostel" | "campus";
  issueType: string;
  description: string;
  status: string;
  upvotes: number;
  createdAt: string;
  images?: any[];
};

export default function MyComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterValue>("all");
  const [upvotingIds, setUpvotingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getMyComplaints();
        setComplaints(data);
      } catch (error) {
        console.log("My complaints error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const getFiltered = () => {
    if (filterStatus === "all") return complaints;
    return complaints.filter((item) => item.status === filterStatus);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f97316",
      in_progress: "#3b82f6",
      resolved: "#22c55e",
    };
    return colors[status] || "#64748b";
  };

  const getStatusBgColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#fed7aa",
      in_progress: "#bfdbfe",
      resolved: "#bbf7d0",
    };
    return colors[status] || "#f1f5f9";
  };

  const counts = {
    all: complaints.length,
    pending: complaints.filter((item) => item.status === "pending").length,
    in_progress: complaints.filter((item) => item.status === "in_progress").length,
    resolved: complaints.filter((item) => item.status === "resolved").length,
  };

  const handleToggleSupport = async (complaintId: string) => {
    if (upvotingIds.includes(complaintId)) return;
    setUpvotingIds((prev) => [...prev, complaintId]);

    try {
      const response = await toggleUpvote(complaintId);
      setComplaints((prev) =>
        prev.map((item) =>
          item._id === complaintId ? { ...item, upvotes: response.upvotes } : item
        )
      );
    } catch (error) {
      console.log("Support action failed:", error);
    } finally {
      setUpvotingIds((prev) => prev.filter((id) => id !== complaintId));
    }
  };

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const sla = checkSLA(item.issueType, item.createdAt, item.status);
    const daysSince = Math.floor(
      (Date.now() - Number(new Date(item.createdAt))) / (1000 * 60 * 60 * 24)
    );
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          router.push({ pathname: "/complaint-detail/[id]", params: { id: item._id } })
        }
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.issueType}>{item.issueType.toUpperCase()}</Text>
            <Text style={styles.issueDate}>
              {daysSince === 0
                ? "Today"
                : daysSince === 1
                ? "Yesterday"
                : `${daysSince} days ago`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footerRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
          <View style={styles.typeBadge}>
            <Ionicons
              name={item.type === "hostel" ? "home" : "location"}
              size={12}
              color="#2563eb"
            />
            <Text style={styles.typeText}>{item.type === "hostel" ? "Hostel" : "Campus"}</Text>
          </View>
          {sla.breached && (
            <View style={styles.slaBadge}>
              <Ionicons name="alert-circle" size={14} color="#dc2626" />
              <Text style={styles.slaText}>SLA</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.supportButton, upvotingIds.includes(item._id) && styles.supportButtonActive]}
            activeOpacity={0.8}
            onPress={(event) => {
              event.stopPropagation?.();
              handleToggleSupport(item._id);
            }}
          >
            <Ionicons
              name="thumbs-up"
              size={14}
              color={upvotingIds.includes(item._id) ? "#fff" : "#06b6d4"}
            />
            <Text
              style={[
                styles.supportText,
                upvotingIds.includes(item._id) && styles.supportTextActive,
              ]}
            >
              {item.upvotes || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Complaints</Text>
      </LinearGradient>

      <View style={styles.filterBar}>
        {[
          { label: "All", value: "all", count: counts.all },
          { label: "Pending", value: "pending", count: counts.pending },
          { label: "Active", value: "in_progress", count: counts.in_progress },
          { label: "Resolved", value: "resolved", count: counts.resolved },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterButton,
              filterStatus === item.value && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(item.value as FilterValue)}
            activeOpacity={0.8}
          >
            <Text
              style={
                filterStatus === item.value
                  ? styles.filterButtonTextActive
                  : styles.filterButtonText
              }
            >
              {item.label}
            </Text>
            <Text
              style={
                filterStatus === item.value
                  ? styles.filterCountActive
                  : styles.filterCount
              }
            >
              {item.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFiltered()}
        keyExtractor={(item) => item._id}
        renderItem={renderComplaint}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 10,
    minWidth: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#2563eb",
  },
  filterButtonText: {
    color: "#1f2937",
    fontWeight: "700",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  filterCount: {
    color: "#6b7280",
    marginTop: 4,
  },
  filterCountActive: {
    color: "#cfe0ff",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  issueType: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
  },
  issueDate: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 13,
  },
  description: {
    color: "#0f172a",
    fontSize: 15,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#eff6ff",
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
  },
  supportButtonActive: {
    backgroundColor: "#2563eb",
  },
  supportText: {
    marginLeft: 8,
    color: "#06b6d4",
    fontSize: 13,
    fontWeight: "700",
  },
  supportTextActive: {
    color: "#fff",
  },
  slaBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  slaText: {
    marginLeft: 6,
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
