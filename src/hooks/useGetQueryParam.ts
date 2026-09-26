import { useSearchParams } from "react-router";

export const QUERY_PARAM = {
  ChatId: "c",
} as const;

export type QUERY_PARAM_KEYS = keyof typeof QUERY_PARAM;
export type QUERY_PARAM_VALUES = (typeof QUERY_PARAM)[QUERY_PARAM_KEYS];

export const useGetQueryParam = (query: QUERY_PARAM_VALUES) => {
  const [searchParams] = useSearchParams();
  return searchParams.get(query);
};
