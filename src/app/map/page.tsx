import StationsMap from "@/components/StationsMap";
import { stations } from "@/data/stations";

export default function MapPage() {
  return <StationsMap stations={stations} />;
}
