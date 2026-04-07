import { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { getNearbyComplaints } from "@/src/api/complaint.api";

type Complaint = {
  _id: string;
  issueType: string;
  description: string;
  location: { lat: number; lng: number };
};

export default function ComplaintMapWeb() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  // 📌 Fetch complaints
  useEffect(() => {
    const loadData = async () => {
      try {
        const nearby = await getNearbyComplaints();
        setComplaints(nearby || []);
      } catch (error) {
        console.log("Map load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const center =
    complaints.length > 0
      ? [complaints[0].location.lat, complaints[0].location.lng]
      : [28.7450, 77.1120];

  // 📌 Leaflet map logic (SAFE)
  useEffect(() => {
    let map: any;
    let markers: any[] = [];

    const initMap = async () => {
      // 🚨 Prevent SSR crash
      if (typeof window === "undefined") return;

      const L = await import("leaflet");

      // optional: fix marker icons issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current || complaints.length === 0) return;

      // Create map only once
      if (!mapInstance.current) {
        map = L.map(mapRef.current, {
          center: center as [number, number],
          zoom: 14,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        mapInstance.current = map;
      } else {
        map = mapInstance.current;
        map.setView(center as [number, number], 14);
      }

      // Add markers
      complaints.forEach((item) => {
        const marker = L.circleMarker(
          [item.location.lat, item.location.lng],
          {
            radius: 10,
            color: "#2563eb",
            fillColor: "#60a5fa",
            fillOpacity: 0.7,
          }
        ).addTo(map);

        marker.bindPopup(`
          <div style="max-width:220px">
            <strong>${item.issueType.toUpperCase()}</strong><br />
            <span style="font-size:13px">${item.description}</span><br />
            <span style="font-size:12px;color:#64748b">
              ${item.location.lat.toFixed(5)}, ${item.location.lng.toFixed(5)}
            </span>
          </div>
        `);

        markers.push(marker);
      });
    };

    initMap();

    // 🧹 Cleanup
    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [complaints]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Map</Text>
      <Text style={styles.subtitle}>
        Interact with open complaint locations in a real Leaflet map.
      </Text>

      <View style={styles.mapWrapper}>
        <div ref={mapRef} style={styles.map as any} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
  },
  mapWrapper: {
    flex: 1,
    minHeight: 420,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});