import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MasteryStats, SessionStats } from "@/journeys/types";
import { mergeMasteryStats } from "@/journeys/mastery";

interface JourneysState {
  nodeStats: Record<string, MasteryStats>;
  recordSession: (nodeId: string, session: SessionStats) => void;
  getStats: (nodeId: string) => MasteryStats | undefined;
  isMastered: (nodeId: string) => boolean;
  isUnlocked: (nodeId: string, prerequisites: string[]) => boolean;
  resetNode: (nodeId: string) => void;
  resetAll: () => void;
}

export const useJourneysStore = create<JourneysState>()(
  persist(
    (set, get) => ({
      nodeStats: {},

      recordSession: (nodeId, session) =>
        set((state) => {
          const prev = state.nodeStats[nodeId];
          const next = mergeMasteryStats(prev, session);
          return {
            nodeStats: { ...state.nodeStats, [nodeId]: next },
          };
        }),

      getStats: (nodeId) => get().nodeStats[nodeId],

      isMastered: (nodeId) => !!get().nodeStats[nodeId]?.mastered,

      isUnlocked: () => true,

      resetNode: (nodeId) =>
        set((state) => {
          const next = { ...state.nodeStats };
          delete next[nodeId];
          return { nodeStats: next };
        }),

      resetAll: () => set({ nodeStats: {} }),
    }),
    {
      name: "solvexr-journeys",
      version: 1,
    },
  ),
);
