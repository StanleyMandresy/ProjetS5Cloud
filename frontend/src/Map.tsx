import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  useEffect(() => {
    // Initialiser la carte
    const map = L.map("map").setView([-18.8792, 47.5079], 13);

    // Ajouter les tuiles raster depuis ton Tileserver
    L.tileLayer("http://localhost:8000/styles/klokantech-basic/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 20,
    }).addTo(map);

    // Ajouter un marqueur test
    L.marker([-18.8792, 47.5079])
      .addTo(map)
      .bindPopup("Centre d’Antananarivo")
      .openPopup();

    // Nettoyer la carte lors du démontage du composant
    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
};

export default Map;
