import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAllComplaints, toggleUpvote } from "@/src/api/complaint.api";
import { ISSUE_TYPES } from "@/src/utils/constants";

type Complaint = {
  _id: string;
  type: "hostel" | "campus";
  issueType: string;
  description: string;
  status: string;
  upvotes: number;
  createdAt: string;
};

export default function BrowseComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "hostel" | "campus">("all");
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("recent");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [upvotingIds, setUpvotingIds] = useState<string[]>([]);

  // Load complaints
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.log("Browse complaints error:", error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

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

  // Apply filters & search
  useEffect(() => {
    let results = [...complaints];

    // Search filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();
      results = results.filter(
        (c) =>
          c.description.toLowerCase().includes(search) ||
          c.issueType.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      results = results.filter((c) => c.type === typeFilter);
    }

    // Issue type filter
    if (issueTypeFilter !== "all") {
      results = results.filter((c) => c.issueType === issueTypeFilter);
    }

    // Sort
    if (sortBy === "popular") {
      results.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredComplaints(results);
  }, [complaints, searchText, typeFilter, issueTypeFilter, sortBy]);

  const getIssueTypeIcon = (issueType: string) => {
    const iconMap: Record<string, string> = {
      electrician: "flash",
      ac: "snow",
      plumber: "water",
      construction: "hammer",
      sanitation: "trash",
      wifi: "wifi",
    };
    return iconMap[issueType] || "alert-circle";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f97316",
      in_progress: "#3b82f6",
      resolved: "#22c55e",
    };
    return colors[status] || "#64748b";
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    return "just now";
  };

  const renderItem = ({ item }: { item: Complaint }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({ pathname: "/complaint-detail/[id]", params: { id: item._id } })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.issueTypeContainer}>
          <Ionicons name={getIssueTypeIcon(item.issueType) as any} size={18} color="#2563eb" />
          <Text style={styles.issueType}>{item.issueType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.typeLabel}>{item.type === "hostel" ? "Hostel" : "Campus"}</Text>
        <View style={styles.statsRow}>
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
                styles.statText,
                { marginLeft: 8 },
                upvotingIds.includes(item._id) && { color: "#fff" },
              ]}
            >
              {item.upvotes || 0}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (
    label: string,
    isActive: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <LinearGradient colors={["#1e3a8a", "#3b82f6"]} style={styles.header}>
        <Text style={styles.headerTitle}>Browse Complaints</Text>
        <Text style={styles.headerSubtitle}>{filteredComplaints.length} complaints found</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by issue type or description..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#cbd5e1"
        />
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilterPanel(!showFilterPanel)}
      >
        <Ionicons name="filter" size={18} color="#2563eb" />
        <Text style={styles.filterToggleText}>Filters</Text>
        <Ionicons
          name={showFilterPanel ? "chevron-up" : "chevron-down"}
          size={18}
          color="#2563eb"
        />
      </TouchableOpacity>

      {/* Filter Panel */}
      {showFilterPanel && (
        <ScrollView style={styles.filterPanel} showsVerticalScrollIndicator={false}>
          {/* Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Complaint Type</Text>
            <View style={styles.filterRow}>
              {renderFilterButton("All", typeFilter === "all", () => setTypeFilter("all"))}
              {renderFilterButton("Hostel", typeFilter === "hostel", () =>
                setTypeFilter("hostel")
              )}
              {renderFilterButton("Campus", typeFilter === "campus", () =>
                setTypeFilter("campus")
              )}
            </View>
          </View>

          {/* Issue Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Issue Type</Text>
            <View style={styles.filterRow}>
              {renderFilterButton("All", issueTypeFilter === "all", () =>
                setIssueTypeFilter("all")
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.issueTypeRow}>
                {ISSUE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.issueTypeButton,
                      issueTypeFilter === type.value && styles.issueTypeButtonActive,
                    ]}
                    onPress={() => setIssueTypeFilter(type.value)}
                  >
                    <Text
                      style={[
                        styles.issueTypeButtonText,
                        issueTypeFilter === type.value && styles.issueTypeButtonTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Sort */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterRow}>
              {renderFilterButton("Recent", sortBy === "recent", () => setSortBy("recent"))}
              {renderFilterButton("Popular", sortBy === "popular", () => setSortBy("popular"))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No complaints found</Text>
          <Text style={styles.emptyText}>Try adjusting your filters</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: 0.3 },
  headerSubtitle: { fontSize: 13, color: "#e0e7ff", marginTop: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1e293b",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  filterToggleText: { marginHorizontal: 8, fontSize: 15, fontWeight: "600", color: "#2563eb" },
  filterPanel: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    maxHeight: 280,
  },
  filterSection: { marginBottom: 20 },
  filterSectionTitle: { fontSize: 13, fontWeight: "700", color: "#334155", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  filterRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  filterButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  filterButtonText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  filterButtonTextActive: { color: "#fff" },
  issueTypeRow: { flexDirection: "row", gap: 8, paddingVertical: 8 },
  issueTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  issueTypeButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  issueTypeButtonText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  issueTypeButtonTextActive: { color: "#fff" },
  list: { padding: 16, backgroundColor: "#f8fafc" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  issueTypeContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  issueType: { fontWeight: "700", color: "#2563eb", fontSize: 14, textTransform: "capitalize" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  description: { color: "#0f172a", fontSize: 15, marginBottom: 12, lineHeight: 20 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  typeLabel: { fontSize: 12, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3 },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
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
  statText: { fontSize: 13, fontWeight: "600", color: "#06b6d4" },
  timeText: { fontSize: 12, color: "#94a3b8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#334155", marginTop: 12 },
  emptyText: { fontSize: 14, color: "#94a3b8", marginTop: 4 },
});
