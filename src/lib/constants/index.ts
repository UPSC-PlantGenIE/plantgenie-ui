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

export const EXAMPLE_GENE_IDS = [
  "PA_chr04_G002083",
  "PA_chr11_G002939",
  "PA_chr03_G006338",
  "PA_chr10_G002368",
  "PA_chr09_G003184",
  "PA_chr04_G002947",
  "PA_chr04_G003387",
  "PA_chr06_G001018",
  "PA_chr01_G003175",
  "PA_chr01_cUL0040_G000031",
  "PA_chr03_G003038",
  "PA_chr09_G004095",
  "PA_chr05_G002413",
  "PA_chr03_G004494",
  "PA_chr03_G004436",
  "PA_chr12_G000912",
  "PA_chr03_G004657",
  "PA_chr03_G004625",
  "PA_chr04_G002738",
  "PA_chr03_G002384",
  "PA_chr07_G005825",
  "PA_chr09_G000854",
  "PA_chr03_G003921",
  "PA_chr09_G002091",
  "PA_chr06_G002903",
  "PA_chr03_G006801",
  "PA_chr11_G001351",
  "PA_chr07_G001760",
  "PA_cUP0137_G000006",
  "PA_chr07_G004056",
  "PA_chr09_G003259",
  "PA_chr06_G002530",
  "PA_chr06_G003805",
];

export const PS_EXAMPLE_GENE_IDS = [
  "PS_chr01_G001510",
  "PS_chr01_G001511",
  "PS_chr01_G001858",
  "PS_chr02_G005492",
  "PS_chr05_G023222",
  "PS_chr06_G027387",
  "PS_chr07_G028528",
  "PS_chr08_G036131",
  "PS_chr08_G036386",
  "PS_sUP1581_G057360",
  "PS_sUP4596_G058587",
];
