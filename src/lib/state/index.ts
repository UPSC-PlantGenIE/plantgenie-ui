import { StateCreator, create } from "zustand";

import { SPECIES_ID_KEY } from "../constants";

export interface MainSlice {
  applicationPath: string;
  setApplicationPath: (path: string) => void;
  speciesId: number;
  setSpeciesId: (id: number) => void;
}

export const createMainSlice: StateCreator<MainSlice, [], [], MainSlice> = (set) => ({
  applicationPath: window.location.pathname,
  speciesId: (() => {
    const retrievedId = localStorage.getItem(SPECIES_ID_KEY);
    if (retrievedId !== null) return Number.parseInt(retrievedId);
    return 1;
  })(),
  setApplicationPath: (path) => set({applicationPath: path}),
  setSpeciesId: (id) => set({speciesId: id}),
});

export const useAppStore = create<MainSlice>()((...storeArgs) => ({
  ...createMainSlice(...storeArgs),
}));