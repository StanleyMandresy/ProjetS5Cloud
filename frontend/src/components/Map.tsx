import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([-18.8792, 47.5079], 13);

    L.tileLayer("http://localhost:8000/styles/osm-bright/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 20,
    }).addTo(map);

    L.marker([-18.8792, 47.5079])
      .addTo(map)
      .bindPopup("Centre d’Antananarivo");

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      className="w-full h-full rounded-3xl"
    />
  );
};

export default Map;
