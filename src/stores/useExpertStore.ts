import { create } from 'zustand';
import type { MonthlyExpert } from '../types/api/expert/expert';
import { getMonthlyExperts } from '../services';

interface ExpertPageable {
  pageNumber: number;
  pageSize: number;
}

interface ExpertResponse {
  content: MonthlyExpert[];
  pageable: ExpertPageable;
  totalPages: number;
  totalElements: number;
}

interface ExpertState {
  experts: MonthlyExpert[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  fetchExperts: (page?: number) => Promise<void>;
  toggleLike: (id: number) => void;
}

export const useExpertStore = create<ExpertState>(set => ({
  experts: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 20,

  fetchExperts: async (page = 0) => {
    try {
      const response = await getMonthlyExperts(page);
      const expertResponse = response as ExpertResponse;

      set({
        experts: expertResponse.content,
        currentPage: expertResponse.pageable.pageNumber,
        totalPages: expertResponse.totalPages,
        totalElements: expertResponse.totalElements,
        pageSize: expertResponse.pageable.pageSize,
      });
    } catch (error) {
      console.error('전문가 불러오기 실패', error);
      set({ experts: [] });
    }
  },

  toggleLike: id => {
    set(state => ({
      experts: state.experts.map(expert => {
        if (expert.id === id) {
          return {
            ...expert,
            isLiked: !expert.isLiked,
          };
        }
        return expert;
      }),
    }));
  },
}));
