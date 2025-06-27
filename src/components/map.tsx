'use client';

import { APIProvider, Map as GoogleMap, Marker, AdvancedMarker } from '@vis.gl/react-google-maps';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

export function Map({ center, zoom = 15 }: MapProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API key is missing.");
    return <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">Map cannot be loaded. API key is missing.</div>;
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapId="dublinpad-ai-map"
        style={{ width: '100%', height: '100%' }}
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <AdvancedMarker position={center} />
      </GoogleMap>
    </APIProvider>
  );
}
