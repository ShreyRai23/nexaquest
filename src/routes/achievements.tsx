import { createFileRoute } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";
import { Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — MindBloom AI" }, { name: "description", content: "Trophy hall, badges, XP and unlockable rewards." }] }),
  component: Achievements,
});

const cats = [
  { n: "Logic Master", c: "var(--sky-pop)", e: "🧠" },
  { n: "Creative Genius", c: "var(--orange-pop)", e: "🎨" },
  { n: "Fast Learner", c: "var(--sunny)", e: "⚡" },
  { n: "Puzzle Champion", c: "var(--grass)", e: "🧩" },
  { n: "AI Explorer", c: "var(--cherry)", e: "🤖" },
];

const badges = [
  {e:"🏆", n:"First Quest", r:"Common"},
  {e:"⭐", n:"7-day streak", r:"Rare"},
  {e:"🎯", n:"Sharpshooter", r:"Common"},
  {e:"🧠", n:"Brain Boss", r:"Epic"},
  {e:"🚀", n:"Speedrun", r:"Rare"},
  {e:"🪄", n:"Word Wizard", r:"Epic"},
  {e:"👑", n:"Squad Lead", r:"Legendary"},
  {e:"🐙", n:"Memory Diver", r:"Rare"},
  {e:"🔒", n:"???", r:"Locked", l:true},
  {e:"🔒", n:"???", r:"Locked", l:true},
  {e:"🔒", n:"???", r:"Locked", l:true},
  {e:"🔒", n:"???", r:"Locked", l:true},
];

const rar: Record<string,string> = {
  Common: "var(--cream)", Rare: "var(--sky-pop)", Epic: "var(--grape)", Legendary: "var(--sunny)", Locked: "#cfc9bf",
};

function Achievements() {
  useRoleGuard("child");
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 space-y-6">
        <div className="pixel-card-flat bg-[color:var(--sunny)] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">TROPHY HALL</div>
            <h1 className="text-3xl font-black">Achievements</h1>
            <p className="font-semibold">24 of 60 badges unlocked. Keep going, hero!</p>
          </div>
          <div className="text-6xl animate-bounce-soft">🏆</div>
        </div>

        {/* XP progression */}
        <div className="pixel-card-flat bg-[color:var(--ink)] text-[color:var(--cream)] p-6">
          <div className="flex justify-between font-pixel text-[10px]">
            <span>LVL 12</span><span className="text-[color:var(--sunny)]">2,340 / 3,000 XP</span><span>LVL 13</span>
          </div>
          <div className="bar mt-3" style={{height: "26px"}}><span style={{width:"78%", background:"var(--sunny)"}}/></div>
          <div className="mt-3 text-sm text-[color:var(--cream)]/80">660 XP to next level — finish 2 quests to level up! ✨</div>
        </div>

        {/* Categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cats.map(c=>(
            <div key={c.n} className="pixel-card p-4 text-center" style={{background:c.c}}>
              <div className="text-4xl">{c.e}</div>
              <div className="font-black mt-2">{c.n}</div>
              <div className="font-pixel text-[9px] mt-1">3 / 8</div>
              <div className="bar mt-2"><span style={{width:"38%", background:"var(--ink)"}}/></div>
            </div>
          ))}
        </div>

        {/* Badge grid */}
        <div className="pixel-card-flat bg-white p-5">
          <h3 className="text-xl font-black">Badge collection</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {badges.map((b,i)=>(
              <div key={i} className={`pixel-card p-4 text-center relative ${b.l?"opacity-80":""}`} style={{background: rar[b.r]}}>
                {!b.l && <div className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] text-white"><Sparkles size={10}/></div>}
                {b.l && <div className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-white"><Lock size={10}/></div>}
                <div className="text-5xl">{b.e}</div>
                <div className="font-black text-sm mt-2">{b.n}</div>
                <div className="font-pixel text-[8px] mt-1">{b.r.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trophy showcase */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="pixel-card-flat bg-[color:var(--cherry)] text-white p-6">
            <h3 className="text-xl font-black">Trophy showcase</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {["🏆","🥇","🎖"].map((t,i)=>(
                <div key={i} className="rounded-2xl border-4 border-white p-6 text-center bg-white/10 hover:rotate-2 transition">
                  <div className="text-7xl animate-float">{t}</div>
                  <div className="font-pixel text-[9px] mt-3">SEASON {i+1}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pixel-card-flat bg-[color:var(--teal-pop)] p-6">
            <h3 className="text-xl font-black">🎁 Rewards store</h3>
            <p className="font-semibold">Use coins to unlock themes & avatars.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                {n:"Pixel Forest", c:"var(--grass)", p:"500"},
                {n:"Astronaut Hat", c:"var(--sky-pop)", p:"320"},
                {n:"Neon Theme", c:"var(--orange-pop)", p:"800"},
                {n:"Dragon Pet", c:"var(--cherry)", p:"1200"},
              ].map(r=>(
                <div key={r.n} className="pixel-card bg-white p-3 text-center">
                  <div className="aspect-square rounded-lg border-4 border-[color:var(--ink)] grid place-items-center text-4xl" style={{background:r.c}}>🎁</div>
                  <div className="font-black text-sm mt-2">{r.n}</div>
                  <div className="tag bg-[color:var(--sunny)] mt-2">🪙 {r.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
