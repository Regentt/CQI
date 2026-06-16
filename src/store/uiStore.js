

import { create } from "zustand";

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
}));