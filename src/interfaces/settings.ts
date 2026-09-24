import type { LucideIcon } from "lucide-react";

export interface ApplicationSettings {
  initialized: boolean;
  mode: string | null;
  model: string | null;
  streamResponse?: boolean;
}

export interface AiModeDetail {
  label: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}
