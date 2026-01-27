import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTravaux } from "../context/TravauxContext";

const Map = () => {
  const { travaux, loading } = useTravaux(); // ✅ AU BON ENDROIT

  useEffect(() => {
    if (loading) return;

    const map = L.map("map").setView([-18.8792, 47.5079], 13);

    L.tileLayer("http://localhost:8000/styles/osm-bright/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 20,
    }).addTo(map);

  
    travaux.forEach((t) => {
      if (!t.latitude || !t.longitude) return;
      L.marker([t.latitude, t.longitude], { color: "red" })
        .addTo(map)
        .bindPopup(`
          <strong>${t.titre}</strong><br/>
          ${t.description}<br/>
          <em>${t.statut}</em>
        `);
    });

    return () => {
      map.remove();
    };
  }, [travaux, loading]);

  return (
    <div
      id="map"
      className="w-full h-full rounded-3xl"
    />
  );
};

export default Map;
