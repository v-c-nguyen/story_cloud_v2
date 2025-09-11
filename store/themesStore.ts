import { create } from "zustand";

export interface ThemeItem {
  id: string;
  name: string;
  symbol?: string;
  [key: string]: any;
}

interface ThemesStoreState {
  themes: ThemeItem[];
  currentTheme?: ThemeItem | null;
  setCurrentTheme?: (t: ThemeItem | null) => void;
  currentKidTheme?: ThemeItem | null;
  setCurrentKidTheme?: (t: ThemeItem | null) => void;
  setThemes: (t: ThemeItem[]) => void;
  addTheme: (t: ThemeItem) => void;
  removeTheme: (id: string) => void;
  clearThemes: () => void;
}

export const useThemesStore = create<ThemesStoreState>((set, get) => ({
  themes: [],
  currentTheme: null,
  setCurrentTheme: (t) => set({ currentTheme: t }),
  currentKidTheme: null,
  setCurrentKidTheme: (t) => set({ currentKidTheme: t }),
  setThemes: (t) => set({ themes: t }),
  addTheme: (t) => set((state) => ({ themes: [...state.themes, t] })),
  removeTheme: (id) =>
    set((state) => ({ themes: state.themes.filter((x) => x.id !== id) })),
  clearThemes: () => set({ themes: [] }),
}));
