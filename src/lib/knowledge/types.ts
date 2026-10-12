export type KnowledgeSection = {
  id: string;
  heading: string;
  body: string;
};

export type BehaviorNote = {
  id: string;
  title: string;
  observation: string;
  optimizationRule: string;
  source: string;
};

export type StarterPrompt = {
  id: string;
  concern: string;
  useWhen: string;
  source: string;
  prompt: string;
  note?: string;
};

export type ModelGuidance = {
  id: string;
  modelFamily: string;
  heading: string;
  scope: string;
  trigger: string;
  selectionRule: string;
  adaptationNote: string;
  behaviors: readonly BehaviorNote[];
  starterPrompts: readonly StarterPrompt[];
};
