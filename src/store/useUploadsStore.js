import { create } from 'zustand';

export const useUploadsStore = create((set, get) => ({
  uploads: [],
  parsing: false,

  setParsing: (parsing) => set({ parsing }),

  addUploads: (items) => set({ uploads: [...get().uploads, ...items] }),

  removeUpload: (fileId) =>
    set({ uploads: get().uploads.filter((u) => u.fileId !== fileId) }),

  setManualDoc: (fileId, docId) =>
    set({
      uploads: get().uploads.map((u) =>
        u.fileId === fileId ? { ...u, manualDocId: docId || null } : u
      ),
    }),

  clear: () => set({ uploads: [] }),
}));
