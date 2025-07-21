import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import LeafletHeatmap from "./LeafletHeatmap";

export default function CrimeHeatMap() {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [heatData, setHeatData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/crime-types");
        setTypes(res.data);
      } catch (err) {
        console.error("Erreur récupération types", err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let url = `http://localhost:5000/crime-heat?`;

      if (selectedType) {
        url += `type=${encodeURIComponent(selectedType)}&`;
      }

      if (startDate && endDate) {
        url += `start_date=${format(startDate, "yyyy-MM-dd")}&`;
        url += `end_date=${format(endDate, "yyyy-MM-dd")}`;
      }

      try {
        const res = await axios.get(url);
        setHeatData(res.data);
      } catch (err) {
        console.error("Erreur récupération heatmap", err);
        setHeatData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType, startDate, endDate]);


  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Autocomplete
          options={types}
          value={selectedType}
          onChange={(e, newValue) => setSelectedType(newValue)}
          renderInput={(params) => <TextField {...params} label="Type de crime" />}
          sx={{ width: 300 }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              label="Date début"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="Date fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
        </LocalizationProvider>

        {loading && <CircularProgress size={24} />}
        <Typography variant="caption" color="text.secondary">
          {heatData.length} crimes affichés sur la carte
        </Typography>
      </Box>

      <MapContainer
        center={[40.7128, -74.006]}
        zoom={11}
        scrollWheelZoom={true}
        style={{
          height: "70vh",
          width: "50vw",
          marginTop: "16px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletHeatmap points={heatData} />
      </MapContainer>
    </Box>
  );
}
