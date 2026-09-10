import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ReloadPrompt } from "@/components/ReloadPrompt";
import { useState } from "react";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function RootComponent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  useKeyboardShortcuts(() => setShowShortcuts(true));

  // Also allow `?` from global listener to toggle
  return (
    <div className="min-h-screen bg-[#101215] text-white antialiased dark">
      <Header />
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        <main className="w-full flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ReloadPrompt />
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
