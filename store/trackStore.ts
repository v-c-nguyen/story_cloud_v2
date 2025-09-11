import { create } from 'zustand';

export interface Track {
  storyId: string;
  childId: string;
  played: number;
  duration: number;
  watched: boolean;
  audioUrl?: string;
  again?: boolean;
}

interface TrackState {
  activeTrack: Track | null;
  setActiveTrack: (track: Track) => void;
  clearActiveTrack: () => void;
  setDuration: (duration: number) => void;
  setWatched: (watched: boolean) => void;
  setPlayed: (played: number) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  activeTrack: null,
  setActiveTrack: (track) => set({ activeTrack: track }),
  clearActiveTrack: () => set({ activeTrack: null }),
  setDuration: (duration) => set((state) => state.activeTrack ? { activeTrack: { ...state.activeTrack, duration } } : {}),
  setWatched: (watched) => set((state) => state.activeTrack ? { activeTrack: { ...state.activeTrack, watched } } : {}),
  setPlayed: (played) => set((state) => state.activeTrack ? { activeTrack: { ...state.activeTrack, played } } : {}),
}));
