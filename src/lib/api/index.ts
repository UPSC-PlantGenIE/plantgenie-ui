export interface GeneList {
  id: string;
  speciesId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
  geneIds: string[];
}

export interface AnnotationsRequest {
  species: string;
  geneIds: string[];
}

export interface GeneAnnotation {
  chromosomeId: string;
  geneId: string;
  // tool: string;
  evalue: number;
  score: number;
  seed_ortholog: string;
  description: string;
  preferredName: string;
}

export interface AnnotationsResponse {
  results: GeneAnnotation[];
}

export interface ExpressionRequest {
  species: string;
  experimentId: number;
  geneIds: string[];
}

export interface GeneInfo {
  chromosomeId: string;
  geneId: string;
}

export interface SampleInfo {
  experiment: string;
  sampleId: string;
  reference: string;
  sequencingId: string;
  condition: string;
}

export interface ExpressionResponse {
  genes: GeneInfo[];
  samples: SampleInfo[];
  values: number[];
}

// export const baseUrl = "http://localhost:8000";
// export const baseUrl = process.env.NODE_ENV === 'development'
// ? 'http://localhost:8000'
// : 'https://plantgenie.upsc.se/api';

// export const baseUrl = import.meta.env.DEV
//   ? "http://localhost:8000"
//   : "https://plantgenie.upsc.se/api";

// this may or may not work :D
export const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${url}`);

  if (!response.ok) {
    // const errorResponse = await response.json();
    throw new Error(`Network request (get) to ${baseUrl}${url}`);
  }

  return (await response.json()) as Promise<T>;
};

export const post = async <U, T>(url: string, body: U): Promise<T> => {
  const response = await fetch(
    new Request(`${baseUrl}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
  );

  if (!response.ok)
    throw new Error(
      `Network request (post) to ${baseUrl}${url} with body ${JSON.stringify(
        body
      )} failed`
    );

  return (await response.json()) as Promise<T>;
};
