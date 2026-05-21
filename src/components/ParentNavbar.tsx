import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BarChart3, FileText, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const items = [
  { to: "/parent",           label: "Dashboard",      icon: LayoutDashboard },
  { to: "/parent-progress",  label: "Child Progress",  icon: BarChart3 },
  { to: "/parent-report",    label: "AI Report",       icon: FileText },
] as const;

export function ParentNavbar() {
  const loc      = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/auth" });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "PA";

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <nav
        className="mx-auto max-w-7xl pixel-card-flat flex items-center gap-2 px-3 py-2"
        style={{ background: "var(--ink)", color: "var(--cream)" }}
      >
        {/* Logo */}
        <Link to="/parent" className="flex items-center gap-2 pl-1 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--teal-pop)]">
            <span className="font-pixel text-[10px]">MB</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM</div>
            <div className="text-[10px] text-[color:var(--teal-pop)]">● Parent Center</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/parent" ? loc.pathname === to : loc.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition whitespace-nowrap ${
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

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Avatar — links to profile */}
          <Link
            to="/profile"
            className="grid h-11 w-11 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--teal-pop)] shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition shrink-0 overflow-hidden"
            aria-label="My Profile"
          >
            {user?.profile_image_url ? (
              <img src={user.profile_image_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-pixel text-[12px] text-[color:var(--ink)]">{initials}</span>
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden mx-auto max-w-7xl mt-2 pixel-card-flat p-3"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          <ul className="flex flex-col gap-2">
            {items.map(({ to, label, icon: Icon }) => {
              const active = to === "/parent" ? loc.pathname === to : loc.pathname.startsWith(to);
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
