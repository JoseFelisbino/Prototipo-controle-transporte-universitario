import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon assets reference issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// View controller to transition map view based on stops
const ChangeMapView: React.FC<{ coords: [number, number][]; center: [number, number] }> = ({ coords, center }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 13);
    }
  }, [coords, center, map]);
  return null;
};

export interface MapPoint {
  id: string;
  nome: string;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
}

interface OrleansMapProps {
  points?: MapPoint[];
  activePointId?: string;
  onPointClick?: (point: MapPoint) => void;
}

export const OrleansMap: React.FC<OrleansMapProps> = ({ points = [], activePointId, onPointClick }) => {
  const defaultCenter: [number, number] = [-28.3589, -49.2894]; // Orleans center coordinates

  // Filter out any points missing latitude/longitude
  const validPoints = points.filter(p => p.latitude !== null && p.longitude !== null) as (MapPoint & { latitude: number; longitude: number })[];

  // Polyline points coordinates
  const routeCoordinates = validPoints.map(p => [p.latitude, p.longitude] as [number, number]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-zinc-800/60 relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-leaflet-tiles"
        />

        {validPoints.map(point => {
          const isActive = point.id === activePointId;
          
          // Custom HTML marker styled with Tailwind CSS
          const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all duration-300 ${
              isActive ? 'bg-violet-500 scale-125 ring-4 ring-violet-500/35' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110'
            }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          return (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onPointClick && onPointClick(point),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-sm text-zinc-900">{point.nome}</h4>
                  <p className="text-xs text-zinc-600 mt-1">{point.endereco}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#6366f1"
            weight={4}
            opacity={0.85}
            dashArray="8, 8"
          />
        )}

        <ChangeMapView coords={routeCoordinates} center={defaultCenter} />
      </MapContainer>
    </div>
  );
};
