import { create } from 'zustand';

let toastSeq = 0;

export const useAppStore = create((set, get) => ({
  toasts: [],

  pushToast: (message, type = 'info') => {
    const id = ++toastSeq;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 4500);
  },

  dismissToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
