import { StateCreator, create } from "zustand";

import { GeneAnnotation, GeneList } from "../api";
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
  species: string;
  setSpecies: (name: string) => void;
}

export interface GeneListSlice {
  activeGeneList: GeneList | undefined;
  setActiveGeneList: (geneListId: string) => void;
  selectedGeneListId: string;
  setSelectedGeneListId: (id: string) => void;
  availableGeneLists: Array<GeneList>;
  addGeneList: (newList: GeneList) => void;
  updateGeneList: (updatedList: GeneList) => void;
  removeGeneList: (listToRemoveId: string) => void;
  searchResults: Array<GeneAnnotation>;
  setSearchResults: (newGeneAnnotations: Array<GeneAnnotation>) => void;
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
  species: "Picea abies",
  setSpecies: (name) => set({ species: name }),
});

export const createGeneListSlice: StateCreator<
  GeneListSlice,
  [],
  [],
  GeneListSlice
> = (set, get) => ({
  activeGeneList: undefined,
  setActiveGeneList: (geneListId) =>
    set({
      activeGeneList: get().availableGeneLists.filter(
        (value) => value.id === geneListId
      )[0],
    }),
  selectedGeneListId: localStorageParser<string>(GENE_LIST_ID_KEY, ""),
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
  searchResults: [],
  setSearchResults: (newGeneAnnotations) =>
    set({ searchResults: newGeneAnnotations }),
});

export const useAppStore = create<MainSlice & GeneListSlice>()(
  (...storeArgs) => ({
    ...createMainSlice(...storeArgs),
    ...createGeneListSlice(...storeArgs),
  })
);
