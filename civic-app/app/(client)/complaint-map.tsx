import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getNearbyComplaints } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  issueType: string;
  description: string;
  location: { lat: number; lng: number };
};

export default function ComplaintMap() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const nearby = await getNearbyComplaints();
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: complaints.length > 0 ? complaints[0].location.lat : 28.8427,
          longitude: complaints.length > 0 ? complaints[0].location.lng : 77.1054,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {complaints.map((item) => (
          <Marker
            key={item._id}
            coordinate={{
              latitude: item.location.lat,
              longitude: item.location.lng,
            }}
            pinColor="#3b82f6"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{item.issueType.toUpperCase()}</Text>
                <Text style={styles.calloutDesc}>{item.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#2563eb",
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 13,
    color: "#334155",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
