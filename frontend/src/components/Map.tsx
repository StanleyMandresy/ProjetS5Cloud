import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTravaux } from "../context/TravauxContext";
import { useSignalements } from "../context/SignalementContext";

const Map = () => {
  const { travaux, loading: loadingTravaux } = useTravaux();
  const { signalements, loading: loadingSignalements, syncSignalements } = useSignalements();
  const mapRef = useRef<L.Map | null>(null);

  const getColorByStatus = (statut: string): string => {
    switch (statut) {
      case "NOUVEAU": return "#ef4444";
      case "EN_COURS": return "#f59e0b";
      case "TERMINE":
      case "RESOLU": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const getStatusText = (statut: string): string => {
    switch (statut) {
      case "NOUVEAU": return "Nouveau";
      case "EN_COURS": return "En cours";
      case "TERMINE":
      case "RESOLU": return "Terminé";
      default: return statut;
    }
  };

  // Initialisation de la map une seule fois
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([-18.8792, 47.5079], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Ajout des markers travaux dès le départ
      const createCustomIcon = (color: string) =>
        L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });

      travaux.forEach((t) => {
        if (!t.latitude || !t.longitude) return;
        const color = getColorByStatus(t.statut);
        const icon = createCustomIcon(color);
        L.marker([t.latitude, t.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:200px;font-family:system-ui;">
              <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;color:#1f2937;">
                ${t.titre}
              </h3>
              <p style="margin:0 0 8px 0;color:#4b5563;font-size:13px;">
                ${t.description || "Pas de description"}
              </p>
              <div style="background:#f3f4f6;padding:8px;border-radius:6px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="font-weight:600;color:#374151;">Statut:</span>
                  <span style="
                    background:${color};
                    color:white;
                    padding:2px 8px;
                    border-radius:12px;
                    font-size:12px;
                    font-weight:500;
                  ">${getStatusText(t.statut)}</span>
                </div>
              </div>
            </div>
          `);
      });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [travaux]);

  // Ajouter les signalements après le clic sur le bouton
  useEffect(() => {
    if (!mapRef.current || loadingSignalements || signalements.length === 0) return;

    const map = mapRef.current;
    const createCustomIcon = (color: string) =>
      L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

    signalements.forEach((s) => {
      if (!s.latitude || !s.longitude) return;
      const color = getColorByStatus(s.status);
      const icon = createCustomIcon(color);
      L.marker([s.latitude, s.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:system-ui;">
            <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:bold;color:#1f2937;">
              Signalement
            </h3>
            <p style="margin:0 0 8px 0;color:#4b5563;font-size:13px;">
              ${s.description || "Pas de description"}
            </p>
            <div style="background:#f3f4f6;padding:8px;border-radius:6px;">
              <div style="display:flex;justify-content:space-between;">
                <span style="font-weight:600;color:#374151;">Statut:</span>
                <span style="
                  background:${color};
                  color:white;
                  padding:2px 8px;
                  border-radius:12px;
                  font-size:12px;
                  font-weight:500;
                ">${getStatusText(s.status)}</span>
              </div>
            </div>
          </div>
        `);
    });
  }, [signalements, loadingSignalements]);

  return (
    <div className="relative w-full h-full rounded-3xl">
      <button
        onClick={syncSignalements}
        disabled={loadingSignalements}
        className="absolute top-4 left-4 z-50 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
      >
        {loadingSignalements ? "Synchronisation..." : "Synchroniser les signalements"}
      </button>
      <div id="map" className="w-full h-full rounded-3xl" />
    </div>
  );
};

export default Map;
