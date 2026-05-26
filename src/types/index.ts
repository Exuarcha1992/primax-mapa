export type ContractStatus = "vigente" | "por_vencer" | "vencido" | "sin_contrato";

export type Contract = {
  signedAt: string;
  startsAt: string;
  endsAt: string;
  durationYears: number;
  targetVolumeLts: number | null;
  accumulatedVolumeLts: number | null;
};

export type Station = {
  id: string;
  name: string;
  siteName: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  influenceRadiusKm: number;
  contract: Contract | null;
};
