import { createFileRoute, Link } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";
import { useState } from "react";
import { Heart, Timer, Zap, Snowflake, Lightbulb, Sparkles } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Battle Quiz — MindBloom AI" }, { name: "description", content: "Defeat the boss with brains. RPG-style aptitude quiz arena." }] }),
  component: Quiz,
});

const Q = {
  q: "What is biodiversity?",
  options: ["The study of life", "Variety of life in ecosystems", "Population growth", "Climate change effects"],
  correct: 1,
};

function Quiz() {
  useRoleGuard("child");
  const [picked, setPicked] = useState<number | null>(null);
  const [hp, setHp] = useState({ p: 100, e: 100 });
  const [xp, setXp] = useState(420);
  const [shake, setShake] = useState(false);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === Q.correct) {
      setHp(s => ({ ...s, e: Math.max(0, s.e - 35) }));
      setXp(x => x + 80);
    } else {
      setHp(s => ({ ...s, p: Math.max(0, s.p - 25) }));
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6">
        {/* Battle HUD */}
        <div className="pixel-card-flat bg-[color:var(--ink)] text-[color:var(--cream)] p-4 grid grid-cols-2 gap-4">
          <Fighter name="Aarav" lvl={12} hp={hp.p} c="var(--grass)" emoji="🧒"/>
          <Fighter name="Boss Bramble" lvl={14} hp={hp.e} c="var(--cherry)" emoji="👹" right/>
        </div>
        <div className="mt-3 pixel-card-flat bg-[color:var(--sunny)] p-3 flex items-center gap-4 flex-wrap">
          <span className="tag bg-white"><Timer size={12}/> 00:42</span>
          <span className="tag bg-[color:var(--orange-pop)] text-white"><Zap size={12}/> XP {xp}</span>
          <span className="tag bg-[color:var(--teal-pop)]">Combo x3</span>
          <span className="tag">Score 1,840</span>
          <span className="tag bg-[color:var(--cherry)] text-white">Round 3 of 5</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr_220px]">
          {/* Left: power-ups */}
          <div className="pixel-card p-4 space-y-3 bg-[color:var(--cream)]">
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">POWER-UPS</div>
            {[
              {n:"Hint", i:Lightbulb, c:"var(--sunny)"},
              {n:"Freeze Time", i:Snowflake, c:"var(--sky-pop)"},
              {n:"Double XP", i:Sparkles, c:"var(--orange-pop)"},
            ].map(p=>(
              <button key={p.n} className="btn-game w-full" style={{background: p.c}}>
                <p.i size={16}/> {p.n}
              </button>
            ))}
          </div>

          {/* Center: arena */}
          <div className={`pixel-card-flat bg-[color:var(--orange-pop)] p-6 ${shake ? "animate-shake" : ""}`}>
            <div className="aspect-[16/9] rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] p-6 grid place-items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-dots opacity-50"/>
              <div className="text-center relative">
                <div className="font-pixel text-[10px] text-[color:var(--cherry)]">ENVIRONMENTAL BATTLE CHALLENGE</div>
                <div className="font-pixel text-xl sm:text-2xl mt-3">{Q.q}</div>
              </div>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {Q.options.map((o, i) => {
                const isCorrect = picked !== null && i === Q.correct;
                const isWrong = picked === i && i !== Q.correct;
                const bg = isCorrect ? "var(--grass)" : isWrong ? "var(--cherry)" : ["var(--sunny)","var(--teal-pop)","var(--sky-pop)","var(--cream)"][i];
                return (
                  <button key={i} disabled={picked!==null} onClick={()=>choose(i)}
                    className="btn-game justify-start text-left animate-pop" style={{background: bg, color: isCorrect||isWrong ? "white" : "var(--ink)"}}>
                    <span className="font-pixel text-[10px] mr-2">{String.fromCharCode(65+i)})</span> {o}
                  </button>
                );
              })}
            </div>
            {picked === Q.correct && (
              <div className="mt-4 text-center font-pixel text-[12px] text-white animate-xp">+80 XP CRITICAL HIT!</div>
            )}
          </div>

          {/* Right: quest tracker */}
          <div className="pixel-card p-4 bg-[color:var(--cream)]">
            <div className="font-pixel text-[10px] text-[color:var(--teal-pop)]">QUEST PROGRESS</div>
            <div className="mt-3 space-y-2">
              {[true,true,false,false,false].map((d,i)=>(
                <div key={i} className={`flex items-center gap-2 rounded-lg border-4 border-[color:var(--ink)] p-2 ${d?"bg-[color:var(--grass)] text-white":"bg-white"}`}>
                  <span className="font-pixel text-[10px]">Q{i+1}</span>
                  <span className="text-xs font-bold">{d?"Cleared":"Locked"}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] p-3 text-xs font-bold">
              🌟 Win to unlock <span className="underline">Forest of Logic</span>!
            </div>
            <Link to="/dashboard" className="btn-game ghost w-full mt-3">Forfeit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fighter({ name, lvl, hp, c, emoji, right }: any) {
  return (
    <div className={`flex items-center gap-3 ${right ? "flex-row-reverse text-right" : ""}`}>
      <div className="grid h-16 w-16 place-items-center rounded-xl border-4 border-[color:var(--cream)] bg-white text-3xl shrink-0 animate-bounce-soft">{emoji}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="font-pixel text-[10px] text-[color:var(--sunny)]">{name}</span>
          <span className="tag bg-[color:var(--cream)] text-[color:var(--ink)]">LVL {lvl}</span>
        </div>
        <div className="bar mt-2"><span style={{width:`${hp}%`, background: c}}/></div>
        <div className="text-[10px] text-[color:var(--cream)]/70 mt-1 flex items-center gap-1"><Heart size={10}/> {hp}/100 HP</div>
      </div>
    </div>
  );
}
