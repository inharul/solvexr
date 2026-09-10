import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SHORTCUTS } from "@/store/shortcuts";

function isTypingTarget(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (t.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(
  onHelp?: () => void,
  onResetPractice?: () => void,
  opts?: { skipNavigation?: boolean }
) {
  const navigate = useNavigate();
  const shortcuts = SHORTCUTS;
  const lastG = useRef<number>(0);
  const lastGTimer = useRef<number | null>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const target = e.target;
      const typing = isTypingTarget(target);

      let key = e.key.toLowerCase();
      const isQuestion = e.key === "?" || (e.key === "/" && e.shiftKey);
      const combo = (() => {
        if (isQuestion) return "?";
        if (e.ctrlKey || e.metaKey || e.altKey) {
          const parts: string[] = [];
          if (e.ctrlKey) parts.push("ctrl");
          if (e.metaKey) parts.push("meta");
          if (e.altKey) parts.push("alt");
          if (e.shiftKey && key.length > 1) parts.push("shift");
          parts.push(key);
          return parts.join("+");
        }
        return key;
      })();

      const helpKey = shortcuts.help ?? "?";
      if (combo === helpKey || (isQuestion && helpKey === "?")) {
        if (!typing) {
          e.preventDefault();
          onHelp?.();
          return;
        }
      }

      if (typing) {
        const focusKey = shortcuts.focus_answer ?? "/";
        if (combo === focusKey) return;
        if (e.key === "Escape") (target as HTMLElement).blur();
        return;
      }

      if (key === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        lastG.current = Date.now();
        if (lastGTimer.current) window.clearTimeout(lastGTimer.current);
        lastGTimer.current = window.setTimeout(() => {
          lastG.current = 0;
        }, 1000) as unknown as number;
        return;
      }

      const withinG = Date.now() - lastG.current < 1000;

      const check = (shortcutKey: string): boolean => {
        const sk = (shortcutKey ?? "").toLowerCase().trim();
        if (!sk) return false;
        if (sk.includes(" ")) {
          const [first, second] = sk.split(" ");
          return withinG && first === "g" && second === key;
        }
        return sk === combo || sk === key;
      };

      if (!opts?.skipNavigation) {
        if (check(shortcuts.nav_home)) {
          e.preventDefault();
          lastG.current = 0;
          navigate({ to: "/" });
          return;
        }
        if (check(shortcuts.nav_practice)) {
          e.preventDefault();
          lastG.current = 0;
          navigate({ to: "/app" });
          return;
        }
        if (check(shortcuts.nav_journeys)) {
          e.preventDefault();
          lastG.current = 0;
          navigate({ to: "/journeys" });
          return;
        }
        if (check(shortcuts.nav_settings)) {
          e.preventDefault();
          lastG.current = 0;
          navigate({ to: "/settings" });
          return;
        }
      }
      if (check(shortcuts.focus_answer)) {
        const el = document.querySelector<HTMLInputElement>('input[name="answer"]');
        if (el) {
          e.preventDefault();
          el.focus();
          el.select();
        }
        return;
      }
      if (check(shortcuts.reset_practice)) {
        e.preventDefault();
        onResetPractice?.();
        return;
      }
    };

    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
      if (lastGTimer.current) window.clearTimeout(lastGTimer.current);
    };
  }, [navigate, onHelp, onResetPractice, opts?.skipNavigation]);
}
