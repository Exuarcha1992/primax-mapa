"use client";

import React, { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF, CircleF } from "@react-google-maps/api";
import type { Station } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { getContractStatus, getStatusColors } from "@/lib/stationUtils";

type Props = { stations: Station[] };

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };

const MAP_OPTIONS: google.maps.MapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControlOptions: { position: 3 },
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  ],
};

function buildPinSvg(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42"><path d="M17 0C7.61 0 0 7.61 0 17c0 9.39 17 25 17 25s17-15.61 17-25C34 7.61 26.39 0 17 0z" fill="${color}" stroke="white" stroke-width="1.5"/><circle cx="17" cy="17" r="7.5" fill="white"/><text x="17" y="21" text-anchor="middle" font-size="9" font-weight="bold" fill="${color}" font-family="sans-serif">P</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getMarkerIcon(station: Station): google.maps.Icon {
  const status = getContractStatus(station);
  const color = getStatusColors(status).pin;
  return {
    url: buildPinSvg(color),
    scaledSize: new google.maps.Size(34, 42),
    anchor: new google.maps.Point(17, 42),
  };
}

export default function StationsMap({ stations }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const setSelectedStation = useAppStore((s) => s.setSelectedStation);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: apiKey ?? "" });

  const center = useMemo(() => {
    const lat = stations.reduce((a, s) => a + s.lat, 0) / stations.length;
    const lng = stations.reduce((a, s) => a + s.lng, 0) / stations.length;
    return { lat, lng };
  }, [stations]);

  if (!apiKey)
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        Falta <code className="mx-1 bg-gray-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en{" "}
        <code className="ml-1 bg-gray-100 px-1 rounded">.env.local</code>
      </div>
    );

  if (loadError)
    return (
      <div className="flex items-center justify-center h-full text-sm text-red-500">
        Error cargando Google Maps: {loadError.message}
      </div>
    );

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        Cargando mapa…
      </div>
    );

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11} options={MAP_OPTIONS}>
      {stations.map((station) => {
        const status = getContractStatus(station);
        const colors = getStatusColors(status);
        return (
          <React.Fragment key={station.id}>
            <MarkerF
              position={{ lat: station.lat, lng: station.lng }}
              title={station.name}
              icon={getMarkerIcon(station)}
              onClick={() => setSelectedStation(station)}
            />
            <CircleF
              center={{ lat: station.lat, lng: station.lng }}
              radius={station.influenceRadiusKm * 1000}
              options={{
                strokeColor: colors.pin,
                strokeOpacity: 0.5,
                strokeWeight: 1.5,
                fillColor: colors.pin,
                fillOpacity: 0.06,
                clickable: false,
              }}
            />
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
}
