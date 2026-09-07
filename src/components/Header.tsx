import { Link } from "@tanstack/react-router";
import { Gear, Sigma } from "@phosphor-icons/react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#1e1f22]/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#1e1f22]/80">
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="SolvexR home" className="flex items-center text-[#079697]">
          <Sigma size={38} weight="bold" />
        </Link>
        <ul className="flex items-center">
          <li className="mx-7 text-[15px] hover:underline">
            <Link to="/">/home</Link>
          </li>
          <li className="mx-7 text-[15px] hover:underline">
            <Link to="/about">/about</Link>
          </li>
        </ul>
        <Link to="/settings" aria-label="Settings" className="flex items-center text-[#eee] transition-all duration-100 hover:opacity-80 active:scale-90">
          <Gear size={26} />
        </Link>
      </nav>
    </header>
  );
}
