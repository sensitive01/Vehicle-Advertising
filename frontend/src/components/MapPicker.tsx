'use client';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { IconButton, Box, CircularProgress, Tooltip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Fix for default marker icon issues in Leaflet with React
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return lat && lng ? (
    <Marker position={[lat, lng]} icon={icon} />
  ) : null;
}

export default function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const center: [number, number] = lat && lng ? [lat, lng] : [12.9716, 77.5946]; 
  const [locating, setLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      (error) => {
        console.error('Error finding location:', error);
        alert('Could not find your location. Please check your browser permissions.');
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer 
        key={`${lat}-${lng}`}
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: '8px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker lat={lat} lng={lng} onLocationSelect={onLocationSelect} />
      </MapContainer>

      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <Tooltip title="Use Current Location">
          <IconButton 
            onClick={handleLocateMe}
            disabled={locating}
            sx={{ 
              bgcolor: '#FACC15', 
              color: 'black', 
              '&:hover': { bgcolor: '#EAB308' },
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              width: 44,
              height: 44
            }}
          >
            {locating ? <CircularProgress size={24} color="inherit" /> : <MyLocationIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
