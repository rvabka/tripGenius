import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { TripPlan } from '@/app/trip-results/page';

export default function Map({ trip }: { trip: TripPlan[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const defaultCenter = { lng: 1.675063, lat: 47.751569 };
  const defaultZoom = 2;

  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: defaultZoom
    });

    map.current.on('load', () => {
      if (trip && trip.length > 0) {
        trip.forEach(tripItem => {
          if (tripItem.longitude && tripItem.latitude) {
            const lng = tripItem.longitude;
            const lat = tripItem.latitude;

            if (!isNaN(lng) && !isNaN(lat)) {
              new maptilersdk.Marker({
                color: '#FF0000'
              })
                .setLngLat([lng, lat])
                .addTo(map.current!);
            }
          }
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [trip, defaultCenter, defaultZoom]);

  return (
    <div className="w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
