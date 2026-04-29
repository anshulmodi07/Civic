import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getAllComplaints } from "../../api/complaint.api";
import { ISSUE_TYPES } from "../../utils/constants";

const getDisplayStatus = (complaint) => {
  if (complaint?.assignedTask?.status) return complaint.assignedTask.status;
  return complaint.status;
};

const getDepartmentName = (complaint) => {
  const dept = complaint.departmentId;
  if (!dept) return "";
  if (typeof dept === "string") return dept;
  return dept.name || "";
};

export default function BrowseComplaintsScreen({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // hostel or campus
  const [sortBy, setSortBy] = useState("popular"); // popular, recent, my-area
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.log(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedComplaints = () => {
    let filtered = complaints;

    // Filter by issue type
    if (selectedIssueType) {
      filtered = filtered.filter((c) => getDepartmentName(c) === selectedIssueType);
    }

    // Filter by complaint type (hostel/campus)
    if (selectedType) {
      filtered = filtered.filter((c) => c.type === selectedType);
    }

    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.description.toLowerCase().includes(search) ||
          getDepartmentName(c).toLowerCase().includes(search)
      );
    }

    // Sort
    let sorted = [...filtered];
    if (sortBy === "popular") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  };

  const renderComplaint = ({ item }) => {
    const getIssueColor = (issueType) => {
      const colors = {
        electrician: "#f59e0b",
        plumber: "#10b981",
        civil: "#f97316",
        carpenter: "#8b5cf6",
        wifi: "#8b5cf6",
      };
      return colors[issueType] || "#64748b";
    };
    const departmentName = getDepartmentName(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ComplaintDetail", { id: item._id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.issueTypeIcon, { backgroundColor: getIssueColor(departmentName) + "20" }]}>
            <Text style={[styles.issueTypeEmoji, { color: getIssueColor(departmentName) }]}>
              {item.type === "hostel" ? "🏠" : "🏫"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.issueType}>{departmentName.toUpperCase()}</Text>
            <Text style={styles.complaintType}>{item.type === "hostel" ? "Hostel" : "Campus"}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(getDisplayStatus(item)) }]} />
            <Text style={styles.statusText}>{String(getDisplayStatus(item)).replace("-", " ")}</Text>
          </View>
          <Text style={styles.timeAgo}>
            {Math.floor((Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))} days ago
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#fbbf24",
      "in-progress": "#60a5fa",
      accepted: "#60a5fa",
      completed: "#34d399",
      incompleted: "#ef4444",
    };
    return colors[status] || "#94a3b8";
  };

  const filteredComplaints = getFilteredAndSortedComplaints();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search complaints..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, selectedType === null && styles.filterOptionActive]}
                onPress={() => setSelectedType(null)}
              >
                <Text style={[styles.filterOptionText, selectedType === null && styles.filterOptionTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedType === "hostel" && styles.filterOptionActive]}
                onPress={() => setSelectedType("hostel")}
              >
                <Text style={[styles.filterOptionText, selectedType === "hostel" && styles.filterOptionTextActive]}>Hostel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedType === "campus" && styles.filterOptionActive]}
                onPress={() => setSelectedType("campus")}
              >
                <Text style={[styles.filterOptionText, selectedType === "campus" && styles.filterOptionTextActive]}>Campus</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Issue Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
              <TouchableOpacity
                style={[styles.issueTypeFilter, selectedIssueType === null && styles.issueTypeFilterActive]}
                onPress={() => setSelectedIssueType(null)}
              >
                <Text style={[styles.issueTypeFilterText, selectedIssueType === null && styles.issueTypeFilterTextActive]}>All</Text>
              </TouchableOpacity>
              {ISSUE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[styles.issueTypeFilter, selectedIssueType === type.value && styles.issueTypeFilterActive]}
                  onPress={() => setSelectedIssueType(type.value)}
                >
                  <Text style={[styles.issueTypeFilterText, selectedIssueType === type.value && styles.issueTypeFilterTextActive]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, sortBy === "popular" && styles.filterOptionActive]}
                onPress={() => setSortBy("popular")}
              >
                <Text style={[styles.filterOptionText, sortBy === "popular" && styles.filterOptionTextActive]}>Popular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, sortBy === "recent" && styles.filterOptionActive]}
                onPress={() => setSortBy("recent")}
              >
                <Text style={[styles.filterOptionText, sortBy === "recent" && styles.filterOptionTextActive]}>Recent</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="inbox" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>No complaints found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={renderComplaint}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    paddingHorizontal: 8,
  },
  filterPanel: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterSection: { marginBottom: 12 },
  filterTitle: { fontSize: 14, fontWeight: "600", color: "#334155", marginBottom: 8 },
  filterOptions: { flexDirection: "row", gap: 8 },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterOptionActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  filterOptionText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  filterOptionTextActive: { color: "#fff" },
  issueTypeFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  issueTypeFilterActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  issueTypeFilterText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  issueTypeFilterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  issueTypeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 10 },
  issueTypeEmoji: { fontSize: 20 },
  issueType: { fontWeight: "700", fontSize: 13, color: "#334155", textTransform: "uppercase", letterSpacing: 0.5 },
  complaintType: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  upvotesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  upvotesText: { fontSize: 12, fontWeight: "600", color: "#b45309" },
  description: { marginBottom: 10, fontSize: 14, color: "#475569", lineHeight: 20 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, color: "#64748b", fontWeight: "600", textTransform: "capitalize" },
  timeAgo: { fontSize: 12, color: "#94a3b8" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { marginTop: 12, fontSize: 16, color: "#94a3b8", fontWeight: "500" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
