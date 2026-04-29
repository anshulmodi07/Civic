import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, FlatList } from "react-native";
import * as Location from "expo-location";
import { getAllComplaints, getNearbyComplaints } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  departmentId?: string | { _id: string; name: string };
  departmentName?: string;
  description: string;
  location: { lat: number; lng: number };
};

const getDepartmentName = (complaint: Complaint) => {
  if (complaint.departmentName) return complaint.departmentName;
  const dept = complaint.departmentId;
  if (!dept) return "";
  return typeof dept === "string" ? dept : dept.name || "";
};

export default function ComplaintMap() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const current = await Location.getCurrentPositionAsync({});
          const nearby = await getNearbyComplaints(
            current.coords.latitude,
            current.coords.longitude,
            5
          );
          setComplaints(nearby || []);
          return;
        }

        const nearby = await getAllComplaints();
        setComplaints(nearby);
      } catch (error) {
        console.log("Map load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Map Placeholder</Text>
      <Text style={styles.subtitle}>
        Demo mode shows complaint locations without a native map implementation.
      </Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.issueType}>{(getDepartmentName(item) || "Department").toUpperCase()}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.locationText}>
              {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginHorizontal: 24,
    marginBottom: 20,
  },
  list: {
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
  issueType: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 8,
  },
  description: {
    color: "#0f172a",
    fontSize: 15,
    marginBottom: 10,
  },
  locationText: {
    color: "#475569",
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
