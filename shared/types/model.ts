export interface AiModel {
  id: string;
  created: number;
  ownedBy: string;
}

export interface GetModelsResponse {
  models: AiModel[];
}
