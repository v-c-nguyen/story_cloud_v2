import { create } from 'zustand';

// Define the type for a Pathway (customize as needed)
export interface Pathway {
    id: number;
    description: string;
    length: number;
    name: string;
    parent_id: string;
    currentStep: number;
    parent_kids: ParentKids[];
    parent_targets: ParentTargets[];
    stories: any[];
    [key: string]: any;
}

interface ParentKids {
    id: string;
    name: string;
    avatar_url: string;
}
interface ParentTargets {
    id: string;
    name: string;
}
interface PathwayStore {
    pathways: Pathway[];
    currentPathway: Pathway | null;
    setCurrentPathway: (pathway: Pathway | null) => void;
    setPathways: (pathways: Pathway[]) => void;
    clearPathways: () => void;
}

export const usePathwayStore = create<PathwayStore>((set) => ({
    pathways: [],
    currentPathway: null,
    setCurrentPathway: (pathway) => set({ currentPathway: pathway }),
    setPathways: (pathways) => set({ pathways }),
    clearPathways: () => set({ pathways: [] }),
}));
