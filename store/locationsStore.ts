import { create } from "zustand";

export interface Location {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
  isFavorite?: boolean;
  [key: string]: any;
}

interface LocationsStoreState {
  locations: Location[];
  currentLocation?: Location | null;
  setCurrentLocation?: (c: Location | null) => void;
  currentKidLocation?: Location | null;
  setCurrentKidLocation?: (c: Location | null) => void;
  setLocations: (c: Location[]) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  addLocation: (c: Location) => void;
  removeLocation: (id: string) => void;
  clearLocations: () => void;
}

export const useLocationsStore = create<LocationsStoreState>((set, get) => ({
  locations: [],
  currentLocation: null,
  setCurrentLocation: (c) => set({ currentLocation: c }),
  currentKidLocation: null,
  setCurrentKidLocation: (c) => set({ currentKidLocation: c }),
  setLocations: (c) => set({ locations: c }),
  updateLocation: (id, updates) =>
    set((state) => ({
      locations: state.locations.map((ch) =>
        ch.id === id ? { ...ch, ...updates } : ch
      ),
    })),
  addLocation: (c) =>
    set((state) => ({ locations: [...state.locations, c] })),
  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((ch) => ch.id !== id),
    })),
  clearLocations: () => set({ locations: [] }),
}));
