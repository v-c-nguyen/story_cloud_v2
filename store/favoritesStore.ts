import { create } from "zustand";

type FavoritesStore = {
    stories: any[];
    series: any[];
    setStories: (stories: any[]) => void;
    addStory: (story: any) => void;
    removeStory: (storyId: string) => void;
    setSeries: (series: any[]) => void;
};

export const useFavoritesStore = create<FavoritesStore>((set) => ({
    stories: [],
    series: [],
    setStories: (stories) => set({ stories }),
    addStory: (story) =>
        set((state) => ({
            stories: [...state.stories, story],
        })),
    removeStory: (storyId) =>
        set((state) => ({
            stories: state.stories.filter((s) => s.story_id !== storyId),
        })),
    setSeries: (series) => set({ series }),
}));