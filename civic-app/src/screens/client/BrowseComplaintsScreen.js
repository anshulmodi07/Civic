import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api/axios";
// import { getAllComplaints } from "../../api/complaint.api";

const MOCK_COMPLAINTS = [
  {
    _id: "c001",
    issueType: "road",
    description: "Large pothole near the Lajpat Nagar market entry gate. Two-wheelers have fallen twice this week. Needs urgent patching before monsoon.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5468, lng: 77.2741 },
    supporters: ["u1", "u2", "u3", "u4", "u5", "u6"],
  },
  {
    _id: "c002",
    issueType: "water",
    description: "Water supply has been irregular for the past 10 days in Block C, Pocket 4, Okhla Phase 2. Pipes appear to be leaking near the main junction.",
    status: "assigned",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5412, lng: 77.2698 },
    supporters: ["u2", "u5", "u7"],
  },
  {
    _id: "c003",
    issueType: "electricity",
    description: "Street lights on the main road between Okhla and Nehru Place have not been working for 3 weeks. Creates safety hazard at night.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5489, lng: 77.2769 },
    supporters: ["u3", "u8", "u9", "u10"],
  },
  {
    _id: "c004",
    issueType: "sanitation",
    description: "Garbage bins overflowing near Lajpat Rai Market for 4 days. No pickup has happened. Stray animals are spreading waste on the road.",
    status: "closed",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5435, lng: 77.2715 },
    supporters: ["u1", "u4", "u6", "u11"],
  },
  {
    _id: "c005",
    issueType: "road",
    description: "Footpath tiles broken and uneven near Delhi Metro Lajpat Nagar exit. Senior citizens and children are at risk of tripping.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5501, lng: 77.2732 },
    supporters: ["u2", "u3"],
  },
  {
    _id: "c006",
    issueType: "water",
    description: "Sewage overflow onto the street near Amar Colony for the second time this month. Strong odour and health risk for residents.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5458, lng: 77.2758 },
    supporters: ["u1", "u5", "u6", "u7", "u8", "u9", "u12"],
  },
];

export default function BrowseComplaintsScreen({ navigation }) {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
  try {
    const res = await api.get("/complaints");
    setComplaints(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const renderComplaint = ({ item }) => {

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ComplaintDetail", { id: item._id })
        }
      >

        <Text style={styles.issueType}>
          {item.issueType.toUpperCase()}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.row}>

          <Text style={styles.status}>
            Status: {item.status}
          </Text>

          <Text style={styles.support}>
            👍 {item.supporters?.length || 0}
          </Text>

        </View>

      </TouchableOpacity>
    );
  };

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
 renderItem={renderComplaint}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#fff",
    padding:16,
    borderRadius:12,
    marginBottom:12,
    elevation:2
  },

  issueType:{
    fontWeight:"bold",
    fontSize:14,
    color:"#2563eb"
  },

  description:{
    marginTop:6,
    fontSize:15,
    color:"#0f172a"
  },

  row:{
    marginTop:10,
    flexDirection:"row",
    justifyContent:"space-between"
  },

  status:{
    fontSize:13,
    color:"#475569"
  },

  support:{
    fontSize:13
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }

});