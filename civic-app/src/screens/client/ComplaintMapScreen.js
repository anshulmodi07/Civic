import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker, Heatmap } from "react-native-maps";
import * as Location from "expo-location";
import { getNearbyComplaints } from "../../api/complaint.api";

const getDisplayStatus = (complaint) => {
  if (complaint?.assignedTask?.status) return complaint.assignedTask.status;
  return complaint.status;
};

export default function ComplaintMapScreen({ navigation }) {

  const [location, setLocation] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const heatmapPoints = complaints.map((c) => ({
  latitude: c.location?.lat,
  longitude: c.location?.lng,
  weight: 1
}));

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    const data = await getNearbyComplaints(loc.coords.latitude, loc.coords.longitude, 5);
    setComplaints(data || []);

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
          title={String(getDisplayStatus(c)).replace("-", " ")}
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