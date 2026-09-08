import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ReloadPrompt } from "@/components/ReloadPrompt";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#101215] text-white antialiased dark">
      <Header />
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        <main className="w-full flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ReloadPrompt />
    </div>
  ),
});
