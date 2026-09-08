import { Link } from "@tanstack/react-router";
import { Gear, Sigma, List, X } from "@phosphor-icons/react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#1e1f22]/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#1e1f22]/80">
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="SolvexR home" className="flex items-center text-[#079697] shrink-0" onClick={() => setOpen(false)}>
          <Sigma size={32} weight="bold" className="sm:h-[38px] sm:w-[38px]" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          <li className="text-[15px]">
            <Link to="/" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:no-underline [&.active]:bg-white [&.active]:!text-black [&.active]:font-semibold">
              /home
            </Link>
          </li>
          <li className="text-[15px]">
            <Link to="/journeys" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:no-underline [&.active]:bg-white [&.active]:!text-black [&.active]:font-semibold">
              /journeys
            </Link>
          </li>
          <li className="text-[15px]">
            <Link to="/about" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:no-underline [&.active]:bg-white [&.active]:!text-black [&.active]:font-semibold">
              /about
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/settings" aria-label="Settings" className="flex items-center text-[#eee] transition-all duration-100 hover:opacity-80 active:scale-90">
            <Gear size={24} className="sm:h-[26px] sm:w-[26px]" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition md:hidden hover:bg-white/15 active:scale-95"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#1e1f22] px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex w-full rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-white/10 [&.active]:bg-white [&.active]:!text-black"
              >
                /home
              </Link>
            </li>
            <li>
              <Link
                to="/journeys"
                onClick={() => setOpen(false)}
                className="flex w-full rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-white/10 [&.active]:bg-white [&.active]:!text-black"
              >
                /journeys
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="flex w-full rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-white/10 [&.active]:bg-white [&.active]:!text-black"
              >
                /about
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
