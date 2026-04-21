import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { getMyTasks } from "../../api/task.api";
import TaskCard from "../../components/Taskcard";
import api from "../../api/axios";

const MOCK_TASKS = [
  {
    _id: "t001",
    complaintId: "c001",
    issueType: "road",
    status: "in-progress",
    description: "Pothole repair near Lajpat Nagar market entry gate.",
    assignedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t002",
    complaintId: "c002",
    issueType: "water",
    status: "accepted",
    description: "Inspect and repair leaking pipe junction in Block C, Okhla Phase 2.",
    assignedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t003",
    complaintId: "c003",
    issueType: "electricity",
    status: "assigned",
    description: "Replace faulty street light units on the Okhla–Nehru Place road stretch.",
    assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t004",
    complaintId: "c004",
    issueType: "sanitation",
    status: "resolved",
    description: "Clear overflowing garbage bins near Lajpat Rai Market.",
    assignedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "t005",
    complaintId: "c006",
    issueType: "water",
    status: "in-progress",
    description: "Fix recurring sewage overflow near Amar Colony.",
    assignedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
];

export default function MyTasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
  try {
    const res = await api.get("/tasks/my");
    setTasks(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const filters = [
    { label: "All", value: "all", icon: "list" },
    { label: "Assigned", value: "assigned", icon: "document-text" },
    { label: "Accepted", value: "accepted", icon: "checkmark-circle" },
    { label: "In Progress", value: "in-progress", icon: "time" },
    { label: "Resolved", value: "resolved", icon: "checkmark-done" },
  ];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="file-tray-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No tasks found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === "all"
          ? "You don't have any tasks yet"
          : `No ${filter.replace("-", " ")} tasks`}
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>My Tasks</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterPill,
              filter === item.value && styles.filterPillActive,
            ]}
            onPress={() => setFilter(item.value)}
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={filter === item.value ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.filterText,
                filter === item.value && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
        </Text>
      </View>

      {/* Tasks List using TaskCard component */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            complaintId={item.complaintId}
            status={item.status}
            onPress={() => navigation.navigate("TaskDetail", { task: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2E5BFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: "#fff",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: "#2E5BFF",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#fff",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
});