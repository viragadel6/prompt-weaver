import type { KnowledgeSection, ModelGuidance, StarterPrompt } from "./types";

export function renderSections(sections: readonly KnowledgeSection[]): string {
  return sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
}

export function insertAfterSection(
  sections: readonly KnowledgeSection[],
  afterId: string,
  section: KnowledgeSection,
): KnowledgeSection[] {
  const index = sections.findIndex((candidate) => candidate.id === afterId);
  if (index === -1) {
    return [...sections, section];
  }
  return [...sections.slice(0, index + 1), section, ...sections.slice(index + 1)];
}

export function renderModelGuidance(guidance: ModelGuidance): KnowledgeSection {
  const behaviorBlocks = guidance.behaviors.map(
    (behavior) =>
      `${behavior.title}: ${behavior.observation}\nOptimization rule: ${behavior.optimizationRule}\nSource: ${behavior.source}`,
  );
  const starterPromptBlocks = guidance.starterPrompts.map(renderStarterPrompt);
  return {
    id: guidance.id,
    heading: guidance.heading,
    body: [
      `Model family: ${guidance.modelFamily}`,
      `Scope: ${guidance.scope}`,
      `Trigger: ${guidance.trigger}`,
      `Selection: ${guidance.selectionRule}`,
      `Adaptation: ${guidance.adaptationNote}`,
      `Behavior notes:\n${behaviorBlocks.join("\n")}`,
      `Starter prompts:\n${starterPromptBlocks.join("\n\n")}`,
    ].join("\n"),
  };
}

export function composeKnowledge(
  sections: readonly KnowledgeSection[],
  guidance: ModelGuidance,
  afterSectionId: string,
): string {
  const merged = insertAfterSection(sections, afterSectionId, renderModelGuidance(guidance));
  return `${renderSections(merged)}\n`;
}

function renderStarterPrompt(entry: StarterPrompt): string {
  const lines = [
    `id: ${entry.id}`,
    `concern: ${entry.concern}`,
    `use when: ${entry.useWhen}`,
    `source: ${entry.source}`,
  ];
  if (entry.note) {
    lines.push(`note: ${entry.note}`);
  }
  lines.push("<prompt>", entry.prompt, "</prompt>");
  return lines.join("\n");
}
