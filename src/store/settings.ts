import { create } from "zustand";
import { persist } from "zustand/middleware";

type Operations = Record<string, boolean>;

interface SettingsState {
  timeControl: string;
  numberOneRange: number;
  numberTwoRange: number;
  maunalNumber: number;
  manualEnabled: boolean;
  operations: Operations;
  changeStorage: (key: string, value: unknown) => void;
  changeRanges: (num: number, nv: string) => void;
  changeOperations: (element: string, newState: boolean) => void;
  getOperation: () => string;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      timeControl: "2",
      numberOneRange: 100,
      numberTwoRange: 100,
      maunalNumber: 2,
      manualEnabled: false,
      operations: {
        addition: false,
        substraction: false,
        multiplication: true,
        division: false,
      },
      changeStorage: (key, value) =>
        set(() => {
          if (key === "timeControl") return { timeControl: value as string };
          if (key === "manualEnabled") return { manualEnabled: value as boolean };
          if (key === "manualNumber") return { maunalNumber: Number(value) };
          return {};
        }),
      changeRanges: (num, nv) =>
        set(() => (num === 1 ? { numberOneRange: parseInt(nv) } : { numberTwoRange: parseInt(nv) })),
      changeOperations: (element, newState) =>
        set((s) => {
          if (!(element in s.operations)) {
            console.error("invalid operation", element);
            return {};
          }
          const enabled = Object.keys(s.operations).filter((k) => s.operations[k]);
          if (enabled.length === 1 && !newState) return {};
          return { operations: { ...s.operations, [element]: newState } };
        }),
      getOperation: () => {
        const { operations } = get();
        const enabled = Object.keys(operations).filter((k) => operations[k]);
        const key = enabled[Math.floor(Math.random() * enabled.length)];
        switch (key) {
          case "addition":
            return "+";
          case "substraction":
            return "-";
          case "multiplication":
            return "*";
          case "division":
            return "/";
          default:
            return "+";
        }
      },
    }),
    { name: "solvexr-settings" }
  )
);
