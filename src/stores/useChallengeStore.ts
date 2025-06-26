// src/stores/challengeStore.ts
import { create } from 'zustand';

interface ChallengeState {
  checklistTitle: string;
  setChecklistTitle: (title: string) => void;

  currentMissionId: number | null;
  setCurrentMissionId: (id: number) => void;
}

export const useChallengeStore = create<ChallengeState>(set => ({
  checklistTitle: '',
  setChecklistTitle: title => set({ checklistTitle: title }),

  currentMissionId: null,
  setCurrentMissionId: id => set({ currentMissionId: id }),
}));
