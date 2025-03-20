export const AVAILABLE_SPECIES_KEY = "available-species-v0p1";
export const AVAILABLE_GENOMES_KEY = "available-genomes-v0p1";
export const GENE_LIST_PREFIX = "gene-list";
export const SPECIES_ID_KEY = "selected-species-id";
export const GENE_LIST_ID_KEY = "selected-gene-list-id";

export const AVAILABLE_BLAST_DBS_BY_SPECIES = {};

export const AVAILABLE_EXPERIMENTS_BY_SPECIES: { [key: string]: string[] } = {
  "Picea abies": [
    "Cold Stress Needles",
    "Cold Stress Roots",
    "Drought Stress Needles",
    "Drought Stress Roots",
    "Somatic Embryogenesis",
    "Zygotic Embryogenesis",
    "ExAtlas",
    "Wood Development",
    "Light Availability",
    // these ones are not in the db yet
    // "Seasonal Needles",
    // "Seasonal Wood",
  ],
  "Pinus sylvestris": [
    "Cold Stress Needles",
    "Cold Stress Roots",
    "Drought Stress Needles",
    "Drought Stress Roots",
    "Wood Development",
  ],
  "Populus tremula": [
    // "Light Response Test",
    // "Drought Resistance Study",
    // "Root Structure Analysis",
  ],
};

export const SPECIES_TO_NUMERIC_ID: { [key: string]: number } = {
  "Picea abies": 1,
  "Pinus sylvestris": 2,
  "Populus tremula": 3,
};

export const NUMERIC_ID_TO_SPECIES: { [key: number]: string } = {
  1: "Picea abies",
  2: "Pinus sylvestris",
  3: "Populus tremula",
};

export const ExperimentTitleToId: { [key: string]: number } = {
  "Picea abies Cold Stress Roots": 1,
  "Picea abies Cold Stress Needles": 2,
  "Picea abies Drought Stress Roots": 3,
  "Picea abies Drought Stress Needles": 4,
  "Pinus sylvestris Cold Stress Roots": 5,
  "Pinus sylvestris Cold Stress Needles": 6,
  "Pinus sylvestris Drought Stress Roots": 7,
  "Pinus sylvestris Drought Stress Needles": 8,
  "Picea abies Somatic Embryogenesis": 9,
  "Picea abies Zygotic Embryogenesis": 10,
  "Picea abies ExAtlas": 11,
  "Picea abies Wood Development": 12,
  "Pinus sylvestris Wood Development": 13,
  "Picea abies Light Availability": 14,
};
