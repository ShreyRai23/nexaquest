// Public/landing navbar (role-agnostic). Authenticated areas use RoleNavbar.
import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav className="mx-auto max-w-7xl pixel-card-flat flex items-center justify-between gap-3 px-3 py-2"
        style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <Link to="/" className="flex items-center gap-2 pl-1">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--grass)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">NEXAQUEST</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● AI Adventure</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="btn-game">Sign in</Link>
        </div>
      </nav>
    </header>
  );
}
