import { get, post } from "../api";

export type ExpressionRequest = {
  experimentId: number;
  geneIds: string[];
};

export type ExpressionResponse = {
  geneIds: string[];
  samples: string[];
  values: number[];
  units: "tpm" | "vst";
  missingGeneIds: string[];
};

export const getExpressionData = (request_body: ExpressionRequest) =>
  post<ExpressionRequest, ExpressionResponse>("/v1/expression", request_body);

export type AnnotationRequest = {
  species: string;
  geneIds: string[];
};

export type GeneAnnotation = {
  geneId: string;
  geneName: string | null;
  description: string | null;
};

export type AnnotationResponse = {
  results: GeneAnnotation[];
};

export type GeneList = {
  id: string;
  speciesId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
  geneIds: string[];
};

export const getAnnotationData = (request_body: AnnotationRequest) =>
  post<AnnotationRequest, AnnotationResponse>("/v1/annotations", request_body);

// class AvailableSpecies(PlantGenieModel):
//     species_id: int = Field(alias="id")
//     species_name: str = Field(alias="speciesName")
//     species_abbreviation: str = Field(alias="speciesAbbreviation")
//     avatar_path: str = Field(alias="avatarPath")

// class AvailableSpeciesResponse(PlantGenieModel):
//     species: List[AvailableSpecies]

export type AvailableSpecies = {
  speciesId: number;
  speciesName: string;
  speciesAbbreviation: string;
  avatarPath: string;
};

export type AvailableSpeciesResponse = {
  species: Array<AvailableSpecies>;
};

export const getAvailableSpecies = () =>
  get<AvailableSpeciesResponse>("/available-species");
