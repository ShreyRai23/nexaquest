import { createFileRoute, Link } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress — NexaQuest AI" }, { name: "description", content: "Your skill map and growth journey." }] }),
  component: Progress,
});

function Progress() {
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-8 space-y-6">
        <div className="pixel-card-flat p-8" style={{ background: "var(--teal-pop)", color: "var(--ink)" }}>
          <div className="font-pixel text-[10px] text-[color:var(--cherry)]">SKILL MAP</div>
          <h1 className="font-pixel text-2xl sm:text-3xl mt-3">Your Growth Journey</h1>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black">Skill levels</h3>
            <div className="mt-4 space-y-3">
              {[["Logic",92,"var(--teal-pop)"],["Creativity",78,"var(--orange-pop)"],["Memory",70,"var(--grass)"],["Communication",58,"var(--cherry)"],["Leadership",65,"var(--sunny)"]].map(([n,v,c])=>(
                <div key={n as string}>
                  <div className="flex justify-between text-sm font-bold"><span>{n as string}</span><span>Lvl {Math.floor((v as number)/10)}</span></div>
                  <div className="bar mt-1"><span style={{width:`${v}%`, background: c as string}}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="pixel-card p-5 bg-[color:var(--sunny)]">
            <h3 className="text-xl font-black">Adventure timeline</h3>
            <div className="mt-4 space-y-3">
              {[
                "🌱 Joined NexaQuest",
                "⚔️ Cleared Logic Lava",
                "🎨 Unlocked Creativity Kingdom",
                "🏆 Earned Streak badge",
                "🚀 Reached Level 12",
              ].map((t,i)=>(
                <div key={i} className="rounded-lg border-4 border-[color:var(--ink)] bg-white p-3 font-bold">{t}</div>
              ))}
            </div>
            <Link to="/report" className="btn-game cherry mt-4">View AI report</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
