import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { getMyTasks } from "../../api/task.api";
// import { updateAvailability } from "../../api/user.api";
import TaskCard from "../../components/Taskcard";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const MOCK_USER = {
  name: "Ramesh Kumar",
  department: "maintenance",
  userId: "worker01",
};

const MOCK_TASKS = [
  {
    _id: "t001",
    complaintId: "c001",
    issueType: "road",
    status: "in-progress",
    description: "Pothole repair near Lajpat Nagar market entry gate. Ensure proper levelling and compaction after filling.",
    assignedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t002",
    complaintId: "c002",
    issueType: "water",
    status: "accepted",
    description: "Inspect and repair leaking pipe junction in Block C, Okhla Phase 2. Check main valve and replace faulty coupling.",
    assignedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t003",
    complaintId: "c003",
    issueType: "electricity",
    status: "assigned",
    description: "Replace faulty street light units on the Okhla–Nehru Place road stretch. 6 poles need attention.",
    assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "t004",
    complaintId: "c004",
    issueType: "sanitation",
    status: "resolved",
    description: "Clear overflowing garbage bins near Lajpat Rai Market and schedule regular pickup for the next 2 weeks.",
    assignedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "t005",
    complaintId: "c006",
    issueType: "water",
    status: "in-progress",
    description: "Fix recurring sewage overflow near Amar Colony. Identify root cause — possibly blocked main drain.",
    assignedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
];

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const user = MOCK_USER;
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [availability, setAvailability] = useState("available");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
  try {
    const res = await api.get("/tasks/my");
    const tasks = res.data;

    setTasks(tasks);

    setStats({
      assigned: tasks.filter(t => t.status === "assigned").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "resolved").length,
    });
  } catch (err) {
    console.log(err);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleAvailabilityToggle = async () => {
    const newStatus = availability === "available" ? "unavailable" : "available";
    setAvailability(newStatus);
  };

  const getDepartmentIcon = (dept) => {
    const icons = {
      electrical: "flash",
      plumbing: "water",
      cleaning: "sparkles",
      maintenance: "construct",
    };
    return icons[dept?.toLowerCase()] || "briefcase";
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      electrical: ["#F59E0B", "#D97706"],
      plumbing: ["#3B82F6", "#2563EB"],
      cleaning: ["#10B981", "#059669"],
      maintenance: ["#8B5CF6", "#7C3AED"],
    };
    return colors[dept?.toLowerCase()] || ["#6B7280", "#4B5563"];
  };

  const totalTasks = stats.assigned + stats.inProgress + stats.completed;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient colors={["#2E5BFF", "#1E40AF"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.name || "Worker"}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Department Badge */}
        <View style={styles.departmentBadge}>
          <Ionicons
            name={getDepartmentIcon(user.department)}
            size={20}
            color="#fff"
          />
          <Text style={styles.departmentText}>
            {user.department?.toUpperCase() || "WORKER"}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Availability Toggle Card */}
        {/* <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name={availability === "available" ? "checkmark-circle" : "close-circle"}
                size={24}
                color={availability === "available" ? "#10B981" : "#EF4444"}
              />
              <Text style={styles.cardTitle}>Availability Status</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.availabilityButton,
              availability === "available"
                ? styles.availableButton
                : styles.unavailableButton,
            ]}
            onPress={handleAvailabilityToggle}
          >
            <Text
              style={[
                styles.availabilityButtonText,
                availability === "available"
                  ? styles.availableButtonText
                  : styles.unavailableButtonText,
              ]}
            >
              {availability === "available" ? "Available for Tasks" : "Not Available"}
            </Text>
            <Ionicons
              name={availability === "available" ? "toggle" : "toggle-outline"}
              size={28}
              color={availability === "available" ? "#10B981" : "#6B7280"}
            />
          </TouchableOpacity>
        </View> */}

        {/* Stats Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="stats-chart" size={24} color="#2E5BFF" />
              <Text style={styles.cardTitle}>Task Overview</Text>
            </View>
            <Text style={styles.totalTasks}>{totalTasks} Total</Text>
          </View>

          <View style={styles.statsGrid}>
            {/* Assigned Tasks */}
            <View style={[styles.statCard, { borderLeftColor: "#F59E0B" }]}>
              <View style={styles.statHeader}>
                <Ionicons name="document-text" size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{stats.assigned}</Text>
              </View>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>

            {/* In Progress Tasks */}
            <View style={[styles.statCard, { borderLeftColor: "#3B82F6" }]}>
              <View style={styles.statHeader}>
                <Ionicons name="time" size={20} color="#3B82F6" />
                <Text style={styles.statValue}>{stats.inProgress}</Text>
              </View>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>

            {/* Completed Tasks */}
            <View style={[styles.statCard, { borderLeftColor: "#10B981" }]}>
              <View style={styles.statHeader}>
                <Ionicons name="checkmark-done" size={20} color="#10B981" />
                <Text style={styles.statValue}>{stats.completed}</Text>
              </View>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* My Tasks */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="list" size={24} color="#2E5BFF" />
              <Text style={styles.cardTitle}>My Tasks</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MyTasks")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {tasks.length > 0 ? (
            <FlatList
              data={tasks.slice(0, 5)} // Show first 5 tasks
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TaskCard
                  complaintId={item.complaintId}
                  status={item.status}
                  onPress={() => navigation.navigate("TaskDetail", { task: item })}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No tasks assigned yet</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            Keep your availability status updated to receive task assignments
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  departmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  departmentText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  totalTasks: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E5BFF",
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  availabilityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  availableButton: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  unavailableButton: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  availabilityButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  availableButtonText: {
    color: "#047857",
  },
  unavailableButtonText: {
    color: "#6B7280",
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2E5BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonGradient: {
    padding: 18,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
});