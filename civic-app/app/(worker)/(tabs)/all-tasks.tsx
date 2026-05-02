import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCallback, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { getAvailableTasks, acceptTask } from "@/src/api/task.api";
import { Complaint } from "@/src/types/task";
import { Ionicons } from "@expo/vector-icons";

export default function AllTasks() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading]       = useState(true);
  const [accepting, setAccepting]   = useState<string | null>(null);
  const router = useRouter();

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await getAvailableTasks();
      setComplaints(data || []);
    } catch (e: any) {
      console.log("Error loading tasks:", e.message);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadComplaints(); }, []));

  const handleAccept = async (complaint: Complaint) => {
    setAccepting(complaint._id);
    try {
      await acceptTask(complaint._id);
      setComplaints(prev => prev.filter(c => c._id !== complaint._id));
    } catch (err: any) {
      console.log("Accept error:", err.message);
    } finally {
      setAccepting(null);
    }
  };

  const getLocation = (c: Complaint) => {
    if (c.type === "campus") return c.area;
    if (c.visibility === "public") return `${c.hostelName} — ${c.landmark}`;
    return `${c.hostelName} — Floor ${c.floor}, Room ${c.roomNumber}`;
  };

  const renderItem = ({ item }: { item: Complaint }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{item.type === "campus" ? "Campus" : "Hostel"}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pending</Text>
        </View>
      </View>

      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color="#378ADD" />
          <Text style={styles.metaText} numberOfLines={1}>{getLocation(item)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color="#B4B2A9" />
          <Text style={styles.metaText}>
            {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.acceptBtn, accepting === item._id && styles.acceptBtnDisabled]}
        onPress={() => handleAccept(item)}
        disabled={accepting === item._id}
      >
        <Text style={styles.acceptBtnText}>
          {accepting === item._id ? "Accepting..." : "Accept task"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#185FA5" />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#185FA5" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>All tasks</Text>
      <Text style={styles.pageSub}>Tasks available for your department</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{complaints.length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },
  pageTitle: { fontSize: 22, fontWeight: "500", color: "#0f172a" },
  pageSub: { fontSize: 13, color: "#888780", marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#F1EFE8", borderRadius: 12, padding: 14, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "500", color: "#185FA5" },
  statLabel: { fontSize: 11, color: "#888780" },
  card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#D3D1C7", padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardType: { fontSize: 11, fontWeight: "600", color: "#888780", textTransform: "uppercase", letterSpacing: 0.5 },
  badge: { backgroundColor: "#E6F1FB", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "500", color: "#185FA5" },
  cardDesc: { fontSize: 14, fontWeight: "500", color: "#0f172a", lineHeight: 20, marginBottom: 10 },
  metaRow: { flexDirection: "row", gap: 14, marginBottom: 12, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "#888780" },
  acceptBtn: { backgroundColor: "#3B6D11", paddingVertical: 11, borderRadius: 12, alignItems: "center" },
  acceptBtnDisabled: { backgroundColor: "#888780" },
  acceptBtnText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { color: "#888780", fontSize: 14 },
});