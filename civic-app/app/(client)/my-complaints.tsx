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
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: "#64748b", fontWeight: "500" }}>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e3a8a", "#3b82f6"]}
        locations={[0, 0.6, 1]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Complaints</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>Track and manage your submitted issues</Text>
      </LinearGradient>

      <View style={styles.filterScrollWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
          data={[
            { label: "All", value: "all", count: counts.all },
            { label: "Pending", value: "pending", count: counts.pending },
            { label: "Active", value: "in_progress", count: counts.in_progress },
            { label: "Resolved", value: "resolved", count: counts.resolved },
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isActive = filterStatus === item.value;
            return (
              <TouchableOpacity
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => setFilterStatus(item.value as FilterValue)}
                activeOpacity={0.8}
              >
                <Text style={isActive ? styles.filterButtonTextActive : styles.filterButtonText}>
                  {item.label}
                </Text>
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={isActive ? styles.badgeTextActive : styles.badgeText}>
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={getFiltered()}
        keyExtractor={(item) => item._id}
        renderItem={renderComplaint}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Complaints Found</Text>
            <Text style={styles.emptySubtitle}>You haven't reported any issues yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f6",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: "#1e3a8a",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  filterScrollWrapper: {
    marginTop: -20,
    paddingBottom: 16,
    zIndex: 10,
  },
  filterBar: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  filterButtonText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  badge: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  badgeText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextActive: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f8fafc",
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
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
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
