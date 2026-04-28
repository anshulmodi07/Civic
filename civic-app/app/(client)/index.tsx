import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { getCitizenDashboard } from "@/src/api/complaint.api";
console.log("dashboard fn:", getCitizenDashboard);

export default function ClientHome() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    myComplaints: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getCitizenDashboard();
        setStats(response);
      } catch (error) {
        console.log("Dashboard error:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome 👋</Text>
            <Text style={styles.userName}>{user?.name || "Student"}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statCount}>{stats.activeComplaints}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCount}>{stats.resolvedComplaints}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCount}>{stats.myComplaints}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.primaryCard}
            activeOpacity={0.85}
            onPress={() => router.push("/create-complaint")}
          >
            <LinearGradient
              colors={["#2563eb", "#1e40af"]}
              style={styles.primaryCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="add-circle" size={32} color="#fff" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.primaryCardTitle}>Report Grievance</Text>
                <Text style={styles.primaryCardSubtitle}>
                  Report hostel or campus issues
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="rgba(255,255,255,0.7)"
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            activeOpacity={0.85}
            onPress={() => router.push("/my-complaints")}
          >
            <View style={styles.cardIconAlt}>
              <Ionicons name="document-text-outline" size={28} color="#2563eb" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.secondaryCardTitle}>My Complaints</Text>
              <Text style={styles.secondaryCardSubtitle}>
                Track your reported issues
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            activeOpacity={0.85}
            onPress={() => router.push("/browse")}
          >
            <View style={styles.cardIconAlt}>
              <Ionicons name="globe-outline" size={28} color="#2563eb" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.secondaryCardTitle}>Browse Grievances</Text>
              <Text style={styles.secondaryCardSubtitle}>
                See issues reported on campus
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            activeOpacity={0.85}
            onPress={() => router.push("/complaint-map")}
          >
            <View style={styles.cardIconAlt}>
              <Ionicons name="map-outline" size={28} color="#2563eb" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.secondaryCardTitle}>Grievance Map</Text>
              <Text style={styles.secondaryCardSubtitle}>
                View grievances on campus map
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/signout")}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  userName: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f59e0b",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
    marginHorizontal: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statCount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  statLabel: {
    marginTop: 10,
    color: "#475569",
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  primaryCard: {
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",
  },
  primaryCardGradient: {
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardIconAlt: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  primaryCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  primaryCardSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 22,
  },
  secondaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  secondaryCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  secondaryCardSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 30,
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
