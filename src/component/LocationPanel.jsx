import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { X } from "lucide-react";
import RotateLock from "./RotateLock";
import "leaflet/dist/leaflet.css";
import Archismlogo from "./Archismlogo";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [center] = useState([22.8307, 75.7879]);
  const [places, setPlaces] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const apiKey =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjIzYzFjMjA1ZTFiNzQxZDY5Yzk0OWI0MDI4M2Y1YmY4IiwiaCI6Im11cm11cjY0In0=";

  const categories = [
    { label: "Mall", query: "mall", color: "bg-green-300" },
    { label: "Hospital", query: "hospital", color: "bg-purple-500" },
    { label: "Education", query: "school", color: "bg-blue-800" },
    { label: "Restaurants", query: "restaurant", color: "bg-orange-300" },
    { label: "Hotel", query: "hotel", color: "bg-cyan-400" },
    { label: "Club", query: "club", color: "bg-green-500" },
    { label: "Sport", query: "sports", color: "bg-gray-500" },
    { label: "Public Transport", query: "bus station", color: "bg-pink-400" },
  ];

  const fetchDistanceTime = async (start, end) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
    const body = {
      coordinates: [
        [start[1], start[0]],
        [end[1], end[0]],
      ],
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      });

      const summary = response.data.features[0].properties.summary;
      const geometry = response.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      return {
        distance: (summary.distance / 1000).toFixed(2),
        duration: (summary.duration / 60).toFixed(1),
        routeCoords: geometry,
      };
    } catch (err) {
      console.error("ORS API error:", err.response?.data || err.message);
      return { distance: "-", duration: "-", routeCoords: [] };
    }
  };

  const fetchPlaces = async (query) => {
    setSelectedCategory(query);
    try {
      const [lat, lon] = center;
      const viewbox = [lon - 0.15, lat + 0.15, lon + 0.15, lat - 0.15].join(
        ","
      );

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&bounded=1&viewbox=${viewbox}`
      );

      const results = await Promise.all(
        response.data.map(async (place) => {
          const coords = [parseFloat(place.lat), parseFloat(place.lon)];
          const info = await fetchDistanceTime(center, coords);
          return { ...place, ...info };
        })
      );

      setPlaces(results);
      setSelectedRoute(null);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleMarkerClick = async (place) => {
    const { distance, duration, routeCoords } = await fetchDistanceTime(
      center,
      [place.lat, place.lon]
    );

    setSelectedPlace({
      name: place.display_name.split(",")[0],
      address: place.display_name,
      category: place.category || place.class || "Unknown",
      type: place.type || "Unknown",
      distance,
      duration,
    });

    setSelectedRoute(routeCoords);
  };

  return (
    <RotateLock>
      {/* 📱 Fallback overlay for portrait mode on small screens */}
      <div className="sm:hidden block fixed top-0 left-0 w-full h-full z-50 bg-black/90 text-white flex items-center justify-center text-center p-6">
        <div>
          <p className="text-lg font-semibold mb-2">Rotate your device</p>
          <p className="text-sm text-white/70">
            This experience works best in landscape mode. Please rotate your phone.
          </p>
        </div>
      </div>

      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={center}
            zoom={12}
            zoomControl={false}
            className="custom-map-container"
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ZoomControl position="bottomright" />

            <Marker position={center}>
              <Popup>📍 Your Selected Location</Popup>
            </Marker>

            {places.map((place, i) => (
              <Marker
                key={i}
                position={[parseFloat(place.lat), parseFloat(place.lon)]}
                eventHandlers={{
                  click: () => handleMarkerClick(place),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{place.display_name.split(",")[0]}</strong>
                    <br />
                    📏 {place.distance} km
                    <br />
                    ⏱️ {place.duration} mins
                  </div>
                </Popup>
              </Marker>
            ))}

            {selectedRoute && (
              <Polyline
                positions={selectedRoute}
                pathOptions={{ color: "blue", weight: 4 }}
              />
            )}
          </MapContainer>
        </div>

        {/* 📍 Location Panel */}
        {isOpen && (
        <div className="location-scroll-panel fixed right-2 top-16 sm:top-5 w-[90%] sm:w-[300px] md:w-[280px] landscape:w-[220px] max-h-[calc(100vh-120px)] bg-black/30 text-white p-4 landscape:p-2 rounded-xl backdrop-blur-sm z-30 shadow-lg overflow-y-auto space-y-3">



            <div className="flex justify-between items-center mb-1">
              <div className="text-base font-medium">Location</div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="bg-black/40 rounded-lg p-2 backdrop-blur-sm space-y-2 w-full">
              <div className="bg-white/10 rounded-lg p-2 space-y-1 w-full">
                {categories.map((cat, index) => (
                  <div key={index}>
                    <div
                      onClick={() => fetchPlaces(cat.query)}
                      className={`flex items-center gap-3 cursor-pointer px-2 py-[6px] rounded-md transition-all ${
                        selectedCategory === cat.query
                          ? "bg-white/20 ring-1 ring-white/20"
                          : "hover:bg-white/10 hover:ring-1 hover:ring-white/20"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${cat.color} ${
                          selectedCategory === cat.query
                            ? "scale-125 shadow-md"
                            : "group-hover:scale-125"
                        } transition`}
                      />
                      <span className="text-xs tracking-wide">{cat.label}</span>
                    </div>
                    {index !== categories.length - 1 && (
                      <hr className="w-full border-white/10 my-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedPlace && (
              <div className="bg-black/40 rounded-xl px-4 py-2 text-xs backdrop-blur-md space-y-2 shadow-md w-full leading-tight">
                <div className="font-semibold text-sm">
                  {selectedPlace.name}
                </div>
                <div className="text-white/60 text-[11px]">
                  Category: {selectedPlace.category}
                </div>
                <div>Type: {selectedPlace.type}</div>
                <div className="border-t border-white/10" />
                <div>
                  <div className="text-white/60 text-[11px]">Address</div>
                  <div>{selectedPlace.address}</div>
                </div>
                <div className="border-t border-white/10" />
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-white/60 text-[11px]">Distance</div>
                    <div>{selectedPlace.distance}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-[11px]">Time</div>
                    <div>{selectedPlace.duration}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Archismlogo/>
      </div>
    </RotateLock>
  );
};

export default LocationPanel;
  