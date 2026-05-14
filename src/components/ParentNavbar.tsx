import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BarChart3, FileText, Brain, Settings, Bell, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { setRole } from "@/lib/role";

const items = [
  { to: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { to: "/progress", label: "Child Progress", icon: BarChart3 },
  { to: "/report", label: "AI Reports", icon: FileText },
  { to: "/parent", label: "AI Insights", icon: Brain, hash: "insights" },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const children = [
  { id: "1", name: "Aarav", emoji: "🦊" },
  { id: "2", name: "Mira", emoji: "🐼" },
];

export function ParentNavbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(children[0]);
  const [open, setOpen] = useState(false);
  const switchToChild = () => {
    setRole("child");
    navigate({ to: "/dashboard" });
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav className="mx-auto max-w-7xl pixel-card-flat flex items-center gap-3 px-3 py-2 overflow-hidden"
        style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <Link to="/parent" className="flex items-center gap-2 pl-1 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--teal-pop)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● Parent Center</div>
          </div>
        </Link>
        <ul className="hidden lg:flex items-center gap-1 flex-1 min-w-0 justify-center flex-wrap">
          {items.map(({ to, label, icon: Icon }) => {
            const isActive = loc.pathname === to;
            return (
              <li key={label}>
                <Link
                  to={to}
                  className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold transition whitespace-nowrap ${
                    isActive
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
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <div className="relative">
            <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] px-2 py-1.5 shadow-[3px_3px_0_0_var(--ink)]">
              <span className="text-lg leading-none">{active.emoji}</span>
              <span className="font-pixel text-[9px] text-[color:var(--ink)] hidden sm:inline">{active.name.toUpperCase()}</span>
              <ChevronDown size={12} className="text-[color:var(--ink)]" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 pixel-card bg-white p-2 z-50">
                {children.map(c => (
                  <button key={c.id} onClick={()=>{setActive(c); setOpen(false);}} className="w-full flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[color:var(--sunny)]/40 font-bold text-[color:var(--ink)]">
                    <span className="text-lg">{c.emoji}</span> {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] shadow-[3px_3px_0_0_var(--ink)] shrink-0" aria-label="Notifications">
            <Bell size={16} className="text-[color:var(--ink)]" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--teal-pop)] shadow-[3px_3px_0_0_var(--ink)] shrink-0">
            <span className="font-pixel text-[10px] text-[color:var(--ink)]">PA</span>
          </div>
          <button onClick={switchToChild} title="Switch to Child" className="hidden md:grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] shadow-[3px_3px_0_0_var(--ink)] shrink-0" aria-label="Switch to child">
            <LogOut size={14} className="text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
}
