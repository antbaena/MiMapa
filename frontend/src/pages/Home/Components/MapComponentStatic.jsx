import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configuración de los iconos predeterminados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

// Componente auxiliar para ajustar el mapa a los marcadores
function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(([lat, lon]) => [lat, lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

export default function MapComponentStatic({ markers = [] }) {
  if (markers.length === 0) {
    return <p>No hay marcadores para mostrar</p>;
  }

  return (
    <MapContainer
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Ajustar mapa a los marcadores */}
      <FitBounds markers={markers} />
      {/* Renderizar los marcadores */}
      {markers.map(([lat, lon, imageURI, lugar], index) => (
        <Marker key={index} position={[lat, lon]}>
          <Popup>
            <p>{lugar}</p>
            <img
              src={imageURI}
              alt={`Imagen ${index + 1}`}
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
