import useSWRMutation from "swr/mutation";
import type { GenerateTitleRequest } from "@shared/types";
import { generateTitle } from "@/api/generateTitleApi";

export function useTitleGenerator() {
  const { trigger, isMutating } = useSWRMutation(
    "generate-title",
    (_, { arg }: { arg: GenerateTitleRequest }) => generateTitle(arg),
  );

  const callApi = async (request: GenerateTitleRequest) => {
    const title = await trigger(request);
    return title;
  };

  return { generateTitle: callApi, isMutating };
}
