import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTravaux } from "../context/TravauxContext";
import { useSignalements } from "../context/SignalementContext";

const Map = () => {
  const { travaux } = useTravaux();
  const { signalements } = useSignalements();

  useEffect(() => {
    const map = L.map("map").setView([-18.8792, 47.5079], 13);

    L.tileLayer("http://localhost:8000/styles/osm-bright/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 20,
    }).addTo(map);

    // 🏗️ Travaux (BACKEND)
    travaux.forEach((t) => {
      if (!t.latitude || !t.longitude) return;

      L.marker([t.latitude, t.longitude], { title: "Travaux" })
        .addTo(map)
        .bindPopup(`
          <strong>Travaux</strong><br/>
          ${t.titre}<br/>
          ${t.statut}
        `);
    });

    // 📱 Signalements (FIREBASE)
    signalements.forEach((s) => {
      if (!s.latitude || !s.longitude) return;

      L.marker([s.latitude, s.longitude])
        .addTo(map)
        .bindPopup(`
          <strong>Signalement mobile</strong><br/>
          ${s.titre}<br/>
          ${s.description}
        `);
    });

    return () => map.remove();
  }, [travaux, signalements]); // 👈 clé magique

  return <div id="map" className="w-full h-full rounded-3xl" />;
};

export default Map;
