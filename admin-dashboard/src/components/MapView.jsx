import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icons = {
  water: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [25, 25],
  }),
  electricity: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [25, 25],
  }),
  road: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [25, 25],
  }),
  garbage: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [25, 25],
  }),
};

export default function MapView({ complaints }) {
  return (
    <MapContainer
      center={[28.75, 77.11]}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {complaints.map((c) => (
        <Marker
          key={c._id}
          position={[c.location.lat, c.location.lng]}
          icon={icons[c.issueType]}
        >
          <Popup>
            <strong>{c.issueType}</strong>
            <br />
            {c.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
