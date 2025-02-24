import { StateCreator, create } from "zustand";

import { GeneList } from "../api";
import {
  GENE_LIST_PREFIX,
  GENE_LIST_ID_KEY,
  SPECIES_ID_KEY,
} from "../constants";
import { localStorageParser } from "../localstorage";

export interface MainSlice {
  applicationPath: string;
  setApplicationPath: (path: string) => void;
  speciesId: number;
  setSpeciesId: (id: number) => void;
}

export interface GeneListSlice {
  selectedGeneListId: string;
  setSelectedGeneListId: (id: string) => void;
  availableGeneLists: Array<GeneList>;
  addGeneList: (newList: GeneList) => void;
  updateGeneList: (updatedList: GeneList) => void;
  removeGeneList: (listToRemoveId: string) => void;
}

export const createMainSlice: StateCreator<MainSlice, [], [], MainSlice> = (
  set
) => ({
  applicationPath: window.location.pathname,
  speciesId: (() => {
    const retrievedId = localStorage.getItem(SPECIES_ID_KEY);
    if (retrievedId !== null) return Number.parseInt(retrievedId);
    return 1;
  })(),
  setApplicationPath: (path) => set({ applicationPath: path }),
  setSpeciesId: (id) => set({ speciesId: id }),
});

export const createGeneListSlice: StateCreator<
  GeneListSlice,
  [],
  [],
  GeneListSlice
> = (set) => ({
  selectedGeneListId: localStorageParser<string>(GENE_LIST_ID_KEY) ?? "",
  setSelectedGeneListId: (id) => {
    localStorage.setItem(GENE_LIST_ID_KEY, id);
    set({ selectedGeneListId: id });
  },
  availableGeneLists: Object.keys(localStorage)
    .filter((key) => key.startsWith(GENE_LIST_PREFIX))
    .map((key) => localStorageParser<GeneList>(key)!),
  addGeneList: (newList) =>
    set((state) => {
      localStorage.setItem(
        `${GENE_LIST_PREFIX}-${newList.id}`,
        JSON.stringify(newList)
      );
      return { availableGeneLists: [newList, ...state.availableGeneLists] };
    }),
  updateGeneList: (updatedList) =>
    set((state) => {
      localStorage.setItem(
        `${GENE_LIST_PREFIX}-${updatedList.id}`,
        JSON.stringify(updatedList)
      );
      return {
        availableGeneLists: [
          updatedList,
          ...state.availableGeneLists.filter(
            (geneList) => geneList.id !== updatedList.id
          ),
        ],
      };
    }),
  removeGeneList: (listToRemoveId) => {
    set((state) => {
      const keptGeneLists = state.availableGeneLists.filter(
        (geneList) => geneList.id !== listToRemoveId
      );
      localStorage.removeItem(`${GENE_LIST_PREFIX}-${listToRemoveId}`);
      return { availableGeneLists: keptGeneLists };
    });
  },
});

export const useAppStore = create<MainSlice & GeneListSlice>()(
  (...storeArgs) => ({
    ...createMainSlice(...storeArgs),
    ...createGeneListSlice(...storeArgs),
  })
);
