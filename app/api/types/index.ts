//backend services types

export interface Destination {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
}

export interface DestinationEmbedding {
  id: number;
  text: string;
  embedding: number[];
}

export interface LLMReasonResult {
  id: number;
  reason: string;
}

export interface MatchedDestination extends Destination {
  reason: string;
}

export interface processQueryResponse {
  status: number;
  message?: string;
  error?: string;
}



