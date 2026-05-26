"use client";

import React, { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF, CircleF, InfoWindowF } from "@react-google-maps/api";
import type { Station } from "@/data/stations";

type Props = { stations: Station[] };

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "80vh",
  borderRadius: 16,
};

export default function StationsMap({ stations }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey ?? "",
  });

  const [selected, setSelected] = useState<Station | null>(null);

  const center = useMemo(() => {
    const lat = stations.reduce((a, s) => a + s.lat, 0) / stations.length;
    const lng = stations.reduce((a, s) => a + s.lng, 0) / stations.length;
    return { lat, lng };
  }, [stations]);

  if (!apiKey) {
    return (
      <div style={{ padding: 16 }}>
        Falta <b>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</b> en <code>.env.local</code>.
        <br />
        Luego reinicia el servidor (Ctrl + C y <code>npm run dev</code>).
      </div>
    );
  }

  if (loadError) return <div style={{ padding: 16 }}>Error cargando Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div style={{ padding: 16 }}>Cargando mapa…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Mapa de Estaciones - Cusco</h1>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11} options={{ fullscreenControl: false }}>
        {stations.map((s) => (
          <React.Fragment key={s.id}>
            <MarkerF position={{ lat: s.lat, lng: s.lng }} title={s.name} onClick={() => setSelected(s)} />

            <CircleF
              center={{ lat: s.lat, lng: s.lng }}
              radius={s.zoneInfluence.radiusKm * 1000}
              options={{ strokeOpacity: 0.6, strokeWeight: 1, fillOpacity: 0.08 }}
            />
          </React.Fragment>
        ))}

        {selected && (
          <InfoWindowF position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
            <div style={{ maxWidth: 260 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>{selected.address}</div>
              <div style={{ fontSize: 12 }}>
                <b>ID:</b> {selected.id}
              </div>
              <div style={{ fontSize: 12 }}>
                <b>Zona:</b> {selected.zoneInfluence.radiusKm} km
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer">
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
