export const AI_SKILL = {
  DEFAULT: "You are a helpful assistant. Answer clearly and concisely.",

  CODING:
    "You are an expert software engineer. Provide clean TypeScript solutions.",
} as const;

export type AISkill = keyof typeof AI_SKILL;
export type AISkillValues = (typeof AI_SKILL)[AISkill];
