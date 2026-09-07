import { useRegisterSW } from "virtual:pwa-register/react";

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // eslint-disable-next-line no-console
      console.log(`SW registered: ${swUrl}`);
      if (r) {
        // Check for updates every hour (production)
        setInterval(
          () => {
            r.update().catch(() => {});
          },
          60 * 60 * 1000,
        );
      }
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Offline ready toast (non-blocking, auto-dismiss)
  if (offlineReady && !needRefresh) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#1e1f22] px-4 py-3 shadow-2xl animate-[slide-up_0.3s_ease-out] sm:bottom-6 sm:left-auto sm:right-6 sm:w-full"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">Ready to work offline</span>
          <span className="text-xs text-white/60">App cached for offline use</span>
        </div>
        <button
          type="button"
          onClick={close}
          className="shrink-0 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/15"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (!needRefresh) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-update-title"
      aria-describedby="pwa-update-desc"
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 sm:bottom-6 sm:p-0"
    >
      {/* Backdrop for mobile - subtle */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] sm:hidden" onClick={close} aria-hidden="true" />

      <div className="relative flex w-full max-w-lg items-start gap-4 rounded-xl border border-white/10 bg-[#1e1f22] p-4 shadow-2xl animate-[slide-up_0.35s_cubic-bezier(0,0,0.58,1)] sm:rounded-lg sm:p-5">
        {/* Icon accent */}
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#079697]/15 text-[#079697] sm:flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v-5" />
          </svg>
        </div>

        <div className="flex-1">
          <h2 id="pwa-update-title" className="text-sm font-semibold text-white sm:text-[15px]">
            New version available
          </h2>
          <p id="pwa-update-desc" className="mt-1 text-xs leading-relaxed text-white/60 sm:text-sm">
            A new version of SolvexR is ready. Reload to get the latest features and fixes.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="inline-flex items-center justify-center rounded-md bg-[#079697] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0ab3b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#079697] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1f22]"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Later
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Dismiss update notification"
          className="absolute right-2 top-2 rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white sm:static sm:ml-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <style>{`@keyframes slide-up { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </div>
  );
}
