import { Link, useLocation } from "@tanstack/react-router";
import { Home, Sword, Gamepad2, Bot, BarChart3, Users } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/missions", label: "Missions", icon: Sword },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/mentor", label: "AI Mentor", icon: Bot },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/parent", label: "Parent Zone", icon: Users },
] as const;

export function Navbar() {
  const loc = useLocation();
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav className="mx-auto max-w-7xl pixel-card-flat bg-ink flex items-center justify-between gap-3 px-3 py-2"
        style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <Link to="/" className="flex items-center gap-2 pl-1">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--grass)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● AI Adventure</div>
          </div>
        </Link>
        <ul className="hidden lg:flex items-center gap-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-[color:var(--sunny)] text-[color:var(--ink)] border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]"
                      : "text-[color:var(--cream)] hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link to="/auth" className="grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--orange-pop)] shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition">
          <span className="font-pixel text-[10px] text-white">P1</span>
        </Link>
      </nav>
    </header>
  );
}
