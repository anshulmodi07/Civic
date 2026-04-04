import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllComplaints } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  issueType: string;
  description: string;
  status: string;
  supporters?: string[];
};

export default function BrowseComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data);
      } catch (error) {
        console.log("Browse complaints error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const renderItem = ({ item }: { item: Complaint }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({ pathname: "/complaint-detail/[id]", params: { id: item._id } })
      }
    >
      <Text style={styles.issueType}>{item.issueType?.toUpperCase()}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.row}>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.support}>👍 {item.supporters?.length || 0}</Text>
      </View>
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
    <FlatList
      data={complaints}
      keyExtractor={(item) => item._id?.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: "#f8fafc",
  },
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
  issueType: {
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 8,
  },
  description: {
    color: "#0f172a",
    fontSize: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    color: "#475569",
    fontSize: 13,
  },
  support: {
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
