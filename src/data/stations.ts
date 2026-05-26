export type StationStatus = "ok" | "alerta" | "critico";

export type Station = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: StationStatus;
  zoneInfluence: {
    type: "circle";
    radiusKm: number;
    notes: string;
  };
};

export const stations: Station[] = [
  {
    "id": "3016943",
    "name": "MULTISERVIS CRIMASA S.A.C.",
    "address": "Italpampa Quinta Sofia S/N (Pasar C. Recreacional)",
    "lat": -13.46847488,
    "lng": -72.15366485,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "1011481",
    "name": "ESTACION DE SERVICIOS ALFREDO S.A.C.",
    "address": "Av. Vilcanota 1059",
    "lat": -13.325651,
    "lng": -71.952704,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "3001270",
    "name": "GRIFO SAN MARTIN S.A.C.",
    "address": "Av. de la Cultura N° 1620",
    "lat": -13.325677,
    "lng": -71.952496,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "3010160",
    "name": "INVERSIONES EN HIDROCARBUROS JCE E.I.R.L.",
    "address": "Vía Expresa S/N Urb. Los Manantiales",
    "lat": -13.53661,
    "lng": -71.92006,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "1003212",
    "name": "PETROCENTRO GUEVARA E.I.R.L.",
    "address": "Av. Mariscal Castilla S/N",
    "lat": -13.30938,
    "lng": -72.11452,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "1003211",
    "name": "PETROCENTRO URUBAMBA S.A.C.",
    "address": "Carretera Cusco–Abancay Km 13.5",
    "lat": -13.311069,
    "lng": -72.107895,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "1002770",
    "name": "SERVICENTRO AMERICANO S.R.L.",
    "address": "Av. la Cultura N° 201",
    "lat": -13.52171,
    "lng": -71.96524,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "1011090",
    "name": "SERVICENTRO ARAGON S.R.L.",
    "address": "Prolongación Av. Amazonas S/N, Sector Erapampa",
    "lat": -13.42097,
    "lng": -71.8599,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "3010049",
    "name": "SERVICENTRO UNION J & R S.R.L.",
    "address": "Carretera Cusco–Urcos S/N, Sector Rosendal de San José",
    "lat": -13.596911,
    "lng": -71.776822,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "1011022",
    "name": "SERVIMAS GRIFO E.I.R.LTDA",
    "address": "Prolongación Av. de la Cultura 2338 - Cusco",
    "lat": -13.5409903,
    "lng": -71.93368963,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "1012640",
    "name": "BIOCOM S.A.C.",
    "address": "Av. Tomás Tuyrutupa N° 403",
    "lat": -13.545351,
    "lng": -71.894082,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  },
  {
    "id": "3016704",
    "name": "BIO SERVICIOS PERUANOS S.A.C. (ex BIOCOM)",
    "address": "Prolongación Av. de la Cultura Km 6.0",
    "lat": -13.545005,
    "lng": -71.894085,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 5, "notes": "" }
  },
  {
    "id": "3001273",
    "name": "SERVICENTRO LOS SAUCES S.A.C.",
    "address": "Urb. Parque Industrial N° H1-2",
    "lat": -13.53393,
    "lng": -71.94232,
    "status": "ok",
    "zoneInfluence": { "type": "circle", "radiusKm": 3, "notes": "" }
  }
];
