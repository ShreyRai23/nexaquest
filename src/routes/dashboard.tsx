import { createFileRoute, Link } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";
import { AppSidebar } from "@/components/AppSidebar";
import { Flame, Trophy, Sparkles, Clock, Zap, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MindBloom AI" }, { name: "description", content: "Your adventure hub: missions, skill radar, AI tips, achievements." }] }),
  component: Dashboard,
});

const skills = [
  { n: "Creativity", v: 78 },
  { n: "Logic", v: 86 },
  { n: "Memory", v: 64 },
  { n: "Communication", v: 70 },
  { n: "Leadership", v: 55 },
];

function Dashboard() {
  useRoleGuard("child");
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <AppSidebar />
        <div className="space-y-6">
          {/* Welcome banner */}
          <div className="pixel-card-flat bg-[color:var(--sunny)] p-6 flex items-center gap-5 flex-wrap">
            <div className="text-6xl animate-bounce-soft">🦊</div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-pixel text-[10px] text-[color:var(--cherry)]">WELCOME BACK</div>
              <h1 className="text-3xl font-black">Hey Explorer!</h1>
              <p className="font-semibold">You're 38% to <span className="underline">Level 13</span>. One more quest!</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={Flame} v="7" l="Streak" c="var(--cherry)"/>
              <Stat icon={Zap} v="+250" l="Today XP" c="var(--orange-pop)"/>
              <Stat icon={Trophy} v="24" l="Badges" c="var(--grass)"/>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Skill radar */}
            <div className="pixel-card p-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-pixel text-[10px] text-[color:var(--teal-pop)]">POWER CHART</div>
                  <h3 className="text-xl font-black">Your skill radar</h3>
                </div>
                <span className="tag bg-[color:var(--sunny)]">Updated today</span>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_220px] gap-6 items-center">
                <div className="space-y-3">
                  {skills.map(s => (
                    <div key={s.n}>
                      <div className="flex justify-between text-sm font-bold"><span>{s.n}</span><span>{s.v}</span></div>
                      <div className="bar mt-1"><span style={{width:`${s.v}%`, background: "var(--teal-pop)"}}/></div>
                    </div>
                  ))}
                </div>
                <RadarChart data={skills}/>
              </div>
            </div>

            {/* AI suggestions */}
            <div className="pixel-card p-5 bg-[color:var(--sky-pop)]">
              <div className="font-pixel text-[10px]">AI MENTOR</div>
              <h3 className="text-xl font-black mt-1">Today's tips</h3>
              <div className="mt-4 space-y-3">
                {[
                  "Try visual puzzles today to boost spatial skills.",
                  "Your reasoning is improving — combo +18% this week!",
                  "Story quests will help your communication score.",
                ].map(t=>(
                  <div key={t} className="rounded-xl border-4 border-[color:var(--ink)] bg-white p-3 text-sm font-semibold flex gap-2">
                    <span>🤖</span><span>{t}</span>
                  </div>
                ))}
              </div>
              <Link to="/mentor" className="btn-game mt-4">Chat with mentor</Link>
            </div>
          </div>

          {/* Daily missions */}
          <div className="pixel-card-flat bg-white p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-pixel text-[10px] text-[color:var(--cherry)]">DAILY QUESTS</div>
                <h3 className="text-xl font-black">Missions for today</h3>
              </div>
              <Link to="/missions" className="btn-game teal">All missions</Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {t:"Logic Puzzle", e:"🧩", xp:120, time:"10 min", diff:"Easy", c:"var(--grass)"},
                {t:"Creativity Challenge", e:"🎨", xp:200, time:"15 min", diff:"Medium", c:"var(--orange-pop)"},
                {t:"Memory Sprint", e:"⚡", xp:90, time:"5 min", diff:"Hard", c:"var(--cherry)"},
              ].map(m=>(
                <div key={m.t} className="pixel-card p-4">
                  <div className="aspect-video rounded-lg border-4 border-[color:var(--ink)] grid place-items-center text-5xl" style={{background: m.c}}>{m.e}</div>
                  <h4 className="font-black mt-3">{m.t}</h4>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="tag bg-[color:var(--sunny)]">+{m.xp} XP</span>
                    <span className="tag"><Clock size={10}/> {m.time}</span>
                    <span className="tag bg-[color:var(--teal-pop)]">{m.diff}</span>
                  </div>
                  <Link to="/quiz" className="btn-game w-full mt-3">Start</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements + journey */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="pixel-card p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">Achievement showcase</h3>
                <Link to="/achievements" className="font-bold underline text-sm">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[
                  {e:"🏆", n:"Logic", c:"var(--sunny)"},
                  {e:"⭐", n:"Streak", c:"var(--orange-pop)"},
                  {e:"🎨", n:"Artist", c:"var(--cherry)"},
                  {e:"🚀", n:"Speed", c:"var(--teal-pop)"},
                  {e:"🧠", n:"Brain", c:"var(--grass)"},
                  {e:"🔒", n:"???", c:"#cfc9bf"},
                  {e:"🔒", n:"???", c:"#cfc9bf"},
                  {e:"🔒", n:"???", c:"#cfc9bf"},
                ].map((b,i)=>(
                  <div key={i} className="rounded-xl border-4 border-[color:var(--ink)] p-3 text-center shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-1 transition" style={{background:b.c}}>
                    <div className="text-3xl">{b.e}</div>
                    <div className="font-pixel text-[8px] mt-1">{b.n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pixel-card p-5">
              <h3 className="text-xl font-black">Adventure journey</h3>
              <div className="mt-4 relative pl-6">
                <div className="absolute left-3 top-2 bottom-2 w-1 bg-[color:var(--ink)] rounded"/>
                {[
                  {t:"Beat Logic Lava", e:"⚔️", d:"+250 XP"},
                  {t:"Unlocked Memory Reef", e:"🌊", d:"New world"},
                  {t:"Completed Creativity quest", e:"🎨", d:"+180 XP"},
                  {t:"Joined MindBloom", e:"🌱", d:"Day 1"},
                ].map((s,i)=>(
                  <div key={i} className="flex gap-3 mb-3 items-start">
                    <div className="grid h-8 w-8 -ml-1.5 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] text-sm relative z-10">{s.e}</div>
                    <div>
                      <div className="font-bold">{s.t}</div>
                      <div className="text-xs text-[color:var(--ink)]/60">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini game carousel */}
          <div className="pixel-card-flat bg-[color:var(--teal-pop)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Quick play</h3>
              <Sparkles className="animate-wiggle"/>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {["🧠","🎨","🧩","🪄","🚀","🎯","🐙"].map((e,i)=>(
                <div key={i} className="min-w-[160px] pixel-card bg-white p-3 text-center">
                  <div className="text-5xl">{e}</div>
                  <div className="font-pixel text-[9px] mt-2">QUEST {i+1}</div>
                  <div className="tag bg-[color:var(--sunny)] mt-2 inline-flex"><Star size={10} fill="currentColor"/> +{50+i*20}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, v, l, c }: any) {
  return (
    <div className="rounded-xl border-4 border-[color:var(--ink)] bg-white px-3 py-2 text-center shadow-[3px_3px_0_0_var(--ink)]">
      <Icon size={16} style={{ color: c }} className="mx-auto"/>
      <div className="font-pixel text-[10px] mt-1">{v}</div>
      <div className="text-[10px] text-[color:var(--ink)]/60">{l}</div>
    </div>
  );
}

function RadarChart({ data }: { data: { n: string; v: number }[] }) {
  const size = 200, cx = size/2, cy = size/2, max = 100;
  const angle = (i: number) => (Math.PI*2 * i)/data.length - Math.PI/2;
  const point = (i: number, v: number) => {
    const r = (v/max) * (size/2 - 18);
    return [cx + r*Math.cos(angle(i)), cy + r*Math.sin(angle(i))];
  };
  const poly = data.map((d,i)=>point(i,d.v).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px]">
      {[0.25,0.5,0.75,1].map(r=>(
        <polygon key={r} fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray={r===1?"":"4 4"}
          points={data.map((_,i)=>{const x=cx+r*(size/2-18)*Math.cos(angle(i));const y=cy+r*(size/2-18)*Math.sin(angle(i));return `${x},${y}`}).join(" ")}/>
      ))}
      <polygon points={poly} fill="var(--sunny)" fillOpacity="0.6" stroke="var(--ink)" strokeWidth="3"/>
      {data.map((d,i)=>{
        const [x,y]=point(i,100);
        return <text key={d.n} x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="900" dy={y>cy?12:-4}>{d.n}</text>
      })}
    </svg>
  );
}
