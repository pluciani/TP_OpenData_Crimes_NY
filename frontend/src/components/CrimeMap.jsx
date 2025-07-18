import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Paper, Typography, CircularProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchCrimes } from "../api/fetchCrimes";

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
    <Paper elevation={3} sx={{ height: "90vh", width: "50vw", mt: 2, mx: "auto" }}>
      <MapContainer center={[40.7128, -74.006]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {crimes.map((crime, i) => {
          const lat = parseFloat(crime.Latitude);
          const lon = parseFloat(crime.Longitude);

          if (isNaN(lat) || isNaN(lon)) return null;

          return (
            <Marker key={i} position={[lat, lon]}>
              <Popup>
                <Typography variant="body1"><strong>{crime.OFNS_DESC}</strong></Typography>
                <Typography variant="body2">{crime.BORO_NM}</Typography>
                <Typography variant="caption">{crime.CMPLNT_FR_DT}</Typography>
                <br/>
                <Typography variant="body3">{"Suspect : " + crime.SUSP_SEX + " " + crime.SUSP_AGE_GROUP}</Typography>
                <br/>
                <Typography variant="body4">{"Victim : " + crime.VIC_SEX + " " + crime.VIC_AGE_GROUP}</Typography>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Paper>
  );
}
