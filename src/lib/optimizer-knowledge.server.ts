import { composeKnowledge } from "@/lib/knowledge/compose";
import { CORE_SECTIONS } from "@/lib/knowledge/core-sections";
import { GPT6_ASTRA_GUIDANCE } from "@/lib/knowledge/gpt-6-astra-guidance";

export const OPTIMIZER_KNOWLEDGE: string = composeKnowledge(
  CORE_SECTIONS,
  GPT6_ASTRA_GUIDANCE,
  "constraint-libraries",
);
