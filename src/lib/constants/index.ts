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
  "Populus tremula": ["Wood Development"],
  "Prunus avium": ["Wood Development"],
  "Betula pendula": ["Wood Development"],
  "Pinus contorta": ["Wood Development"],
};

export const SPECIES_TO_NUMERIC_ID: { [key: string]: number } = {
  "Picea abies": 1,
  "Pinus sylvestris": 2,
  "Populus tremula": 3,
  "Arabidopsis thaliana": 4,
  "Prunus avium": 5,
  "Betula pendula": 6,
  "Pinus contorta": 7,
};

export const SPECIES_TO_GENOME_ID: { [key: string]: number } = {
  "Picea abies": 1,
  "Pinus sylvestris": 2,
  "Populus tremula": 3,
  "Arabidopsis thaliana": 4,
  "Prunus avium": 5,
  "Betula pendula": 6,
  "Pinus contorta": 2,
};

export const NUMERIC_ID_TO_SPECIES: { [key: number]: string } = {
  1: "Picea abies",
  2: "Pinus sylvestris",
  3: "Populus tremula",
  4: "Arabidopsis thaliana",
  5: "Prunus avium",
  6: "Betula pendula",
  7: "Pinus contorta",
};

// JBROWSE LINKS FOR SPECIES
export const NUMERIC_ID_TO_JBROWSE: { [key: number]: string } = {
  1: "https://genomes.scilifelab.se/genome-browser/?config=%2Fdata%2FmlYJHVRALC8KtpFNRWAi2TLUm7jXanGE%2Fconfig.json",
  2: "https://genomes.scilifelab.se/genome-browser/?config=%2Fdata%2F38qQhuj9O2BKK4HM0cdQfbxOGVXUchMO%2Fconfig.json",
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
  "Populus tremula Wood Development": 15,
  "Pinus contorta Wood Development": 16,
  "Betula pendula Wood Development": 17,
  "Prunus avium Wood Development": 18,
};

export const PICEA_ABIES_LIGHT_EXAMPLES = [
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

export const POPULUS_TREMULA_EXAMPLES = [
  "Potra2n11c23199",
  "Potra2n13c26130",
  "Potra2n16c29730",
  "Potra2n18c32336",
  "Potra2n18c32995",
  "Potra2n1c2300",
  "Potra2n2c4078",
  "Potra2n2c5822",
  "Potra2n3c7211",
  "Potra2n4c8952",
  "Potra2n571s36008",
  "Potra2n5c11119",
  "Potra2n5c12058",
  "Potra2n5c12591",
  "Potra2n6c13086",
  "Potra2n6c13749",
  "Potra2n6c14938",
  "Potra2n7c15965",
  "Potra2n9c19448",
];

export const PRUNUS_AVIUM_EXAMPLES = [
  "FUN_006420",
  "FUN_006421",
  "FUN_006571",
  "FUN_008202",
  "FUN_032245",
  "FUN_032272",
  "FUN_023551",
  "FUN_020402",
  "FUN_039811",
  "FUN_027137",
  "FUN_027254",
  "FUN_027255",
  "FUN_030863",
];

const POPULUS_TREMULA_WOOD_EXAMPLES = [
  "Potra2n11c23199",
  "Potra2n13c26130",
  "Potra2n16c29730",
  "Potra2n18c32336",
  "Potra2n18c32995",
  "Potra2n1c2300",
  "Potra2n2c4078",
  "Potra2n2c5822",
  "Potra2n4c8952",
  "Potra2n571s36008",
  "Potra2n5c11119",
  "Potra2n5c12058",
  "Potra2n5c12591",
  "Potra2n6c13086",
  "Potra2n6c13749",
  "Potra2n6c14938",
  "Potra2n7c15965",
  "Potra2n9c19448",
];


const BETULA_PENDULA_WOOD_EXAMPLES = [
  "Bpev01.c0000.g0006",
  "Bpev01.c0196.g0006",
  "Bpev01.c0205.g0006",
  "Bpev01.c0374.g0017",
  "Bpev01.c0374.g0018",
  "Bpev01.c0402.g0034",
  "Bpev01.c0480.g0087",
  "Bpev01.c0603.g0003",
  "Bpev01.c0777.g0012",
];

const PRUNUS_AVIUM_WOOD_EXAMPLES = [
  "FUN_006420",
  "FUN_006421",
  "FUN_006571",
  "FUN_008202",
  "FUN_020402",
  "FUN_023551",
  "FUN_027137",
  "FUN_027254",
  "FUN_030863",
  "FUN_032245",
  "FUN_032272",
  "FUN_039811",
];

const PICEA_ABIES_WOOD_EXAMPLES = [
  "PA_chr01_G003828",
  "PA_chr03_G001205",
  "PA_chr05_G005247",
  "PA_chr08_G001797",
  "PA_chr09_G003179",
  "PA_chr09_G004485",
  "PA_chr10_G000911",
  "PA_chr11_G000197",
];

const PINUS_SYLVESTRIS_WOOD_EXAMPLES = [
  "PS_chr01_G002695",
  "PS_chr03_G010819",
  "PS_chr03_G013959",
  "PS_chr05_G023417",
  "PS_chr05_G023418",
  "PS_chr05_G023420",
  "PS_chr08_G032386",
  "PS_chr09_G039418",
  "PS_chr09_G040837",
  "PS_chr10_G041713",
  "PS_chr11_G045092",
];

const PINUS_CONTORTA_WOOD_EXAMPLES = PINUS_SYLVESTRIS_WOOD_EXAMPLES;


type ExampleList = {
  id: string;
  speciesId: number;
  name: string;
  geneIds: Array<string>;
};

export const EXAMPLE_LISTS: Array<ExampleList> = [
  {
    id: "picab-id-light-list",
    name: "Spruce Light",
    speciesId: 1,
    geneIds: PICEA_ABIES_LIGHT_EXAMPLES,
  },
    {
    id: "picab-id-wood-list",
    name: "Spruce Wood Examples",
    speciesId: 1,
    geneIds: PICEA_ABIES_WOOD_EXAMPLES,
  },
  {
    id: "pinsy-id-wood-list",
    name: "Scots Pine Wood Examples",
    speciesId: 2,
    geneIds: PINUS_SYLVESTRIS_WOOD_EXAMPLES,
  },
  {
    id: "potra-id-wood-list",
    name: "Aspen Wood Examples",
    speciesId: 3,
    geneIds: POPULUS_TREMULA_WOOD_EXAMPLES,
  },
  {
    id: "pruav-id-wood-list",
    name: "Cherry Wood Examples",
    speciesId: 5,
    geneIds: PRUNUS_AVIUM_WOOD_EXAMPLES,
  },
  {
    id: "bepen-id-wood-list",
    name: "Birch Wood Examples",
    speciesId: 6,
    geneIds: BETULA_PENDULA_WOOD_EXAMPLES,
  },
  {
    id: "pinta-id-wood-list",
    name: "Lodgepole Pine Wood Examples",
    speciesId: 7,
    geneIds: PINUS_CONTORTA_WOOD_EXAMPLES,
  },
];
