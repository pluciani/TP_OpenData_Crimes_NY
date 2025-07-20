import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet.heat";

export default function LeafletHeatmap({ points }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    if (points && points.length > 0) {
      const heatLayer = L.heatLayer(points, {
        radius: 20,
        blur: 25,
        maxZoom: 17,
        max: getDynamicMax(map.getZoom()),
        gradient: {
          0.1: "blue",
          0.3: "lime",
          0.5: "yellow",
          0.7: "orange",
          1.0: "red",
        },
      }).addTo(map);

      layerRef.current = heatLayer;
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, points]);

  return null;
}

function getDynamicMax(zoom) {
  if (zoom >= 15) return 3;
  if (zoom >= 13) return 5;
  if (zoom >= 11) return 8;
  return 12;
}
