import { BrainCircuit, CodeXml } from "lucide-react";
import { AI_SKILL, type AISkill } from "@shared/ai/skills";
import type { AiModeDetail } from "@/interfaces";

/**
 * The GitHub URL of this project
 */
export const GITHUB_URL = "https://github.com/kevincabanilla/ai-chatbot";

/**
 * List of available AI Modes
 */
export const AI_MODES = Object.keys(AI_SKILL) as AISkill[];

/**
 * AI mode details to display in the UI for selection.
 */
export const AI_MODE_DETAILS: Record<AISkill, AiModeDetail> = {
  GENERAL: {
    label: "General",
    description: "A thoughtful all-rounder for everyday questions and ideas.",
    icon: BrainCircuit,
    iconColor: "text-sky-300",
  },
  CODING: {
    label: "Coding",
    description: "Focused help for building, debugging, and shipping software.",
    icon: CodeXml,
    iconColor: "text-amber-300",
  },
};
