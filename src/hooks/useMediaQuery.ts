import { useSyncExternalStore } from "react";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const MEDIA_QUERIES = {
  md: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
} as const;

const getMql = (query: string) =>
  typeof window !== "undefined" && typeof window.matchMedia !== "undefined"
    ? window.matchMedia(query)
    : null;

const subscribe = (query: string) => (callback: () => void) => {
  const mql = getMql(query);
  if (!mql) return () => undefined;

  const handler = () => {
    callback();
  };

  mql.addEventListener("change", handler);
  return () => {
    mql.removeEventListener("change", handler);
  };
};

const getSnapshot = (query: string) => () => {
  const mql = getMql(query);
  return mql?.matches ?? false;
};

export const useMediaQuery = (query: string = MEDIA_QUERIES.md): boolean => {
  return useSyncExternalStore(
    subscribe(query),
    getSnapshot(query),
    () => false, // SSR fallback
  );
};
