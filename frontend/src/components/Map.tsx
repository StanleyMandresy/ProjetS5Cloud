import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTravaux } from "../context/TravauxContext";

const Map = () => {
  const { travaux, loading } = useTravaux();

  // Fonction pour obtenir la couleur selon le statut
  const getColorByStatus = (statut: string): string => {
    switch (statut) {
      case 'NOUVEAU':
        return '#ef4444'; // Rouge
      case 'EN_COURS':
        return '#f59e0b'; // Orange
      case 'TERMINE':
        return '#22c55e'; // Vert
      default:
        return '#6b7280'; // Gris
    }
  };

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (statut: string): string => {
    switch (statut) {
      case 'NOUVEAU':
        return 'Nouveau';
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINE':
        return 'Terminé';
      default:
        return statut;
    }
  };

  useEffect(() => {
    if (loading) return;

    const map = L.map("map").setView([-18.8792, 47.5079], 13);

    // Utilisation d'OpenStreetMap standard
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Créer des icônes personnalisées pour chaque statut
    const createCustomIcon = (color: string) => {
      return L.divIcon({
        className: 'custom-marker',
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
        popupAnchor: [0, -15]
      });
    };

    travaux.forEach((t) => {
      if (!t.latitude || !t.longitude) return;
      
      const color = getColorByStatus(t.statut);
      const icon = createCustomIcon(color);
      
      // Formater les informations pour le popup
      const dateSignalement = t.dateSignalement 
        ? new Date(t.dateSignalement).toLocaleDateString('fr-FR')
        : 'N/A';
      
      const budget = t.budget 
        ? `${parseFloat(t.budget).toLocaleString('fr-FR')} Ar`
        : 'N/A';
      
      const surface = t.surfaceM2 
        ? `${t.surfaceM2} m²`
        : 'N/A';
      
      const entreprise = t.entrepriseNom || 'Non assignée';
      
      L.marker([t.latitude, t.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              ${t.titre}
            </h3>
            <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 13px;">
              ${t.description || 'Pas de description'}
            </p>
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #374151;">Statut:</span>
                <span style="
                  background: ${color}; 
                  color: white; 
                  padding: 2px 8px; 
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                ">${getStatusText(t.statut)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #374151;">Date:</span>
                <span style="color: #6b7280;">${dateSignalement}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #374151;">Surface:</span>
                <span style="color: #6b7280;">${surface}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #374151;">Budget:</span>
                <span style="color: #6b7280;">${budget}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #374151;">Entreprise:</span>
                <span style="color: #6b7280; font-size: 12px;">${entreprise}</span>
              </div>
            </div>
          </div>
        `);
    });

    // Ajouter une légende
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.cssText = `
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      
      div.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Légende</h4>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></div>
          <span style="font-size: 13px;">Nouveau</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></div>
          <span style="font-size: 13px;">En cours</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; margin-right: 8px;"></div>
          <span style="font-size: 13px;">Terminé</span>
        </div>
      `;
      
      return div;
    };
    
    legend.addTo(map);

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
