import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../../types';

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
    onLocationSelect: (location: Location) => void;
    initialPosition?: [number, number] | null;
}

const MapPicker = ({ onLocationSelect, initialPosition = null }: MapPickerProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const defaultCenter: [number, number] = initialPosition || [-6.8714, 109.1402]; // Tegal, Jawa Tengah
        const map = L.map(mapRef.current).setView(defaultCenter, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;

        // Get user's current location
        if (!initialPosition && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation: [number, number] = [latitude, longitude];
                    map.setView(userLocation, 15);
                    addMarker(userLocation);
                    setLoading(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Use default location if geolocation fails
                    addMarker(defaultCenter);
                    setLoading(false);
                }
            );
        } else {
            addMarker(defaultCenter);
            setLoading(false);
        }

        // Add click event to map
        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            addMarker([lat, lng]);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initialPosition]);

    const addMarker = (position: [number, number]) => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Remove existing marker
        if (markerRef.current) {
            map.removeLayer(markerRef.current);
        }

        // Add new marker
        const marker = L.marker(position, {
            draggable: true,
        }).addTo(map);

        markerRef.current = marker;

        // Update parent component
        const [lat, lng] = position;
        onLocationSelect({ latitude: lat, longitude: lng });

        // Reverse geocoding (optional - can be skipped for Phase 4)
        reverseGeocode(lat, lng);

        // Handle marker drag
        marker.on('dragend', () => {
            const newPos = marker.getLatLng();
            onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
            reverseGeocode(newPos.lat, newPos.lng);
        });
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            setAddress(data.display_name || 'Alamat tidak ditemukan');
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            setAddress('Gagal mengambil alamat');
        }
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <div
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border-2 border-gray-300 relative z-0"
                />
                {loading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Memuat peta...</p>
                        </div>
                    </div>
                )}
            </div>
            {address && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                        <span className="font-medium">📍 Lokasi:</span> {address}
                    </p>
                </div>
            )}
            <p className="text-xs text-gray-500">
                💡 Klik pada peta atau drag marker untuk memilih lokasi yang tepat
            </p>
        </div>
    );
};

export default MapPicker;
