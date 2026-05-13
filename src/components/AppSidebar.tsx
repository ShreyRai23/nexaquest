import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Sword, Gamepad2, Bot, Trophy, Map, Settings } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/missions", label: "Missions", icon: Sword },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/mentor", label: "AI Mentor", icon: Bot },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/progress", label: "Skill Map", icon: Map },
  { to: "/parent", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden lg:block">
      <div className="pixel-card-flat sticky top-6 p-4" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="flex items-center gap-3 rounded-xl border-4 border-[color:var(--cream)]/20 bg-white/5 p-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg border-4 border-[color:var(--sunny)] bg-[color:var(--orange-pop)] font-pixel text-[10px] text-white">P1</div>
          <div className="flex-1">
            <div className="font-pixel text-[10px] text-[color:var(--sunny)]">EXPLORER</div>
            <div className="text-xs text-[color:var(--cream)]/70">Lvl 12 · 2,340 XP</div>
            <div className="bar mt-2"><span style={{ width: "62%" }} /></div>
          </div>
        </div>
        <nav className="mt-4 space-y-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-[color:var(--sunny)] text-[color:var(--ink)] border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]"
                    : "text-[color:var(--cream)] hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-xl border-4 border-[color:var(--cream)]/20 bg-white/5 p-3 text-xs">
          <div className="font-pixel text-[9px] text-[color:var(--teal-pop)]">BADGES</div>
          <div className="mt-2 flex gap-1.5">
            {["🏆","⭐","🧩","🚀","🎯"].map((b) => (
              <span key={b} className="grid h-8 w-8 place-items-center rounded-md border-2 border-[color:var(--cream)]/40 bg-[color:var(--ink)]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
