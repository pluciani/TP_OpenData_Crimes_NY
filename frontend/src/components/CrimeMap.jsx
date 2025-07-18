import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Paper, Typography, CircularProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { fetchCrimes } from "../api/fetchCrimes";

// Fix défaut d'icône Leaflet sous React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function CrimeMap() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrimes(500).then(data => {
      setCrimes(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Paper elevation={3} sx={{ height: "80vh", mt: 4 }}>
      <MapContainer center={[40.7128, -74.006]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {crimes.map((crime, index) => (
          <Marker key={index} position={[crime.latitude, crime.longitude]}>
            <Popup>
              <Typography variant="body1"><strong>{crime.ofns_desc}</strong></Typography>
              <Typography variant="body2">{crime.boro_nm}</Typography>
              <Typography variant="caption">{crime.cmplnt_fr_dt}</Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Paper>
  );
}
