import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Lock, Star, Coins, Flame, Trophy, Clock } from "lucide-react";

export const Route = createFileRoute("/missions")({
  head: () => ({ meta: [{ title: "Missions — MindBloom AI" }, { name: "description", content: "Choose your quest from a colorful adventure world." }] }),
  component: Missions,
});

const lands = [
  { n: "Logic Land", e: "🧠", c: "var(--sky-pop)", lvl: 12, stars: 3, locked: false },
  { n: "Creativity Kingdom", e: "🎨", c: "var(--orange-pop)", lvl: 9, stars: 2, locked: false },
  { n: "Science Valley", e: "🔬", c: "var(--teal-pop)", lvl: 7, stars: 2, locked: false },
  { n: "Leadership Arena", e: "👑", c: "var(--sunny)", lvl: 5, stars: 1, locked: false },
  { n: "Memory Forest", e: "🌳", c: "var(--grass)", lvl: 0, stars: 0, locked: true },
  { n: "Mystery Isle", e: "🏝", c: "var(--grape)", lvl: 0, stars: 0, locked: true },
];

function Missions() {
  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 space-y-6">
        <div className="pixel-card-flat bg-[color:var(--cherry)] text-white p-8 text-center">
          <div className="font-pixel text-[10px] text-[color:var(--sunny)]">QUEST BOARD</div>
          <h1 className="font-pixel text-2xl sm:text-3xl mt-3">Choose Your Next Adventure</h1>
          <p className="mt-2 font-semibold">5 worlds. 200+ challenges. Endless fun.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* World map */}
          <div className="space-y-6">
            <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-5">
              <h3 className="text-xl font-black">🗺 World map</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {lands.map(l=>(
                  <div key={l.n} className={`pixel-card p-4 relative overflow-hidden ${l.locked?"opacity-70":""}`} style={{background: l.c}}>
                    {l.locked && <div className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-md border-4 border-[color:var(--ink)] bg-white"><Lock size={14}/></div>}
                    <div className="text-5xl">{l.e}</div>
                    <div className="font-black mt-2">{l.n}</div>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3].map(i=><Star key={i} size={14} fill={i<=l.stars?"currentColor":"none"} className={i<=l.stars?"text-[color:var(--ink)]":"text-[color:var(--ink)]/30"}/>)}
                    </div>
                    <div className="font-pixel text-[9px] mt-1">LVL {l.lvl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-xl font-black mb-3">🔥 Featured challenges</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {t:"Pattern Pirate", w:"Logic Land", xp:240, time:"12m", d:"Hard", c:"var(--sky-pop)", e:"🏴‍☠️"},
                  {t:"Color Castle", w:"Creativity Kingdom", xp:180, time:"8m", d:"Medium", c:"var(--orange-pop)", e:"🏰"},
                  {t:"Galaxy Lab", w:"Science Valley", xp:200, time:"15m", d:"Medium", c:"var(--teal-pop)", e:"🛸"},
                  {t:"Squad Captain", w:"Leadership Arena", xp:300, time:"20m", d:"Hard", c:"var(--sunny)", e:"⚔️"},
                ].map(ch=>(
                  <div key={ch.t} className="pixel-card p-4 flex gap-4">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border-4 border-[color:var(--ink)] text-4xl" style={{background:ch.c}}>{ch.e}</div>
                    <div className="flex-1">
                      <div className="font-pixel text-[9px] text-[color:var(--cherry)]">{ch.w.toUpperCase()}</div>
                      <div className="font-black">{ch.t}</div>
                      <div className="flex flex-wrap gap-1 mt-2 text-xs">
                        <span className="tag bg-[color:var(--sunny)]">+{ch.xp} XP</span>
                        <span className="tag"><Clock size={10}/> {ch.time}</span>
                        <span className="tag bg-[color:var(--cherry)] text-white">{ch.d}</span>
                      </div>
                      <Link to="/quiz" className="btn-game mt-3">Start quest</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Player stats */}
          <aside className="pixel-card-flat bg-[color:var(--ink)] text-[color:var(--cream)] p-5 h-fit sticky top-24">
            <div className="font-pixel text-[10px] text-[color:var(--sunny)]">PLAYER STATS</div>
            <div className="mt-4 space-y-3">
              {[
                {i:Coins, l:"Coins", v:"1,240", c:"var(--sunny)"},
                {i:Flame, l:"Streak", v:"7 days", c:"var(--cherry)"},
                {i:Star, l:"Level", v:"12", c:"var(--orange-pop)"},
                {i:Trophy, l:"Badges", v:"24", c:"var(--grass)"},
              ].map(s=>(
                <div key={s.l} className="flex items-center gap-3 rounded-xl border-4 border-[color:var(--cream)]/30 bg-white/5 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border-4 border-[color:var(--ink)]" style={{background:s.c, color:"var(--ink)"}}><s.i size={16}/></div>
                  <div>
                    <div className="font-pixel text-[9px] opacity-70">{s.l.toUpperCase()}</div>
                    <div className="font-black">{s.v}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/achievements" className="btn-game w-full mt-4">Trophy hall</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
