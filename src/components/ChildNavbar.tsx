import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Sword, Gamepad2, Bot, BarChart3, Trophy, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const items = [
  { to: "/dashboard",    label: "Dashboard",    icon: Home },
  { to: "/missions",     label: "Missions",     icon: Sword },
  { to: "/quiz",         label: "Games",        icon: Gamepad2 },
  { to: "/mentor",       label: "AI Mentor",    icon: Bot },
  { to: "/report",       label: "Progress",     icon: BarChart3 },
  { to: "/achievements", label: "Achievements", icon: Trophy },
] as const;

export function ChildNavbar() {
  const loc      = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/auth" });
  };

  const heroInitials = user?.profile?.hero_name
    ? user.profile.hero_name.substring(0, 2).toUpperCase()
    : (user?.name?.substring(0, 2).toUpperCase() ?? "P1");

  const level = user?.profile?.level ?? 1;
  const xp    = user?.profile?.xp ?? 0;

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav
        className="mx-auto max-w-7xl pixel-card-flat flex items-center gap-2 px-3 py-2"
        style={{ background: "var(--ink)", color: "var(--cream)" }}
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 pl-1 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--grass)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● Hero Mode</div>
          </div>
        </Link>

        {/* Desktop nav links — shown from md breakpoint */}
        <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center flex-wrap">
          {items.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-bold transition whitespace-nowrap ${
                    active
                      ? "bg-[color:var(--sunny)] text-[color:var(--ink)] border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]"
                      : "text-[color:var(--cream)] hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* XP pill — desktop only */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border-2 border-[color:var(--cream)]/20 bg-white/5 px-3 py-1.5">
            <span className="font-pixel text-[9px] text-[color:var(--sunny)]">LVL {level}</span>
            <div className="bar w-14"><span style={{ width: `${user?.profile?.level_progress_percent ?? 0}%` }} /></div>
            <span className="font-pixel text-[9px] text-[color:var(--teal-pop)]">{xp} XP</span>
          </div>

          {/* Avatar — links to profile */}
          <Link
            to="/profile"
            className="grid h-11 w-11 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--orange-pop)] shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition shrink-0 overflow-hidden"
            aria-label="My Profile"
          >
            {user?.profile_image_url ? (
              <img src={user.profile_image_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-pixel text-[12px] text-white">{heroInitials}</span>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="grid h-11 w-11 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] shadow-[3px_3px_0_0_var(--ink)] shrink-0"
            aria-label="Sign out"
          >
            <LogOut size={16} className="text-white" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-xl border-4 border-[color:var(--ink)] bg-white/10 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="md:hidden mx-auto max-w-7xl mt-2 pixel-card-flat p-3"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          <ul className="grid grid-cols-2 gap-2">
            {items.map(({ to, label, icon: Icon }) => {
              const active = loc.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-[color:var(--sunny)] text-[color:var(--ink)] border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]"
                        : "text-[color:var(--cream)] hover:bg-white/10"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
