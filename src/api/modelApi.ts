import axios, { AxiosError } from "axios";
import useSWR from "swr";
import type { GetModelsResponse } from "@shared/types";

const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  dedupingInterval: Infinity,
  revalidateIfStale: false,
} as const;

export async function getAiModels(): Promise<GetModelsResponse | null> {
  const response = await axios.get<GetModelsResponse | null>("/api/models");
  return response.data;
}

export const useGetAiModelsApi = () => {
  return useSWR<GetModelsResponse | null, AxiosError>(
    "ai-models",
    getAiModels,
    SWR_CONFIG,
  );
};
