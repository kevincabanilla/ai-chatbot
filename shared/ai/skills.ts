export const AI_SKILL = {
  GENERAL: "GENERAL",
  CODING: "CODING",
} as const;

export type AISkill = keyof typeof AI_SKILL;
export type AISkillValues = (typeof AI_SKILL)[AISkill];
