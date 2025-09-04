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
  "Pinus taeda": ["Wood Development"],
};

export const SPECIES_TO_NUMERIC_ID: { [key: string]: number } = {
  "Picea abies": 1,
  "Pinus sylvestris": 2,
  "Populus tremula": 3,
  "Arabidopsis thaliana": 4,
  "Prunus avium": 5,
  "Betula pendula": 6,
  "Pinus taeda": 7,
};

export const SPECIES_TO_GENOME_ID: { [key: string]: number } = {
  "Picea abies": 1,
  "Pinus sylvestris": 2,
  "Populus tremula": 3,
  "Arabidopsis thaliana": 4,
  "Prunus avium": 5,
  "Betula pendula": 6,
  "Pinus taeda": 2,
};

export const NUMERIC_ID_TO_SPECIES: { [key: number]: string } = {
  1: "Picea abies",
  2: "Pinus sylvestris",
  3: "Populus tremula",
  4: "Arabidopsis thaliana",
  5: "Prunus avium",
  6: "Betula pendula",
  7: "Pinus taeda",
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
  "Pinus taeda Wood Development": 16,
  "Betula pendula Wood Development": 17,
  "Prunus avium Wood Development": 18,
};

export const PICEA_ABIES_EXAMPLES = [
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

export const PRUNUS_AVIUM_EXAMPLES = ["FUN_006420","FUN_006421","FUN_006571","FUN_008202","FUN_032245","FUN_032272","FUN_023551","FUN_020402","FUN_039811","FUN_027137","FUN_027254","FUN_027255","FUN_030863"]

const BETULA_PENDULA_EXAMPLES = [
  "Bpev01.c0000.g0006",
  "Bpev01.c0196.g0006",
  "Bpev01.c0205.g0006",
  "Bpev01.c0374.g0017",
  "Bpev01.c0374.g0018",
  "Bpev01.c0402.g0034",
  "Bpev01.c0480.g0087",
  "Bpev01.c0598.g0015",
  "Bpev01.c0603.g0003",
  "Bpev01.c0603.g0003",
  "Bpev01.c0777.g0012",
];

const PINUS_EXAMPLES = [
  "PS_chr01_G000118",
  "PS_chr01_G000159",
  "PS_chr01_G000250",
  "PS_chr01_G000251",
  "PS_chr01_G000252",
  "PS_chr01_G001664",
  "PS_chr01_G001797",
  "PS_chr01_G002695",
  "PS_chr02_G008974",
  "PS_chr02_G008976",
  "PS_chr02_G008977",
  "PS_chr02_G008979",
  "PS_chr02_G008980",
  "PS_chr02_G008981",
  "PS_chr02_G008982",
  "PS_chr02_G008984",
  "PS_chr02_G008985",
  "PS_chr02_G008986",
  "PS_chr02_G008987",
  "PS_chr02_G008988",
  "PS_chr02_G008989",
  "PS_chr02_G008991",
  "PS_chr02_G008992",
  "PS_chr02_G008994",
  "PS_chr02_G009897",
  "PS_chr03_G010819",
  "PS_chr03_G013412",
  "PS_chr03_G013882",
  "PS_chr03_G013959",
  "PS_chr05_G023417",
  "PS_chr05_G023418",
  "PS_chr05_G023420",
  "PS_chr06_G026429",
  "PS_chr06_G026856",
  "PS_chr07_G029402",
  "PS_chr07_G029798",
  "PS_chr08_G032386",
  "PS_chr08_G034445",
  "PS_chr08_G035526",
  "PS_chr09_G037814",
  "PS_chr09_G038815",
  "PS_chr09_G039418",
  "PS_chr09_G040837",
  "PS_chr10_G041446",
  "PS_chr10_G041713",
  "PS_chr10_G043725",
  "PS_chr11_G045092",
  "PS_chr12_G051034",
];

type ExampleList = {
  id: string;
  speciesId: number;
  name: string;
  geneIds: Array<string>;
}

export const EXAMPLE_LISTS: Array<ExampleList> = [
  {
    id: "picab-id-example-list",
    name: "Spruce Examples",
    speciesId: 1,
    geneIds: PICEA_ABIES_EXAMPLES,
  },
  {
    id: "pinsy-id-example-list",
    name: "Scots Pine Examples",
    speciesId: 2,
    geneIds: PINUS_EXAMPLES,
  },
  {
    id: "potra-id-example-list",
    name: "Aspen Examples",
    speciesId: 3,
    geneIds: POPULUS_TREMULA_EXAMPLES,
  },
  {
    id: "pruav-id-example-list",
    name: "Cherry Examples",
    speciesId: 5,
    geneIds: PRUNUS_AVIUM_EXAMPLES,
  },
  {
    id: "bepen-id-example-list",
    name: "Birch Examples",
    speciesId: 6,
    geneIds: BETULA_PENDULA_EXAMPLES,
  },
  {
    id: "pinta-id-example-list",
    name: "Loblolly Pine Examples",
    speciesId: 7,
    geneIds: PINUS_EXAMPLES,
  },
];
