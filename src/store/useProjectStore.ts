import { create } from 'zustand';

interface ProjectState {
  currentProjectId: string | null;
  setCurrentProject: (id: string) => void;
  // Basic example of global pipeline status state useful across pages
  pipelineStatus: 'idle' | 'running' | 'completed' | 'error';
  setPipelineStatus: (status: 'idle' | 'running' | 'completed' | 'error') => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProjectId: null,
  setCurrentProject: (id) => set({ currentProjectId: id }),
  pipelineStatus: 'idle',
  setPipelineStatus: (status) => set({ pipelineStatus: status }),
}));
