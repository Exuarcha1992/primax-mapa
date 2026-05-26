"use client";

import { useAppStore } from "@/store/useAppStore";
import {
  getCompliancePct,
  getContractStatus,
  getDaysToExpiry,
  getExpectedPacePct,
  getStatusColors,
  getStatusLabel,
  fmtLts,
} from "@/lib/stationUtils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function fmtDate(iso: string) {
  return format(parseISO(iso), "d MMM yyyy", { locale: es });
}

export default function StationDrawer() {
  const { selectedStation: s, drawerOpen, closeDrawer } = useAppStore();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {s && (
          <>
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">ID {s.id}</p>
                  <h2 className="font-bold text-gray-900 text-[15px] leading-snug">{s.name}</h2>
                  {s.siteName !== s.name && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{s.siteName}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {s.address}
                  </p>
                  <p className="text-xs text-gray-400">{s.district} · {s.city}</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StatusBadge station={s} />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {s.contract ? (
                <>
                  {/* Datos del contrato */}
                  <Section title="Contrato">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <InfoRow label="Firma" value={fmtDate(s.contract.signedAt)} />
                      <InfoRow label="Duración" value={`${s.contract.durationYears} años`} />
                      <InfoRow label="Inicio" value={fmtDate(s.contract.startsAt)} />
                      <InfoRow label="Vencimiento" value={fmtDate(s.contract.endsAt)} />
                    </div>
                  </Section>

                  {/* Avance contractual */}
                  {s.contract.targetVolumeLts !== null && (
                    <Section title="Avance de Volumen Contractual">
                      <ContractProgress contract={s.contract} />
                    </Section>
                  )}

                  {s.contract.targetVolumeLts === null && (
                    <div className="text-sm text-gray-400 italic bg-gray-50 rounded-lg px-4 py-3">
                      Sin meta de volumen definida en este contrato.
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
                  <p className="text-sm font-medium text-amber-800">Sin contrato registrado</p>
                  <p className="text-xs text-amber-600 mt-1">
                    No se encontró información contractual para esta estación. Se requiere verificación en el sistema.
                  </p>
                </div>
              )}

              {/* Zona de influencia */}
              <Section title="Zona de Influencia">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Radio: {s.influenceRadiusKm} km</p>
                    <p className="text-xs text-gray-400">Área de cobertura estimada</p>
                  </div>
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
              <a
                href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ver en Google Maps
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}

function StatusBadge({ station }: { station: import("@/types").Station }) {
  const status = getContractStatus(station);
  const colors = getStatusColors(status);
  const label = getStatusLabel(status);

  let extra = "";
  if (station.contract) {
    const days = getDaysToExpiry(station.contract.endsAt);
    if (days < 0) extra = ` · vencido hace ${Math.abs(days)} días`;
    else if (days <= 90) extra = ` · vence en ${days} días`;
    else extra = ` · vence ${fmtDate(station.contract.endsAt)}`;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}{extra}
    </span>
  );
}

function ContractProgress({ contract }: { contract: import("@/types").Contract }) {
  const target = contract.targetVolumeLts!;
  const accumulated = contract.accumulatedVolumeLts ?? 0;
  const actualPct = getCompliancePct(accumulated, target);
  const expectedPct = getExpectedPacePct(contract.startsAt, contract.endsAt);

  const barColor =
    actualPct >= expectedPct - 5
      ? "bg-green-500"
      : actualPct >= expectedPct - 20
      ? "bg-amber-400"
      : "bg-red-500";

  const hasAccumulated = contract.accumulatedVolumeLts !== null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2.5">
          <div className="text-xs text-gray-400 mb-0.5">Meta total</div>
          <div className="text-sm font-semibold text-gray-800">{fmtLts(target)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2.5">
          <div className="text-xs text-gray-400 mb-0.5">Acumulado</div>
          <div className="text-sm font-semibold text-gray-800">
            {hasAccumulated ? fmtLts(accumulated) : "—"}
          </div>
        </div>
      </div>

      {hasAccumulated && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Avance real: <strong className="text-gray-800">{actualPct}%</strong></span>
            <span>Ritmo esperado: <strong className="text-gray-800">{expectedPct}%</strong></span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 relative">
            <div
              className={`h-3 rounded-full transition-all ${barColor}`}
              style={{ width: `${actualPct}%` }}
            />
            {/* Línea de ritmo esperado */}
            <div
              className="absolute top-0 h-3 w-0.5 bg-gray-500 rounded"
              style={{ left: `${Math.min(expectedPct, 99)}%` }}
              title={`Ritmo esperado: ${expectedPct}%`}
            />
          </div>
          <p className="text-xs text-gray-400">
            {actualPct >= expectedPct
              ? "✓ Por encima del ritmo contractual"
              : `${(expectedPct - actualPct).toFixed(1)} pp por debajo del ritmo esperado`}
          </p>
        </div>
      )}

      {!hasAccumulated && (
        <p className="text-xs text-gray-400 italic">Avance acumulado no disponible.</p>
      )}
    </div>
  );
}
