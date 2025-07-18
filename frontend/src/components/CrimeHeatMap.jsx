import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import LeafletHeatmap from "./LeafletHeatMap";

export default function CrimeHeatMap() {
  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/crime-heat")
      .then((res) => setHeatData(res.data))
      .catch(console.error);
  }, []);

  return (
    <MapContainer center={[40.7128, -74.006]} zoom={11} style={{ height: "80vh", width: "80vw", mt: 2, mx: "auto" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LeafletHeatmap points={heatData} />
    </MapContainer>
  );
}
