import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: false,
  modalOpen: null, // string key of the active modal
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (key) => set({ modalOpen: key }),
  closeModal: () => set({ modalOpen: null }),
}));

export default useUIStore;
