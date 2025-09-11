import { create } from "zustand";

export interface Series {
  id: string;
  name: string;
  description_parent?: string;
  image: string;
  episode_count: number;
  [key: string]: any;
  series_category: string;
  learning_category?: any;
  isFavourite?: boolean;
}

interface SeriesStoreState {
  series: Series[];
  currentSeries?: Series | null; // Optional current series
  setCurrentSeries?: (series: Series | null) => void; // Optional setter for
  currentKidSeries?: Series | null; // Optional current series
  setCurrentKidSeries?: (series: Series | null) => void; // Optional setter for
  setSeries: (series: Series[]) => void;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  addSeries: (series: Series) => void;
  removeSeries: (id: string) => void;
  clearSeries: () => void;
}

export const useSeriesStore = create<SeriesStoreState>((set, get) => ({
  series: [],
  currentSeries: null, // Initialize with no current series
  setCurrentSeries: (series) => set({ currentSeries: series }),
  currentKidSeries: null, // Initialize with no current series
  setCurrentKidSeries: (series) => set({ currentKidSeries: series }),
  setSeries: (series) => set({ series }),
  updateSeries: (id, updates) =>
    set((state) => ({
      series: state.series.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  addSeries: (series) =>
    set((state) => ({
      series: [...state.series, series],
    })),
  removeSeries: (id) =>
    set((state) => ({
      series: state.series?.filter((s) => s.id !== id),
    })),
  clearSeries: () => set({ series: [] }),
}));
