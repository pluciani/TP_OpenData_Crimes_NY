import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Détermine la couleur selon le nombre de crimes
const getColor = (count) => {
  if (count > 300) return "#b10026";
  if (count > 150) return "#e31a1c";
  if (count > 75) return "#fc4e2a";
  if (count > 30) return "#fd8d3c";
  if (count > 10) return "#feb24c";
  return "#ffeda0";
};

const delta = 0.01; // ~1km

export default function CrimeGridMap() {
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/crime-grid")
      .then((res) => setGridData(res.data))
      .catch(console.error);
  }, []);

  return (
    <MapContainer center={[40.7128, -74.006]} zoom={11} style={{ height: "90vh", width: "50vw", mt: 2, mx: "auto" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {gridData.map((cell, index) => {
        const { lat, lon } = cell._id;
        const bounds = [
          [lat, lon],
          [lat + delta, lon + delta]
        ];
        const count = cell.count;

        return (
          <Rectangle
            key={index}
            bounds={bounds}
            pathOptions={{
              color: getColor(count),
              fillOpacity: 0.6,
              weight: 1
            }}
          />
        );
      })}
    </MapContainer>
  );
}
