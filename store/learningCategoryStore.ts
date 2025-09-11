import { create } from 'zustand';

interface LearningCategory {
  id: number;
  name: string;
  // Add other fields as needed
}

interface LearningCategoryStore {
  categories: LearningCategory[];
  currentCategory?: LearningCategory | null;
  setCategories: (categories: LearningCategory[]) => void;
  setCurrentCategory?: (category: LearningCategory | null) => void;
}

export const useLearningCategoryStore = create<LearningCategoryStore>((set) => ({
  categories: [],
  currentCategory: undefined,
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
}));
