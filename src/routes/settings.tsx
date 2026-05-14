import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRole, setRole } from "@/lib/role";
import { Bell, Volume2, Moon, Shield, User } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MindBloom AI" }, { name: "description", content: "Account, profile and app settings." }] }),
  component: Settings,
});

function Settings() {
  const role = useRole();
  const navigate = useNavigate();
  const switchRole = () => {
    const next = role === "child" ? "parent" : "child";
    setRole(next);
    navigate({ to: next === "child" ? "/dashboard" : "/parent" });
  };
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-4xl px-3 sm:px-6 mt-6 space-y-6">
        <div className="pixel-card-flat bg-[color:var(--sunny)] p-6">
          <div className="font-pixel text-[10px] text-[color:var(--cherry)]">SETTINGS</div>
          <h1 className="font-pixel text-2xl mt-2">{role === "parent" ? "Parent settings" : "Hero settings"}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card icon={User} title="Profile" desc={role==="parent"?"Manage parent account":"Edit hero name & avatar"}/>
          <Card icon={Bell} title="Notifications" desc="Daily reminders & nudges"/>
          <Card icon={Volume2} title="Sound & Music" desc="Arcade SFX & background music"/>
          <Card icon={Moon} title="Theme" desc="Switch between light & dark worlds"/>
          <Card icon={Shield} title="Privacy" desc="Data, parental controls"/>
          <div className="pixel-card p-5 bg-[color:var(--teal-pop)]">
            <div className="font-black">Switch experience</div>
            <p className="text-sm mt-1">Currently in <b>{role}</b> mode.</p>
            <button onClick={switchRole} className="btn-game cherry mt-3">Switch to {role==="child"?"Parent":"Child"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }: any) {
  return (
    <div className="pixel-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)]"><Icon size={20}/></div>
        <div>
          <div className="font-black">{title}</div>
          <div className="text-xs">{desc}</div>
        </div>
      </div>
    </div>
  );
}
