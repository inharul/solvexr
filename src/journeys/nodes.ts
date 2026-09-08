import type { JourneyNode, JourneyGroup, JourneyCategory } from "./types";

/**
 * Declarative node definitions.
 * Architecture is data-driven: adding a new node is just adding an entry here.
 * Reuses existing arithmetic concepts: operation, manualNumber, number ranges.
 */
export const JOURNEY_NODES: JourneyNode[] = [
  // ── Multiplication: Recognition ──
  {
    id: "multiplication-x2",
    title: "Double Trouble",
    description: "Multiply a number by 2",
    group: "multiplication",
    category: "recognition",
    practiceConfig: {
      operation: "multiplication",
      manualNumber: 2,
      numberOneRange: 100,
      ensureIntegerDivision: false,
    },
    prerequisites: [],
    strategyNote: "Doubling",
  },
  {
    id: "multiplication-x5",
    title: "High Five",
    description: "Multiply a number by 5",
    group: "multiplication",
    category: "recognition",
    practiceConfig: {
      operation: "multiplication",
      manualNumber: 5,
      numberOneRange: 100,
    },
    prerequisites: [],
  },
  {
    id: "multiplication-x10",
    title: "Power of Ten",
    description: "Multiply a number by 10",
    group: "multiplication",
    category: "recognition",
    practiceConfig: {
      operation: "multiplication",
      manualNumber: 10,
      numberOneRange: 100,
    },
    prerequisites: [],
  },
  // ── Multiplication: Basic Facts ──
  {
    id: "multiplication-1x1",
    title: "Fact Frenzy",
    description: "Multiply two single-digit numbers",
    group: "multiplication",
    category: "basic-facts",
    practiceConfig: {
      operation: "multiplication",
      numberOneRange: 10,
      numberTwoRange: 10,
    },
    prerequisites: ["multiplication-x2", "multiplication-x5", "multiplication-x10"],
  },
  // ── Multiplication: Strategies ──
  {
    id: "multiplication-x4",
    title: "Double Double",
    description: "Multiply a number by 4 by doubling it twice",
    group: "multiplication",
    category: "strategies",
    practiceConfig: {
      operation: "multiplication",
      manualNumber: 4,
      numberOneRange: 100,
    },
    prerequisites: ["multiplication-1x1"],
    strategyNote: "double twice",
  },
  {
    id: "multiplication-x9",
    title: "Nine Lives",
    description: "Multiply a number by 9 using 10 times the number minus the original number",
    group: "multiplication",
    category: "strategies",
    practiceConfig: {
      operation: "multiplication",
      manualNumber: 9,
      numberOneRange: 100,
    },
    prerequisites: ["multiplication-1x1"],
    strategyNote: "×10 − original",
  },
  {
    id: "multiplication-distributive",
    title: "Break & Conquer",
    description: "Multiply by breaking a number into smaller parts and multiplying each part separately",
    group: "multiplication",
    category: "strategies",
    practiceConfig: {
      operation: "multiplication",
      numberOneRange: 100,
      numberTwoRange: 10,
    },
    prerequisites: ["multiplication-x4", "multiplication-x9"],
    strategyNote: "distributive",
  },
  // ── Multiplication: Scale ──
  {
    id: "multiplication-2x1",
    title: "Big Little",
    description: "Multiply a two-digit number by a single-digit number",
    group: "multiplication",
    category: "scale",
    practiceConfig: {
      operation: "multiplication",
      numberOneRange: 100,
      numberTwoRange: 10,
    },
    prerequisites: ["multiplication-distributive"],
  },
  {
    id: "multiplication-2x2",
    title: "Double Digits",
    description: "Multiply two two-digit numbers",
    group: "multiplication",
    category: "scale",
    practiceConfig: {
      operation: "multiplication",
      numberOneRange: 100,
      numberTwoRange: 100,
    },
    prerequisites: ["multiplication-2x1"],
  },
  // ── Multiplication: Fluency ──
  {
    id: "multiplication-mixed",
    title: "Mix Master",
    description: "Solve mixed multiplication problems using any multiplication skill learned so far",
    group: "multiplication",
    category: "fluency",
    practiceConfig: {
      operation: "multiplication",
      numberOneRange: 100,
      numberTwoRange: 100,
    },
    prerequisites: ["multiplication-2x2"],
  },

  // ── Division: Recognition ──
  {
    id: "division-d2",
    title: "Halfway There",
    description: "Divide a number by 2",
    group: "division",
    category: "recognition",
    practiceConfig: {
      operation: "division",
      manualNumber: 2,
      numberOneRange: 100,
      ensureIntegerDivision: true,
    },
    prerequisites: [],
  },
  {
    id: "division-d5",
    title: "Split by Five",
    description: "Divide a number by 5",
    group: "division",
    category: "recognition",
    practiceConfig: {
      operation: "division",
      manualNumber: 5,
      numberOneRange: 100,
      ensureIntegerDivision: true,
    },
    prerequisites: [],
  },
  {
    id: "division-d10",
    title: "Power of Ten",
    description: "Divide a number by 10",
    group: "division",
    category: "recognition",
    practiceConfig: {
      operation: "division",
      manualNumber: 10,
      numberOneRange: 100,
      ensureIntegerDivision: true,
    },
    prerequisites: [],
  },
  // ── Division: Basic Facts ──
  {
    id: "division-1d1",
    title: "Division Dash",
    description: "Divide one single-digit number by another single-digit number with no remainder",
    group: "division",
    category: "basic-facts",
    practiceConfig: {
      operation: "division",
      numberOneRange: 10,
      numberTwoRange: 10,
      ensureIntegerDivision: true,
    },
    prerequisites: ["division-d2", "division-d5", "division-d10"],
  },
];

export const JOURNEY_NODE_MAP: Record<string, JourneyNode> = Object.fromEntries(
  JOURNEY_NODES.map((n) => [n.id, n]),
);

export function getNodeById(id: string): JourneyNode | undefined {
  return JOURNEY_NODE_MAP[id];
}

export const JOURNEY_GROUPS: JourneyGroup[] = ["multiplication", "division"];
export const JOURNEY_CATEGORIES: JourneyCategory[] = [
  "recognition",
  "basic-facts",
  "strategies",
  "scale",
  "fluency",
];

export const CATEGORY_LABELS: Record<JourneyCategory, string> = {
  recognition: "Recognition",
  "basic-facts": "Basic Facts",
  strategies: "Strategies",
  scale: "Scale",
  fluency: "Fluency",
};

export const GROUP_LABELS: Record<JourneyGroup, string> = {
  multiplication: "Multiplication",
  division: "Division",
  addition: "Addition",
  subtraction: "Subtraction",
};
