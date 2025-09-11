import { create } from "zustand";

type ListenStore = {
  activeStoryId: string | null;
  setActiveStoryId: (id: string) => void;
  series: any;
  setSeries: (series: any) => void;
  stories: any[];
  setStories: (stories: any[]) => void;
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
};

export const useListenStore = create<ListenStore>((set) => ({
  activeStoryId: null,
  setActiveStoryId: (id) => set({ activeStoryId: id }),
  series: null,
  setSeries: (series) => set({ series }),
  stories: [],
  setStories: (stories) => set({ stories }),
  currentIndex: -1,
  setCurrentIndex: (idx: number) => set({ currentIndex: idx }),
}));