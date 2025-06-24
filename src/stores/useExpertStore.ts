import { create } from 'zustand';
import type { MonthlyExpert } from '../types/api/expert/expert';
import { getMonthlyExperts } from '../services';

interface ExpertState {
  experts: MonthlyExpert[];
  fetchExperts: () => Promise<void>;
  toggleLike: (id: number) => void;
}

export const useExpertStore = create<ExpertState>(set => ({
  experts: [],
  fetchExperts: async () => {
    try {
      const data = await getMonthlyExperts();
      set({ experts: data });
    } catch (error) {
      console.error('전문가 불러오기 실패', error);
    }
  },

  toggleLike: id => {
    set(state => ({
      experts: state.experts.map(expert => {
        if (expert.id === id) {
          const isNowLiked = !expert.isLiked;
          return {
            ...expert,
            isLiked: isNowLiked,
            // reviewCount: expert.reviewCount + (isNowLiked ? 1 : -1),
          };
        }
        return expert;
      }),
    }));
  },
}));
