"use client";

import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Ejecutivo",
  "/map": "Mapa de Estaciones",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "PRIMAX";
  const dateStr = format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400 capitalize">{dateFormatted}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm text-gray-700 font-medium">Ejecutivo Cusco</span>
        </div>
      </div>
    </header>
  );
}
