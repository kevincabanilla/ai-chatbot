import { useLocation } from "react-router";

export function useUrlHash(raw = false) {
  const { hash } = useLocation();
  if (raw) return hash;
  return !hash ? "" : decodeURIComponent(hash.slice(1));
}
