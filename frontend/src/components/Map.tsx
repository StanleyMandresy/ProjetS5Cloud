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
        
        // Formatter la date
        const dateSignalement = t.dateSignalement 
          ? new Date(t.dateSignalement).toLocaleDateString('fr-FR')
          : 'Non renseignée';
        
        // Créer le tooltip au survol
        const tooltipContent = `
          <div style="font-family:system-ui;font-size:12px;padding:4px;">
            <strong style="color:#1f2937;">${t.titre}</strong><br/>
            <span style="color:#6b7280;">📅 ${dateSignalement}</span><br/>
            <span style="padding:1px 6px;background:${color};color:white;border-radius:8px;font-size:11px;">
              ${getStatusText(t.statut)}
            </span>
          </div>
        `;
        
        // Créer le popup détaillé au clic
        const popupContent = `
          <div style="min-width:250px;font-family:system-ui;">
            <h3 style="margin:0 0 10px 0;font-size:16px;font-weight:bold;color:#1f2937;">
              ${t.titre}
            </h3>
            <p style="margin:0 0 12px 0;color:#4b5563;font-size:13px;">
              ${t.description || "Pas de description"}
            </p>
            <div style="background:#f3f4f6;padding:10px;border-radius:8px;">
              <div style="display:grid;gap:6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:600;color:#374151;">📅 Date:</span>
                  <span style="color:#1f2937;font-size:13px;">${dateSignalement}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:600;color:#374151;">📊 Statut:</span>
                  <span style="background:${color};color:white;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:500;">
                    ${getStatusText(t.statut)}
                  </span>
                </div>
                ${t.surfaceM2 ? `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:600;color:#374151;">📐 Surface:</span>
                  <span style="color:#1f2937;font-size:13px;">${t.surfaceM2} m²</span>
                </div>
                ` : ''}
                ${t.budget ? `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:600;color:#374151;">💰 Budget:</span>
                  <span style="color:#1f2937;font-size:13px;">${t.budget}</span>
                </div>
                ` : ''}
                ${t.entrepriseNom ? `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:600;color:#374151;">🏢 Entreprise:</span>
                  <span style="color:#1f2937;font-size:13px;">${t.entrepriseNom}</span>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
        
        L.marker([t.latitude, t.longitude], { icon })
          .addTo(map)
          .bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
          })
          .bindPopup(popupContent);
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
      
      // Formatter la date
      const dateCreation = s.createdAt?.toDate 
        ? s.createdAt.toDate().toLocaleDateString('fr-FR')
        : s.createdAt
        ? new Date(s.createdAt).toLocaleDateString('fr-FR')
        : 'Non renseignée';
      
      // Créer le tooltip au survol
      const tooltipContent = `
        <div style="font-family:system-ui;font-size:12px;padding:4px;">
          <strong style="color:#1f2937;">Signalement</strong><br/>
          <span style="color:#6b7280;">📅 ${dateCreation}</span><br/>
          <span style="padding:1px 6px;background:${color};color:white;border-radius:8px;font-size:11px;">
            ${getStatusText(s.status)}
          </span>
        </div>
      `;
      
      // Créer le popup détaillé au clic
      const popupContent = `
        <div style="min-width:250px;font-family:system-ui;">
          <h3 style="margin:0 0 10px 0;font-size:16px;font-weight:bold;color:#1f2937;">
            📍 Signalement
          </h3>
          <p style="margin:0 0 12px 0;color:#4b5563;font-size:13px;">
            ${s.description || "Pas de description"}
          </p>
          <div style="background:#f3f4f6;padding:10px;border-radius:8px;">
            <div style="display:grid;gap:6px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;color:#374151;">📅 Date:</span>
                <span style="color:#1f2937;font-size:13px;">${dateCreation}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;color:#374151;">📊 Statut:</span>
                <span style="background:${color};color:white;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:500;">
                  ${getStatusText(s.status)}
                </span>
              </div>
              ${s.surfaceM2 ? `
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;color:#374151;">📐 Surface:</span>
                <span style="color:#1f2937;font-size:13px;">${s.surfaceM2} m²</span>
              </div>
              ` : ''}
              ${s.budget ? `
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;color:#374151;">💰 Budget:</span>
                <span style="color:#1f2937;font-size:13px;">${s.budget.toLocaleString('fr-FR')} Ar</span>
              </div>
              ` : ''}
              ${s.userEmail ? `
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;color:#374151;">👤 Utilisateur:</span>
                <span style="color:#1f2937;font-size:13px;">${s.userEmail}</span>
              </div>
              ` : ''}
              ${s.photoUrl ? `
              <div style="margin-top:8px;">
                <a href="${s.photoUrl}" target="_blank" 
                   style="display:inline-block;background:#3b82f6;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:500;">
                  📷 Voir les photos
                </a>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      
      L.marker([s.latitude, s.longitude], { icon })
        .addTo(map)
        .bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          offset: [0, -10]
        })
        .bindPopup(popupContent);
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
