import { create } from "zustand";

export interface Story {
  storyId: string;
  seriesCategory: string;
  storyTitle: string;
  image?: string;
  isFavourite?: boolean;
  characters?: object;
  themes?: any;
  collections?: string;
  track?: {
    duration?: number;
    played?: number;
    watched?: boolean;
  };
  audio_s_2_5?: string; // Audio URL for the story
  audio_p_2_5?: string; // Audio URL for the story
  audio_s_6_9?: string; // Audio URL for the story
  audio_p_6_9?: string; // Audio URL for the story
}

interface StoryStoreState {
  stories: Story[];
  recentStories: Story[];
  setRecentStories: (stories: Story[]) => void;
  listeningStory: Story | null; // Currently listening story
  setCurrentStory: (story: Story) => void; // Optional setter for current story
  currentIndex: number; // Optional current index
  setCurrentIndex: (index: number) => void; // Optional setter for current index
  setStories: (stories: Story[]) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  markWatched: (id: string) => void;
  addStory: (story: Story) => void;
  removeStory: (id: string) => void;
}

export const useStoryStore = create<StoryStoreState>((set, get) => ({
  stories: [],
  currentIndex: 0, // Initialize with no current index
  recentStories: [],
  setRecentStories: (stories) => set({ recentStories: stories }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  listeningStory: null, // Initialize with no story being listened to
  setStories: (stories) => set({ stories }),
  setCurrentStory: (story) => set({ listeningStory: story }),
  updateStory: (id, updates) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.storyId === id ? { ...story, ...updates } : story
      ),
    })),
  markWatched: (id) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.storyId === id ? { ...story, watched: true } : story
      ),
    })),
  addStory: (story) =>
    set((state) => ({
      stories: [...state.stories, story],
    })),
  removeStory: (id) =>
    set((state) => ({
      stories: state.stories.filter((story) => story.storyId !== id),
    })),
}));
