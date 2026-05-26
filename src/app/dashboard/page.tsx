"use client";

import { stations } from "@/data/stations";
import { useAppStore } from "@/store/useAppStore";
import {
  countByStatus,
  fmtLts,
  getCompliancePct,
  getContractStatus,
  getDaysToExpiry,
  getExpectedPacePct,
  getStatusColors,
  getStatusLabel,
} from "@/lib/stationUtils";
import type { Station } from "@/types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const counts = countByStatus(stations);

const kpis = [
  {
    label: "Total Estaciones",
    value: stations.length,
    sub: "en la red Cusco",
    color: "text-gray-900",
    bg: "bg-white",
    border: "border-gray-200",
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    label: "Contratos Vigentes",
    value: counts.vigente,
    sub: `${Math.round((counts.vigente / stations.length) * 100)}% de la flota`,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Por Vencer",
    value: counts.por_vencer,
    sub: "vencen en menos de 90 días",
    color: counts.por_vencer > 0 ? "text-amber-700" : "text-gray-400",
    bg: counts.por_vencer > 0 ? "bg-amber-50" : "bg-gray-50",
    border: counts.por_vencer > 0 ? "border-amber-200" : "border-gray-200",
    icon: (
      <svg className={`w-6 h-6 ${counts.por_vencer > 0 ? "text-amber-500" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Contratos Vencidos",
    value: counts.vencido,
    sub: "requieren renovación urgente",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    label: "Sin Contrato",
    value: counts.sin_contrato,
    sub: "sin información contractual",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
];

// Estaciones con alerta (vencidas + sin contrato), ordenadas por urgencia
const alertStations = stations
  .filter((s) => {
    const st = getContractStatus(s);
    return st === "vencido" || st === "sin_contrato";
  })
  .sort((a, b) => {
    const dA = a.contract ? getDaysToExpiry(a.contract.endsAt) : -Infinity;
    const dB = b.contract ? getDaysToExpiry(b.contract.endsAt) : -Infinity;
    return dA - dB; // más vencido primero
  });

// Tabla completa de estaciones ordenada por status
const statusOrder: Record<string, number> = { vencido: 0, sin_contrato: 1, por_vencer: 2, vigente: 3 };
const tableStations = [...stations].sort(
  (a, b) => statusOrder[getContractStatus(a)] - statusOrder[getContractStatus(b)]
);

function fmtDateShort(iso: string) {
  return format(parseISO(iso), "MMM yyyy", { locale: es });
}

export default function DashboardPage() {
  const setSelectedStation = useAppStore((s) => s.setSelectedStation);

  return (
    <div className="p-6 space-y-6 max-w-[1300px]">
      {/* KPI Grid */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border p-4 ${kpi.bg} ${kpi.border}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{kpi.label}</p>
                <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{kpi.sub}</p>
              </div>
              <div className="mt-0.5">{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Alertas — columna izquierda angosta */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Alertas — Acción Requerida
            <span className="ml-auto text-xs font-normal text-gray-400">{alertStations.length} estaciones</span>
          </h2>
          <div className="space-y-2">
            {alertStations.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin alertas activas</p>
            )}
            {alertStations.map((s) => (
              <AlertRow key={s.id} station={s} onClick={() => setSelectedStation(s)} />
            ))}
          </div>
        </div>

        {/* Tabla completa — columna derecha */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Estado Contractual · Todas las Estaciones</h2>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-medium">Estación</th>
                  <th className="text-left px-3 py-2.5 font-medium">Distrito</th>
                  <th className="text-left px-3 py-2.5 font-medium">Estado</th>
                  <th className="text-left px-3 py-2.5 font-medium">Vencimiento</th>
                  <th className="text-left px-3 py-2.5 font-medium">Avance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tableStations.map((s) => (
                  <StationRow key={s.id} station={s} onClick={() => setSelectedStation(s)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ station, onClick }: { station: Station; onClick: () => void }) {
  const status = getContractStatus(station);
  const colors = getStatusColors(status);

  let detail = "Sin contrato en sistema";
  if (station.contract) {
    const days = getDaysToExpiry(station.contract.endsAt);
    detail = days < 0
      ? `Vencido hace ${Math.abs(days)} días`
      : `Vence en ${days} días`;
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left hover:shadow-sm transition-all ${colors.bg} ${colors.border}`}
    >
      <span className={`shrink-0 w-2 h-2 rounded-full ${status === "vencido" ? "bg-red-500" : "bg-gray-400"}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{station.name}</div>
        <div className={`text-xs ${colors.text}`}>{detail}</div>
      </div>
      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}

function StationRow({ station, onClick }: { station: Station; onClick: () => void }) {
  const status = getContractStatus(station);
  const colors = getStatusColors(status);
  const label = getStatusLabel(status);

  const hasPct =
    station.contract?.targetVolumeLts &&
    station.contract?.accumulatedVolumeLts !== null;

  const pct = hasPct
    ? getCompliancePct(station.contract!.accumulatedVolumeLts!, station.contract!.targetVolumeLts!)
    : null;

  const expectedPct = station.contract
    ? getExpectedPacePct(station.contract.startsAt, station.contract.endsAt)
    : null;

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-2.5">
        <div className="font-medium text-gray-800 text-xs leading-snug max-w-[180px]">{station.name}</div>
      </td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-500">{station.district}</span>
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {label}
        </span>
      </td>
      <td className="px-3 py-2.5">
        {station.contract ? (
          <span className="text-xs text-gray-600">{fmtDateShort(station.contract.endsAt)}</span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      <td className="px-3 py-2.5 min-w-[120px]">
        {pct !== null && expectedPct !== null ? (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-700">{pct}%</span>
              <span className="text-gray-400">/{expectedPct}% esp.</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 relative">
              <div
                className={`h-1.5 rounded-full ${pct >= expectedPct - 5 ? "bg-green-400" : pct >= expectedPct - 20 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {station.contract?.targetVolumeLts && station.contract?.accumulatedVolumeLts !== null && (
              <div className="text-xs text-gray-400">
                {fmtLts(station.contract.accumulatedVolumeLts!)} / {fmtLts(station.contract.targetVolumeLts)}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
    </tr>
  );
}
