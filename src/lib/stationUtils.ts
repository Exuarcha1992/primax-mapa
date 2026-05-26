import { differenceInDays, parseISO } from "date-fns";
import type { ContractStatus, Station } from "@/types";

export function getContractStatus(station: Station): ContractStatus {
  if (!station.contract) return "sin_contrato";
  const days = differenceInDays(parseISO(station.contract.endsAt), new Date());
  if (days < 0) return "vencido";
  if (days <= 90) return "por_vencer";
  return "vigente";
}

export function getDaysToExpiry(endsAt: string): number {
  return differenceInDays(parseISO(endsAt), new Date());
}

// Ritmo esperado: qué % del contrato debería estar ejecutado a hoy
export function getExpectedPacePct(startsAt: string, endsAt: string): number {
  const total = differenceInDays(parseISO(endsAt), parseISO(startsAt));
  const elapsed = differenceInDays(new Date(), parseISO(startsAt));
  if (total <= 0) return 100;
  return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
}

export function getCompliancePct(accumulated: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(Math.round((accumulated / target) * 1000) / 10, 100);
}

export function getStatusColors(status: ContractStatus) {
  const map: Record<ContractStatus, { bg: string; text: string; border: string; pin: string }> = {
    vigente: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", pin: "#16A34A" },
    por_vencer: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", pin: "#D97706" },
    vencido: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", pin: "#DC2626" },
    sin_contrato: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200", pin: "#9CA3AF" },
  };
  return map[status];
}

export function getStatusLabel(status: ContractStatus): string {
  const map: Record<ContractStatus, string> = {
    vigente: "Vigente",
    por_vencer: "Por vencer",
    vencido: "Vencido",
    sin_contrato: "Sin contrato",
  };
  return map[status];
}

export function fmtLts(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("es-PE", { maximumFractionDigits: 2 })} M lts`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString("es-PE", { maximumFractionDigits: 1 })} k lts`;
  return `${n.toLocaleString("es-PE")} lts`;
}

export function countByStatus(stations: Station[]) {
  return stations.reduce(
    (acc, s) => {
      acc[getContractStatus(s)]++;
      return acc;
    },
    { vigente: 0, por_vencer: 0, vencido: 0, sin_contrato: 0 } as Record<ContractStatus, number>
  );
}
