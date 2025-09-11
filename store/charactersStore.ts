import { create } from "zustand";

export interface Character {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
  isFavorite?: boolean;
  [key: string]: any;
}

interface CharactersStoreState {
  characters: Character[];
  currentCharacter?: Character | null;
  setCurrentCharacter?: (c: Character | null) => void;
  currentKidCharacter?: Character | null;
  setCurrentKidCharacter?: (c: Character | null) => void;
  setCharacters: (c: Character[]) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  addCharacter: (c: Character) => void;
  removeCharacter: (id: string) => void;
  clearCharacters: () => void;
}

export const useCharactersStore = create<CharactersStoreState>((set, get) => ({
  characters: [],
  currentCharacter: null,
  setCurrentCharacter: (c) => set({ currentCharacter: c }),
  currentKidCharacter: null,
  setCurrentKidCharacter: (c) => set({ currentKidCharacter: c }),
  setCharacters: (c) => set({ characters: c }),
  updateCharacter: (id, updates) =>
    set((state) => ({
      characters: state.characters.map((ch) =>
        ch.id === id ? { ...ch, ...updates } : ch
      ),
    })),
  addCharacter: (c) =>
    set((state) => ({ characters: [...state.characters, c] })),
  removeCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((ch) => ch.id !== id),
    })),
  clearCharacters: () => set({ characters: [] }),
}));
