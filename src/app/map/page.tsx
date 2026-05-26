import StationsMap from "@/components/StationsMap";
import { stations } from "@/data/stations";

export default function MapPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Leyenda */}
      <div className="flex items-center gap-6 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Leyenda:</span>
        {[
          { color: "bg-green-500", label: "Vigente" },
          { color: "bg-amber-500", label: "Por vencer (< 90 días)" },
          { color: "bg-red-600", label: "Vencido" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
        <span className="ml-auto text-xs text-gray-400">{stations.length} estaciones · Haz clic en un pin para ver el detalle</span>
      </div>

      {/* Mapa ocupa el resto del alto */}
      <div className="flex-1">
        <StationsMap stations={stations} />
      </div>
    </div>
  );
}
