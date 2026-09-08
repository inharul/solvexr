import {
  MASTERY_ACCURACY,
  MASTERY_AVERAGE_TIME,
  MASTERY_MIN_QUESTIONS,
} from "./constants";
import type { MasteryStats, SessionStats } from "./types";

/**
 * Mastery Evaluator
 *
 * Architecture:
 *  Existing Practice Engine → Practice Session → Mastery Evaluator → Journey Node → localStorage
 *
 * Mastery requires BOTH:
 *   accuracy = 100%  AND averageTime <= 5s  AND totalQuestions >= 20
 */

export function evaluateMastery(session: SessionStats): boolean {
  return (
    session.totalQuestions >= MASTERY_MIN_QUESTIONS &&
    session.accuracy >= MASTERY_ACCURACY &&
    session.averageTime <= MASTERY_AVERAGE_TIME
  );
}

export function computeSessionStats(
  totalQuestions: number,
  totalCorrect: number,
  responseTimes: number[],
): SessionStats {
  const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
  const averageTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  return {
    totalQuestions,
    totalCorrect,
    totalWrong: totalQuestions - totalCorrect,
    accuracy,
    averageTime,
    responseTimes,
  };
}

/**
 * Progress calculation for visual bar.
 * Two independent progress values → combined overall.
 * Mastered boolean is determined ONLY by evaluateMastery, not by progress.
 */
export function calculateProgress(stats: MasteryStats | undefined): {
  accuracyProgress: number;
  speedProgress: number;
  overall: number;
} {
  if (!stats || stats.totalQuestions === 0) {
    return { accuracyProgress: 0, speedProgress: 0, overall: 0 };
  }
  // Accuracy progress: 0..1 (only 1.0 is fully mastered)
  const accuracyProgress = Math.min(1, stats.bestAccuracy);

  // Speed progress: reaches 1 when averageTime <= target
  // For no time data, speedProgress is 0
  // If mastered time is 0 (no data) treat as 0
  let speedProgress = 0;
  if (stats.averageTime > 0) {
    if (stats.averageTime <= MASTERY_AVERAGE_TIME) speedProgress = 1;
    else {
      // Linear decay: for avgTime > target, progress decreases
      // At target*2 (10s), speedProgress = 0.5 ; at 15s = 0.33 etc
      // Simpler: target / averageTime
      speedProgress = Math.max(0, Math.min(1, MASTERY_AVERAGE_TIME / stats.averageTime));
    }
  }

  // Overall: average of both, capped at 1
  // Alternative considered: multiplied, but average is more understandable
  const overall = Math.min(1, (accuracyProgress + speedProgress) / 2);

  return { accuracyProgress, speedProgress, overall };
}

export function getProgressPercent(stats: MasteryStats | undefined): number {
  const { overall } = calculateProgress(stats);
  return Math.round(overall * 100);
}

/**
 * Merge session stats into persisted mastery stats
 * Business rule: bestAccuracy is max, averageTime tracks the time of the best session (or fastest if tied)
 */
export function mergeMasteryStats(
  prev: MasteryStats | undefined,
  session: SessionStats,
): MasteryStats {
  const prevStats: MasteryStats = prev ?? {
    bestAccuracy: 0,
    averageTime: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    mastered: false,
    attempts: 0,
    totalTime: 0,
  };

  const newBestAccuracy = Math.max(prevStats.bestAccuracy, session.accuracy);
  let newAverageTime = prevStats.averageTime;

  // Update averageTime if this session achieved new best accuracy,
  // or same best accuracy but faster
  if (session.accuracy > prevStats.bestAccuracy) {
    newAverageTime = session.averageTime;
  } else if (
    session.accuracy === prevStats.bestAccuracy &&
    session.accuracy > 0
  ) {
    if (prevStats.averageTime === 0 || session.averageTime < prevStats.averageTime) {
      newAverageTime = session.averageTime;
    }
  } else if (prevStats.bestAccuracy === 0) {
    // first session
    newAverageTime = session.averageTime;
  }

  const isMastered = evaluateMastery(session) || prevStats.mastered;
  // Once mastered, stays mastered (no decay in MVP). But also re-evaluate: if previously mastered, keep true.
  // If session itself meets mastery, set true.

  return {
    bestAccuracy: Number(newBestAccuracy.toFixed(4)),
    averageTime: Number(newAverageTime.toFixed(2)),
    totalQuestions: prevStats.totalQuestions + session.totalQuestions,
    totalCorrect: prevStats.totalCorrect + session.totalCorrect,
    mastered: isMastered,
    attempts: (prevStats.attempts ?? 0) + 1,
    totalTime: (prevStats.totalTime ?? 0) + session.responseTimes.reduce((a, b) => a + b, 0),
  };
}
