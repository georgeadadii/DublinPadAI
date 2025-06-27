'use client';

import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  accommodationAddress?: string;
}

export function Map({ center, zoom = 15, accommodationAddress }: MapProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API key is missing.");
    return <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">Map cannot be loaded. API key is missing.</div>;
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <MapContent center={center} zoom={zoom} accommodationAddress={accommodationAddress} />
    </APIProvider>
  );
}

interface MapContentProps extends MapProps {}

function MapContent({ center, zoom = 15, accommodationAddress }: MapContentProps) {
  const map = useMap();
  const [accommodationLocation, setAccommodationLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  useEffect(() => {
    if (accommodationAddress && map) {
      setIsLoadingGeocode(true);
      setGeocodeError(null);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: accommodationAddress }, (results, status) => {
        setIsLoadingGeocode(false);
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setAccommodationLocation(location);
          map.moveCamera({ center: location, zoom: 15 });
        } else {
          console.error(`Geocode was not successful for the following reason: ${status}`);
          setGeocodeError(`Could not find location for address: ${accommodationAddress}. Status: ${status}`);
          setAccommodationLocation(null);
          map.moveCamera({ center: center, zoom: zoom });
        }
      });
    } else {
      setAccommodationLocation(null);
      if (map) {
        map.moveCamera({ center: center, zoom: zoom });
      }
    }
  }, [accommodationAddress, map, center, zoom]);

  const markerPosition = accommodationLocation || center;

  if (isLoadingGeocode) {
    return <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading accommodation location...
    </div>;
  }

  if (geocodeError) {
    return <div className="flex items-center justify-center h-full bg-muted text-destructive-foreground">{geocodeError}</div>;
  }

  return (
    <GoogleMap
      mapId="dublin-map"
      style={{ width: '100%', height: '100%' }}
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      <AdvancedMarker position={markerPosition} />
    </GoogleMap>
  );
}
