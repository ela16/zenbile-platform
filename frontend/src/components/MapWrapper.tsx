"use client";

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function MapWrapper({ 
  lat = 9.005401, 
  lng = 38.763611, 
  zoom = 13,
  markers = []
}: { 
  lat?: number, 
  lng?: number, 
  zoom?: number,
  markers?: {lat: number, lng: number, icon?: string}[]
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
  });

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 p-6 text-center">
        <div>
          <p className="font-bold text-red-500">Map Failed to Load</p>
          <p className="text-sm mt-2">Please ensure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in .env.local</p>
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          // Simplified map style
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      }}
    >
      {markers.length > 0 ? (
         markers.map((m, i) => (
           <Marker key={i} position={{ lat: m.lat, lng: m.lng }} />
         ))
      ) : (
         <Marker position={center} />
      )}
    </GoogleMap>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
       <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}
