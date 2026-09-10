import { useEffect, useState } from "react";
import { KeyboardIcon, XIcon } from "@phosphor-icons/react";
import { SHORTCUT_DEFS } from "@/store/shortcuts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex min-w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-medium leading-none text-white shadow-sm">
      {children}
    </kbd>
  );
}

function ShortcutKeys({ shortcut }: { shortcut: string }) {
  const normalized = shortcut.trim().toLowerCase();
  if (normalized === "?") {
    return (
      <span className="flex items-center gap-1">
        <Kbd>?</Kbd>
        <span className="text-[11px] text-white/30">or</span>
        <Kbd>Shift</Kbd>
        <span className="text-white/30">+</span>
        <Kbd>/</Kbd>
      </span>
    );
  }
  if (normalized.includes(" ")) {
    const [a, b] = normalized.split(" ");
    return (
      <span className="flex items-center gap-1.5">
        <Kbd>{a}</Kbd>
        <span className="text-xs text-white/30">then</span>
        <Kbd>{b}</Kbd>
      </span>
    );
  }
  if (normalized === "/") return <Kbd>/</Kbd>;
  // single letter shortcuts
  return <Kbd>{normalized}</Kbd>;
}

export function ShortcutsModal({ isOpen, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      return () => cancelAnimationFrame(id);
    } else {
      setOpen(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const grouped = ["Navigation", "Practice", "General"] as const;

  return (
    <div
      data-open={open}
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-sm transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 data-[open=true]:opacity-100"
      onClick={onClose}
    >
      <div
        data-open={open}
        onClick={(e) => e.stopPropagation()}
        className="my-4 sm:my-8 h-fit max-h-[90vh] sm:max-h-[85vh] w-full max-w-xl overflow-hidden rounded-xl bg-[#1e1f22] shadow-sm ring-1 ring-white/[0.06] origin-center transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 scale-[0.96] translate-y-2 data-[open=true]:opacity-100 data-[open=true]:scale-100 data-[open=true]:translate-y-0 flex flex-col"
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-5 py-4">
          <h2 className="flex items-center gap-3 text-[15px] font-medium leading-5 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white">
              <KeyboardIcon size={16} weight="bold" />
            </span>
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/15 active:scale-95"
          >
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-white/[0.06]">
            {grouped.map((cat) => (
              <div key={cat} className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#949ba4]">{cat}</div>
                <div className="mt-3 space-y-0 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-[#1e1f22]">
                  {SHORTCUT_DEFS.filter((d) => d.category === cat).map((def) => (
                    <div key={def.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium leading-5 text-white">{def.label}</div>
                        <div className="text-[13px] leading-4 text-[#949ba4]">{def.description}</div>
                      </div>
                      <div className="shrink-0">
                        <ShortcutKeys shortcut={def.defaultKey} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-3">
            <p className="text-xs leading-relaxed text-[#949ba4]">
              Press <Kbd>g</Kbd> then a second key for navigation. Shortcuts are disabled while typing. Press <Kbd>?</Kbd> anywhere to open this.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-[#1e1f22] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
