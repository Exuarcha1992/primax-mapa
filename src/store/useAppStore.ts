import { create } from "zustand";
import type { Station } from "@/types";

interface AppState {
  selectedStation: Station | null;
  drawerOpen: boolean;
  setSelectedStation: (station: Station | null) => void;
  closeDrawer: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStation: null,
  drawerOpen: false,
  setSelectedStation: (station) =>
    set({ selectedStation: station, drawerOpen: station !== null }),
  closeDrawer: () => set({ drawerOpen: false, selectedStation: null }),
}));
