import { createFileRoute } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";

export const Route = createFileRoute("/skill-map")({
  head: () => ({ meta: [{ title: "Skill Map — NexaQuest AI" }, { name: "description", content: "Visual skill constellation map." }] }),
  component: SkillMap,
});

const skills = [
  { n: "Logic", v: 92, c: "var(--teal-pop)", e: "🧩", x: 20, y: 30 },
  { n: "Creativity", v: 78, c: "var(--orange-pop)", e: "🎨", x: 70, y: 20 },
  { n: "Memory", v: 70, c: "var(--grass)", e: "🧠", x: 80, y: 60 },
  { n: "Communication", v: 58, c: "var(--cherry)", e: "💬", x: 30, y: 70 },
  { n: "Leadership", v: 65, c: "var(--sunny)", e: "👑", x: 50, y: 45 },
];

function SkillMap() {
  useRoleGuard("child");
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-8 space-y-6">
        <div className="pixel-card-flat text-white p-8" style={{ background: "var(--cherry)" }}>
          <div className="font-pixel text-[10px] text-[color:var(--sunny)]">SKILL CONSTELLATION</div>
          <h1 className="font-pixel text-2xl sm:text-3xl mt-3">Your Skill Map</h1>
          <p className="mt-2 font-semibold">Travel between skill planets to grow your hero.</p>
        </div>
        <div className="pixel-card p-5 relative bg-[color:var(--ink)] aspect-[16/9]">
          {skills.map(s => (
            <div key={s.n} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{left:`${s.x}%`, top:`${s.y}%`}}>
              <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)] text-3xl animate-float" style={{background:s.c}}>{s.e}</div>
              <div className="font-pixel text-[9px] text-[color:var(--cream)] mt-2">{s.n.toUpperCase()}</div>
              <div className="font-pixel text-[10px] text-[color:var(--sunny)]">LVL {Math.floor(s.v/10)}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {skills.slice(0,3).map(s => (
            <div key={s.n} className="pixel-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl border-4 border-[color:var(--ink)] text-2xl" style={{background:s.c}}>{s.e}</div>
                <div>
                  <div className="font-black">{s.n}</div>
                  <div className="text-xs">Mastery {s.v}%</div>
                </div>
              </div>
              <div className="bar mt-3"><span style={{width:`${s.v}%`, background:s.c}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
