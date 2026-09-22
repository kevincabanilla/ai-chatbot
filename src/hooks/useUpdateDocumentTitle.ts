import { useEffect } from "react";

export const useUpdateDocumentTitle = (title: string): void => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
