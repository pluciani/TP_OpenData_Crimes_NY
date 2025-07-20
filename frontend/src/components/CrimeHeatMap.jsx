import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import LeafletHeatmap from "./LeafletHeatmap";
import {
  Autocomplete,
  TextField,
  Box,
  Typography
} from "@mui/material";

export default function CrimeHeatMap() {
  const [heatData, setHeatData] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/crime-types")
      .then((res) => setCrimeTypes(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const url = selectedType
        ? `http://localhost:5000/crime-heat?type=${encodeURIComponent(selectedType)}`
        : `http://localhost:5000/crime-heat`;

      const res = await axios.get(url);
      setHeatData(res.data);
    };

    fetchData();
  }, [selectedType]);

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Filtrer par type de crime</Typography>
        <Autocomplete
          options={crimeTypes}
          value={selectedType}
          onChange={(e, newValue) => setSelectedType(newValue)}
          renderInput={(params) => <TextField {...params} label="Type de crime" />}
          sx={{ width: 400, mt: 1 }}
          clearOnEscape
        />
      </Box>

      <MapContainer center={[40.7128, -74.006]} zoom={11} style={{ height: "90vh", width: "50vw", mt: 2, mx: "auto" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LeafletHeatmap points={heatData} />
      </MapContainer>
    </>
  );
}
