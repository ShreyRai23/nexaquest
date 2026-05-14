import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Sword, Gamepad2, Bot, BarChart3, Trophy, Bell, LogOut } from "lucide-react";
import { setRole } from "@/lib/role";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/missions", label: "Missions", icon: Sword },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/mentor", label: "AI Mentor", icon: Bot },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/achievements", label: "Achievements", icon: Trophy },
] as const;

export function ChildNavbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const switchToParent = () => {
    setRole("parent");
    navigate({ to: "/parent" });
  };
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav className="mx-auto max-w-7xl pixel-card-flat flex items-center justify-between gap-3 px-3 py-2"
        style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <Link to="/dashboard" className="flex items-center gap-2 pl-1">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--grass)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● Hero Mode</div>
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
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-xl border-4 border-[color:var(--cream)]/20 bg-white/5 px-3 py-1.5">
            <span className="font-pixel text-[9px] text-[color:var(--sunny)]">LVL 12</span>
            <div className="bar w-20"><span style={{ width: "62%" }} /></div>
            <span className="font-pixel text-[9px] text-[color:var(--teal-pop)]">2340 XP</span>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] shadow-[3px_3px_0_0_var(--ink)]" aria-label="Notifications">
            <Bell size={16} className="text-[color:var(--ink)]" />
          </button>
          <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--orange-pop)] shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition" aria-label="Avatar">
            <span className="font-pixel text-[10px] text-white">P1</span>
          </Link>
          <button onClick={switchToParent} title="Switch to Parent" className="hidden md:grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] shadow-[3px_3px_0_0_var(--ink)]" aria-label="Switch to parent">
            <LogOut size={14} className="text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
}
