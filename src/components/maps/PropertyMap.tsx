import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
    location: { lat: number; lng: number };
    zoom?: number;
    className?: string;
}

export function PropertyMap({ location, zoom = 13, className = "h-[300px] w-full rounded-lg" }: PropertyMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map if not already initialized
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([location.lat, location.lng], zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);

            // Add custom marker
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });

            L.marker([location.lat, location.lng], { icon: customIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup("<b>Property Location</b><br>Exact location provided upon booking.")
                .openPopup();
        } else {
            // Update view if location changes
            mapInstanceRef.current.setView([location.lat, location.lng], zoom);
        }

        return () => {
            // Cleanup map instance on unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location, zoom]);

    return <div ref={mapRef} className={className} />;
}
