import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker, Heatmap } from "react-native-maps";
import * as Location from "expo-location";
// import { getNearbyComplaints } from "../../api/complaint.api";
import api from "../../api/axios";

const MOCK_NEARBY = [
  {
    _id: "c001",
    issueType: "road",
    description: "Large pothole near the Lajpat Nagar market entry gate.",
    status: "in-progress",
    location: { lat: 28.5468, lng: 77.2741 },
    supportCount: 6,
  },
  {
    _id: "c002",
    issueType: "water",
    description: "Water supply irregular in Block C, Okhla Phase 2.",
    status: "assigned",
    location: { lat: 28.5412, lng: 77.2698 },
    supportCount: 3,
  },
  {
    _id: "c003",
    issueType: "electricity",
    description: "Street lights not working between Okhla and Nehru Place.",
    status: "pending",
    location: { lat: 28.5489, lng: 77.2769 },
    supportCount: 4,
  },
  {
    _id: "c004",
    issueType: "sanitation",
    description: "Garbage bins overflowing near Lajpat Rai Market.",
    status: "closed",
    location: { lat: 28.5435, lng: 77.2715 },
    supportCount: 4,
  },
  {
    _id: "c005",
    issueType: "road",
    description: "Footpath tiles broken near Delhi Metro Lajpat Nagar exit.",
    status: "pending",
    location: { lat: 28.5501, lng: 77.2732 },
    supportCount: 2,
  },
  {
    _id: "c006",
    issueType: "water",
    description: "Sewage overflow near Amar Colony.",
    status: "in-progress",
    location: { lat: 28.5458, lng: 77.2758 },
    supportCount: 7,
  },
];

export default function ComplaintMapScreen({ navigation }) {

  const [location, setLocation] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const heatmapPoints = complaints.map((c) => ({
  latitude: c.location?.lat,
  longitude: c.location?.lng,
  weight: c.supportCount || 1
}));

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    const res = await api.get("/complaints/nearby");
    setComplaints(res.data);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  if (loading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (

    <MapView showsUserLocation={true}
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
        <Heatmap
  points={heatmapPoints}
  radius={40}
  opacity={0.7}
/>

      {complaints.map((c) => (

        <Marker
          key={c._id}
          coordinate={{
            latitude: c.location?.lat,
            longitude: c.location?.lng,
          }}
          title={c.issueType}
          description={c.description}
          onPress={() =>
            navigation.navigate("ComplaintDetail", { id: c._id })
          }
        />

      ))}
    
    </MapView>

  );
}

const styles = StyleSheet.create({

  map:{
    flex:1
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }

});