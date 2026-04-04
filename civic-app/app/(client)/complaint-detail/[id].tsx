import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "@/src/components/StatusBadge";
import { getComplaintById } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  issueType: string;
  description: string;
  status: string;
  createdAt: string;
  supporters?: string[];
  location?: { lat: number; lng: number };
};

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaint = async () => {
      if (!id) return;

      try {
        const response = await getComplaintById(Array.isArray(id) ? id[0] : id);
        setComplaint(response);
      } catch (error) {
        console.log("Complaint detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

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
        <Text style={styles.errorText}>Complaint not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#3b82f6"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.headerContent}>
            <Text style={styles.issueType}>{complaint.issueType?.toUpperCase()}</Text>
            <StatusBadge status={complaint.status} />
          </View>
          <Text style={styles.description}>{complaint.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Reported on {new Date(complaint.createdAt).toDateString()}</Text>
            <Text style={styles.metaItem}>Supporters {complaint.supporters?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.sectionText}>
            Lat: {complaint.location?.lat}, Lng: {complaint.location?.lng}
          </Text>
        </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  spacer: {
    width: 46,
  },
  body: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  issueType: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2563eb",
  },
  description: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    color: "#64748b",
    fontSize: 13,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0f172a",
  },
  sectionText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
});
