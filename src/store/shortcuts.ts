export type ShortcutId =
  | "nav_home"
  | "nav_journeys"
  | "nav_practice"
  | "nav_settings"
  | "help"
  | "focus_answer"
  | "reset_practice";

export interface ShortcutDef {
  id: ShortcutId;
  label: string;
  description: string;
  category: "Navigation" | "Practice" | "General";
  defaultKey: string;
}

export const SHORTCUT_DEFS: ShortcutDef[] = [
  { id: "nav_home", label: "Go Home", description: "Go to home", category: "Navigation", defaultKey: "g h" },
  { id: "nav_practice", label: "Go Practice", description: "Go to practice (timed)", category: "Navigation", defaultKey: "g p" },
  { id: "nav_journeys", label: "Go Journeys", description: "Go to journeys", category: "Navigation", defaultKey: "g j" },
  { id: "nav_settings", label: "Go Settings", description: "Go to settings", category: "Navigation", defaultKey: "g s" },
  { id: "help", label: "Shortcuts help", description: "Open this dialog", category: "General", defaultKey: "?" },
  { id: "focus_answer", label: "Focus answer", description: "Focus answer input", category: "Practice", defaultKey: "/" },
  { id: "reset_practice", label: "Reset session", description: "Reset current practice", category: "Practice", defaultKey: "r" },
];

export const SHORTCUTS: Record<ShortcutId, string> = Object.fromEntries(
  SHORTCUT_DEFS.map((d) => [d.id, d.defaultKey])
) as Record<ShortcutId, string>;
