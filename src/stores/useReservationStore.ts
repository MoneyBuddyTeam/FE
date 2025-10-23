import { create } from 'zustand';
import type { Expert } from '../types';

interface ReservationState {
  expert: Expert | null;
  setExpert: (expert: Expert) => void;

  selectedConcern: string | null;
  content: string;
  selectedDate: string | null;
  consultMethod: 'chat' | 'call' | null;
  selectedTime: string | null;
  extendMinutes: number;
  needExtend: boolean;

  increaseExtend: () => void;
  decreaseExtend: () => void;
  toggleNeedExtend: () => void;
  setSelectedConcern: (key: string) => void;
  setContent: (value: string) => void;
  setSelectedDate: (date: string) => void;
  setConsultMethod: (method: 'chat' | 'call') => void;
  setSelectedTime: (time: string) => void;
  clearConcern: () => void;
}

export const useReservationStore = create<ReservationState>(set => ({
  expert: null,
  setExpert: expert => set({ expert }),

  selectedConcern: null,
  content: '',
  selectedDate: null,
  consultMethod: null,
  selectedTime: null,
  extendMinutes: 15,
  needExtend: true,

  increaseExtend: () =>
    set(state => ({
      extendMinutes: Math.min(state.extendMinutes + 15, 60),
    })),
  decreaseExtend: () =>
    set(state => ({
      extendMinutes: Math.max(state.extendMinutes - 15, 15),
    })),
  toggleNeedExtend: () =>
    set(state => {
      const next = !state.needExtend;
      return {
        needExtend: next,
        extendMinutes: next ? Math.max(state.extendMinutes, 15) : 15,
      };
    }),
  setSelectedConcern: key => set({ selectedConcern: key }),
  setContent: value => set({ content: value }),
  setSelectedDate: date => set({ selectedDate: date }),
  setConsultMethod: method => set({ consultMethod: method }),
  setSelectedTime: time => set({ selectedTime: time }),

  clearConcern: () =>
    set({
      expert: null,
      selectedConcern: null,
      content: '',
      selectedDate: null,
      consultMethod: null,
      selectedTime: null,
    }),
}));
