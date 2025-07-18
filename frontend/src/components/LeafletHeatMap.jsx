import { useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import * as L from "leaflet";
import "leaflet.heat";

export default function LeafletHeatmap({ points }) {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState(null);

  const getDynamicMax = () => {
    const zoom = map.getZoom();
    if (zoom >= 15) return 3;
    if (zoom >= 13) return 5;
    if (zoom >= 11) return 8;
    return 12;
  };

  const updateHeat = () => {
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    const newLayer = L.heatLayer(points, {
      radius: 20,
      blur: 25,
      maxZoom: 17,
      max: getDynamicMax(),
      gradient: {
        0.1: "blue",
        0.3: "lime",
        0.5: "yellow",
        0.7: "orange",
        1.0: "red",
      },
    }).addTo(map);

    setHeatLayer(newLayer);
  };

  useEffect(() => {
    updateHeat();

    const handleZoom = () => {
      updateHeat();
    };

    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
