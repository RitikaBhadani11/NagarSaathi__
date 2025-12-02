import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ FIX: Import leaflet images properly for ES modules
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix for leaflet icons - ES Module version
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker
const createMarkerIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3B82F6;
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const defaultCenter = [17.385044, 78.486671]; // Default: Chennai
  const [position, setPosition] = useState(defaultCenter);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  
  // Set initial position
  useEffect(() => {
    if (initialLocation?.coordinates) {
      const { lat, lng } = initialLocation.coordinates;
      setPosition([lat, lng]);
      if (initialLocation.address) {
        setAddress(initialLocation.address);
      }
    }
  }, [initialLocation]);

  // Get address from coordinates
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
      );
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    } catch {
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  };

  // Handle map click
  const handleMapClick = async (e) => {
    const newPos = [e.latlng.lat, e.latlng.lng];
    setPosition(newPos);
    const addr = await fetchAddress(newPos[0], newPos[1]);
    setAddress(addr);
    
    onLocationSelect({
      coordinates: { lat: newPos[0], lng: newPos[1] },
      address: addr
    });
  };

  // Search locations
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Select search result
  const handleResultClick = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPos = [lat, lng];
    
    setPosition(newPos);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    
    const addr = await fetchAddress(lat, lng);
    setAddress(addr);
    
    onLocationSelect({
      coordinates: { lat, lng },
      address: addr
    });
    
    if (mapRef.current) {
      mapRef.current.setView(newPos, 16);
    }
  };

  // Use GPS
  const handleUseGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          const addr = await fetchAddress(newPos[0], newPos[1]);
          setAddress(addr);
          
          onLocationSelect({
            coordinates: { lat: newPos[0], lng: newPos[1] },
            address: addr
          });
          
          if (mapRef.current) {
            mapRef.current.setView(newPos, 16);
          }
        },
        (error) => {
          alert("GPS Error: " + error.message);
        }
      );
    } else {
      alert("GPS not supported");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location (street, city, landmark)..."
            className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "..." : "🔍"}
          </button>
          <button
            type="button"
            onClick={handleUseGPS}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            title="Use my current location"
          >
            📍
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                onClick={() => handleResultClick(result)}
                className="p-3 border-b hover:bg-blue-50 cursor-pointer last:border-b-0"
              >
                <div className="font-medium">{result.display_name}</div>
                <div className="text-xs text-gray-500">
                  {result.type} • Lat: {result.lat}, Lng: {result.lon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-72 rounded-xl overflow-hidden border shadow">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position} icon={createMarkerIcon()}>
            <Popup>Selected Location</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="text-blue-700 mr-2">📍</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-blue-800">Selected Location:</div>
            <div className="text-blue-900 mt-1">{address || "Click on map to select"}</div>
            <div className="text-xs text-blue-600 mt-2">
              Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        💡 <strong>Tip:</strong> Click on map, search, or use GPS to select location
      </div>
    </div>
  );
};

export default LocationPicker;