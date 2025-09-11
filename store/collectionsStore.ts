import { create } from "zustand";

export interface Collection {
  id?: string;
  name: string;
  description_kid?: string;
  description_parent?: string;
  type?: string;
  stories?: any[];
  [key: string]: any;
}

interface CollectionsStoreState {
  collections: Collection[];
  currentCollection: Collection | null;
  setCurrentCollection: (collection: Collection | null) => void;
  currentKidCollection: Collection | null;
  setCurrentKidCollection: (collection: Collection | null) => void;
  setCollections: (cols: Collection[]) => void;
  addCollection: (col: Collection) => void;
  removeCollection: (idOrName: string) => void;
  clearCollections: () => void;
}

export const useCollectionsStore = create<CollectionsStoreState>((set) => ({
  collections: [],
  currentCollection: null,
  setCurrentCollection: (name) => set({ currentCollection: name }),
  currentKidCollection: null,
  setCurrentKidCollection: (name) => set({ currentKidCollection: name }),
  setCollections: (cols) => set({ collections: cols }),
  addCollection: (col) =>
    set((state) => ({ collections: [...state.collections, col] })),
  removeCollection: (idOrName) =>
    set((state) => ({
      collections: state.collections.filter(
        (c) => c.id !== idOrName && c.name !== idOrName
      ),
    })),
  clearCollections: () => set({ collections: [] }),
}));
