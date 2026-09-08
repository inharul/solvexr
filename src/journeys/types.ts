export type JourneyCategory =
  | "recognition"
  | "basic-facts"
  | "strategies"
  | "scale"
  | "fluency";

export type JourneyGroup = "multiplication" | "division" | "addition" | "subtraction";

export type OperationKey = "addition" | "substraction" | "multiplication" | "division";

export interface PracticeConfig {
  operation: OperationKey;
  /**
   * When set, the second operand is fixed to this value.
   * Maps to existing `manualNumber` + `manualEnabled` concept.
   */
  manualNumber?: number;
  /**
   * Range max values for number generation.
   * Maps to existing `numberOneRange` / `numberTwoRange`.
   * e.g. 10 = 1-digit, 100 = 2-digit, 1000 = 3-digit
   */
  numberOneRange?: number;
  numberTwoRange?: number;
  /**
   * For division nodes where we need integer results,
   * ensure dividend is divisible by divisor.
   */
  ensureIntegerDivision?: boolean;
}

export interface JourneyNode {
  id: string;
  title: string;
  description: string;
  group: JourneyGroup;
  category: JourneyCategory;
  practiceConfig: PracticeConfig;
  prerequisites: string[];
  // strategy note for display only, not used for evaluation
  strategyNote?: string;
}

export interface MasteryStats {
  bestAccuracy: number; // 0..1
  averageTime: number; // seconds
  totalQuestions: number;
  totalCorrect: number;
  mastered: boolean;
  // how many sessions completed
  attempts?: number;
  // total time sum for overall average if needed
  totalTime?: number;
}

export interface SessionStats {
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number; // 0..1
  averageTime: number; // seconds
  responseTimes: number[]; // seconds per question
}
