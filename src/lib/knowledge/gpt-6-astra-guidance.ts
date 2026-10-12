import type { ModelGuidance } from "./types";

const SOURCE_INITIATIVE =
  "https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-initiative-and-follow-through";
const SOURCE_INSTRUCTION =
  "https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-instruction-following";
const SOURCE_STYLE =
  "https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-personality-and-writing-style";
const SOURCE_SUBAGENT =
  "https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-subagent-delegation";
const SOURCE_TESTING =
  "https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-testing-and-verification";

export const GPT6_ASTRA_GUIDANCE: ModelGuidance = {
  id: "model-guidance-gpt-6-astra",
  modelFamily: "GPT-6",
  heading: "MODEL FAMILY PROMPTING GUIDANCE — GPT-6 ASTRA",
  scope: `Prompting best practices for the GPT-6 model family. The starter prompts address behavior observed with GPT-6 Astra; evaluate them with the chosen model and workload.`,
  trigger: `Apply this guidance only when the raw prompt names GPT-6 Astra or the GPT-6 model family, or asks for behavior tuning this section covers: autonomy versus clarification, skill and AGENTS.md sensitivity, response formatting style, subagent delegation, test breadth. Without such a trigger, keep the optimized prompt model agnostic and ignore this section.`,
  selectionRule: `Choose only the starter prompts whose concern matches the behavior the raw prompt addresses. Merge their operative sentences into the optimized prompt, adapted to the task wording. Combine overlapping prompts. Never select prompts for behaviors the raw prompt leaves untouched. Keep every operative requirement of every selected prompt. Never name GPT-6 Astra in the optimized prompt unless the raw prompt names it.`,
  adaptationNote: `Starter prompts are starting points, not fixed text: adapt their wording to the task, tune the autonomy level to the application, and evaluate the result against the chosen model and workload.`,
  behaviors: [
    {
      id: "initiative-and-follow-through",
      title: "Initiative and follow-through",
      observation: `The model is designed to be a more effective collaborator and is thus more likely to ask the user a question when additional input could materially change the result. This can cause it to stop when the user may expect it to make reasonable assumptions and persist. It is generally better than GPT-5.6 Sol and earlier models at staying coherent during long tasks, and it also asks non-blocking questions while working by default.`,
      optimizationRule: `When the raw prompt wants autonomous execution, add initiative rules and set the approval policy to the level the task implies. When the raw prompt wants deliberate confirmation, add no autonomy rules. Make the required autonomy level explicit so the model does not stop for input the task does not need.`,
      source: SOURCE_INITIATIVE,
    },
    {
      id: "instruction-following",
      title: "Instruction following",
      observation: `The model is stronger at general instruction following than previous models, giving greater control over its behavior. It can be more sensitive to instructions contained in skills and other files, such as \`AGENTS.md\`. Unclear or conflicting guidance in a skill file may cause the model to pause and block work early. Auditing skills and other files accessible to the model for instructions that could influence its behavior is strongly recommended.`,
      optimizationRule: `When the raw prompt involves skills or agent instruction files, make user instruction precedence explicit, require the model to name and link the exact skill file and quote the instruction behind any pause or direction change, and surface silent conflicts between loaded skills and user instructions.`,
      source: SOURCE_INSTRUCTION,
    },
    {
      id: "personality-and-writing-style",
      title: "Personality and writing style",
      observation: `The model tends toward detailed, formatted responses and may use recurring phrases across sessions. It tends to use lists, tables and Markdown to make responses scannable.`,
      optimizationRule: `When the raw prompt states a writing style or structure, encode it as hard constraints. When the raw prompt wants prose with less formatting, add the prose style starter prompt. When the raw prompt wants technical communication, add the plain language starter prompt. When the raw prompt wants to cut jargon and stock phrases, add the slop words starter prompt.`,
      source: SOURCE_STYLE,
    },
    {
      id: "subagent-delegation",
      title: "Subagent delegation",
      observation: `The model is trained to divide and delegate work to subagents that work in parallel, but it may delegate less often than desired for a workflow. It responds well to prompting for how and when it should delegate work to subagents. Inter-agent messages may contain grammar or spacing errors.`,
      optimizationRule: `When the raw prompt involves parallel work or multi-agent execution, specify when and how much the model should use subagents, tuned to the harness and multi-agent implementation, and add message legibility rules for agent-to-agent messages and final answers.`,
      source: SOURCE_SUBAGENT,
    },
    {
      id: "testing-and-verification",
      title: "Testing and verification",
      observation: `For coding tasks, the model tends to be thorough in testing before considering a task complete. For smaller tasks, this can result in broader tests than the task requires.`,
      optimizationRule: `When the raw prompt involves code changes, calibrate testing and verification to the change size: meaningful and necessary tests only, required checks completed, broader or repeated testing only when new changes, failures, or unresolved concerns justify it.`,
      source: SOURCE_TESTING,
    },
  ],
  starterPrompts: [
    {
      id: "initiative-autonomy",
      concern: "autonomous execution and follow-through",
      useWhen:
        "the raw prompt wants the model to infer intent, act, and persist to completion instead of pausing for input",
      source: SOURCE_INITIATIVE,
      prompt: `You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.`,
    },
    {
      id: "initiative-action-intent",
      concern: "phrasing that implies authorization",
      useWhen: `the raw prompt uses action-implying phrasing such as "can you...", "I want to...", "help me..." that must trigger execution instead of an acknowledgment, a plan, or a partial result`,
      note: `The model is more likely to ask for clarification when the user's intent is unclear; this prompt ties implied authorization to action.`,
      source: SOURCE_INITIATIVE,
      prompt: `When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.`,
    },
    {
      id: "initiative-approval-last",
      concern: "approval after a concrete result",
      useWhen:
        "the workflow needs user approval as the final step after all authorized preparatory work is done",
      note: `Prompt the model to ask for approval only after preparing a concrete, reviewable result. This avoids blocking the task before the model has done the work it can, and often leads to quicker task completion.`,
      source: SOURCE_INITIATIVE,
      prompt: `Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.`,
    },
    {
      id: "instruction-precedence",
      concern: "user instructions over skill files",
      useWhen:
        "the raw prompt involves skills or instruction files that could conflict with the user's instructions",
      note: "Make the priority of user instructions and skills explicit.",
      source: SOURCE_INSTRUCTION,
      prompt: `The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.`,
    },
    {
      id: "skill-transparency",
      concern: "transparency when a skill changes behavior",
      useWhen: `the application loads many skills and instruction files such as \`AGENTS.md\` and silent or conflicting guidance must surface`,
      note: `Asking the model to identify the skill and instruction that caused it to pause or change direction can also be effective in providing transparency into model behavior. Use this prompt to find silent and conflicting guidance when your application loads many skills and instruction files such as \`AGENTS.md\`.`,
      source: SOURCE_INSTRUCTION,
      prompt: `If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact \`SKILL.md\` file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.`,
    },
    {
      id: "style-prose",
      concern: "prose over formatted responses",
      useWhen: "the raw prompt wants clear prose with less formatting and a defined structure",
      note: `The model tends to use lists, tables and Markdown to make responses scannable; this prompt counters that default.`,
      source: SOURCE_STYLE,
      prompt: `Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.`,
    },
    {
      id: "style-technical-plain-language",
      concern: "technical communication in plain language",
      useWhen:
        "the raw prompt asks for technical communication calibrated to the user's background knowledge",
      note: `For technical communication, this prompt helps strike a balance between using clear, coherent language while remaining domain appropriate.`,
      source: SOURCE_STYLE,
      prompt: `Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.`,
    },
    {
      id: "style-no-slop",
      concern: "removing jargon and stock phrases",
      useWhen:
        "the raw prompt asks to reduce jargon, stock phrases, or canned structures in writing",
      note: "To reduce jargon and stock phrases in writing, start with this prompt.",
      source: SOURCE_STYLE,
      prompt: `Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.`,
    },
    {
      id: "subagent-parallel-delegation",
      concern: "parallel work through subagents",
      useWhen:
        "the raw prompt runs in a multi-agent harness and should delegate parallelizable work",
      note: `The model tends to respond well to prompting for how and when it should delegate work to subagents, so tune this behavior to fit with your harness and multi-agent implementation.`,
      source: SOURCE_SUBAGENT,
      prompt: `If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.`,
    },
    {
      id: "subagent-message-legibility",
      concern: "legible inter-agent messages",
      useWhen: "the raw prompt involves agent-to-agent messages or final answers that humans read",
      note: `Messages between agents may contain grammar or spacing errors. Use this prompt to make inter-agent messages easier to read.`,
      source: SOURCE_SUBAGENT,
      prompt: `Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.`,
    },
    {
      id: "testing-scope",
      concern: "calibrated testing and verification",
      useWhen:
        "the raw prompt involves code changes and the amount of testing must match the change size",
      note: `For coding tasks, calibrate how much testing and verification a change requires. This can help avoid unnecessary tests or repeated checks for small changes.`,
      source: SOURCE_TESTING,
      prompt: `Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.`,
    },
  ],
};
