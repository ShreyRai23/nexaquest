import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Sparkles, Brain, Compass, MessageCircleHeart, Trophy, BarChart3, Gamepad2, Puzzle, Lightbulb, Palette, Star, Rocket, Cloud, Map } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindBloom AI — Discover Your Hidden Superpowers" },
      { name: "description", content: "Gamified AI aptitude discovery platform for kids 8–16. Quests, mini-games, AI mentor, parent insights." },
      { property: "og:title", content: "MindBloom AI — Adventure begins here" },
      { property: "og:description", content: "Play games, level up, find your superpowers with AI." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="px-3 sm:px-6">
        <div className="mx-auto max-w-7xl pixel-card-flat overflow-hidden bg-[color:var(--sky-pop)] relative">
          {/* floating clouds */}
          <Cloud className="absolute left-8 top-10 text-white/80 animate-float" size={56} />
          <Cloud className="absolute right-16 top-20 text-white/70 animate-bounce-soft" size={40} />
          <Star className="absolute left-1/3 top-6 text-[color:var(--sunny)] animate-wiggle" size={28} fill="currentColor" />
          <Rocket className="absolute right-10 bottom-24 text-[color:var(--cherry)] animate-float" size={36} />
          <Trophy className="absolute left-12 bottom-16 text-[color:var(--sunny)] animate-bounce-soft" size={32} />

          <div className="relative grid gap-8 p-6 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="tag bg-[color:var(--sunny)]"><Sparkles size={14}/> NEW · Season 1 Live</span>
              <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl leading-snug text-[color:var(--ink)]">
                Discover Your<br/>
                <span className="inline-block bg-[color:var(--sunny)] px-3 py-1 border-4 border-[color:var(--ink)] rounded-xl shadow-[6px_6px_0_0_var(--ink)] mt-2">Hidden Superpowers</span>
              </h1>
              <p className="max-w-xl text-lg font-semibold text-[color:var(--ink)]/80">
                ✨ Play. Quest. Grow. MindBloom AI is the magical world where kids ages 8–16 unlock their talents through games, missions and a friendly AI mentor.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard" className="btn-game orange"><Rocket size={18}/> Start Adventure</Link>
                <Link to="/games" className="btn-game ghost"><Gamepad2 size={18}/> Explore Games</Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                <div className="tag"><Star size={12} fill="currentColor" className="text-orange-500"/> 4.9 from 12k families</div>
                <div className="tag">🛡 Kid-safe AI</div>
                <div className="tag">🎮 200+ quests</div>
              </div>
            </div>

            {/* Avatar / world panel */}
            <div className="relative">
              <div className="pixel-card bg-[color:var(--cream)] p-5">
                <div className="flex items-center justify-between">
                  <div className="font-pixel text-[10px]">WORLD MAP</div>
                  <span className="tag bg-[color:var(--sunny)]">LVL 12</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    {e:"🧠", n:"Logic", c:"var(--sky-pop)"},
                    {e:"🎨", n:"Create", c:"var(--orange-pop)"},
                    {e:"🧩", n:"Puzzle", c:"var(--grass)"},
                    {e:"🗣", n:"Speak", c:"var(--cherry)"},
                    {e:"🚀", n:"Science", c:"var(--teal-pop)"},
                    {e:"⭐", n:"Lead", c:"var(--sunny)"},
                  ].map((s) => (
                    <div key={s.n} className="rounded-xl border-4 border-[color:var(--ink)] p-3 text-center shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-1 transition" style={{background: s.c}}>
                      <div className="text-2xl">{s.e}</div>
                      <div className="font-pixel text-[8px] mt-1">{s.n}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border-4 border-[color:var(--ink)] bg-white p-3">
                  <div className="flex justify-between text-xs font-bold"><span>Daily Quest</span><span>+250 XP</span></div>
                  <div className="bar mt-2"><span style={{width:"72%"}}/></div>
                </div>
              </div>
              <div className="absolute -right-3 -top-3 grid h-14 w-14 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] shadow-[3px_3px_0_0_var(--ink)] animate-bounce-soft">
                <span className="font-pixel text-[10px] text-white">+50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-16">
        <SectionTitle eyebrow="POWER UPS" title="AI features that make learning play" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {[
            {i:Brain, t:"AI Adaptive Tests", d:"Quizzes that level with your kid in real time.", c:"var(--sunny)", pct: 92},
            {i:Compass, t:"AI Career Discovery", d:"Match strengths to future-ready careers.", c:"var(--teal-pop)", pct: 87},
            {i:MessageCircleHeart, t:"AI Mentor Chatbot", d:"A friendly NPC to guide every quest.", c:"var(--orange-pop)", w:true, pct: 95},
            {i:Sparkles, t:"Gamified Quests", d:"Badges, XP, streaks and combo rewards.", c:"var(--grass)", w:true, pct: 78},
            {i:BarChart3, t:"Skill Analytics", d:"Beautiful charts parents actually understand.", c:"var(--sky-pop)", pct: 83},
            {i:Trophy, t:"Achievement System", d:"Trophies, rare badges, and seasonal events.", c:"var(--cherry)", w:true, pct: 90},
          ].map((f) => (
            <div key={f.t} className="pixel-card p-5">
              <div className="grid h-14 w-14 place-items-center rounded-xl border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]" style={{background: f.c, color: f.w ? "white" : "var(--ink)"}}>
                <f.i size={26}/>
              </div>
              <h3 className="mt-4 text-xl font-black">{f.t}</h3>
              <p className="mt-1 text-sm text-[color:var(--ink)]/70">{f.d}</p>
              <div className="bar mt-4"><span style={{width: `${f.pct}%`, background: f.c}}/></div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-20">
        <SectionTitle eyebrow="QUEST PATH" title="How the adventure works"/>
        <div className="mt-8 pixel-card-flat bg-[color:var(--sunny)] p-6 sm:p-10">
          <ol className="grid gap-6 md:grid-cols-4 relative">
            {[
              {n:1, t:"Create Character", d:"Pick a hero & avatar.", e:"🧒"},
              {n:2, t:"Play Skill Games", d:"Quests across 5 worlds.", e:"🎮"},
              {n:3, t:"Unlock AI Insights", d:"AI maps your strengths.", e:"🤖"},
              {n:4, t:"Discover Talents", d:"Career paths revealed.", e:"🌟"},
            ].map((s) => (
              <li key={s.n} className="relative pixel-card bg-white p-5 text-center">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] text-white font-pixel text-[10px] shadow-[3px_3px_0_0_var(--ink)]">{s.n}</div>
                <div className="text-4xl mt-3">{s.e}</div>
                <h4 className="font-black mt-2">{s.t}</h4>
                <p className="text-sm text-[color:var(--ink)]/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* GAMES PREVIEW */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-20">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle eyebrow="MINI GAMES" title="Featured arcade quests"/>
          <Link to="/games" className="btn-game teal hidden sm:inline-flex">Browse all</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {t:"Logic Lava", e:"🧠", c:"var(--orange-pop)", xp:120, i:Lightbulb},
            {t:"Memory Reef", e:"🐙", c:"var(--teal-pop)", xp:80, i:Puzzle},
            {t:"Word Wizard", e:"🪄", c:"var(--sunny)", xp:140, i:Sparkles},
            {t:"Pixel Painter", e:"🎨", c:"var(--cherry)", xp:200, i:Palette},
          ].map((g) => (
            <div key={g.t} className="pixel-card p-4">
              <div className="aspect-[4/3] rounded-xl border-4 border-[color:var(--ink)] grid place-items-center text-6xl shadow-inner" style={{background: g.c}}>{g.e}</div>
              <div className="mt-3 flex items-center justify-between">
                <h4 className="font-black">{g.t}</h4>
                <span className="tag bg-[color:var(--sunny)]">+{g.xp} XP</span>
              </div>
              <Link to="/quiz" className="btn-game w-full mt-3">Play <g.i size={16}/></Link>
            </div>
          ))}
        </div>
      </section>

      {/* PARENT TRUST */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-20">
        <div className="pixel-card-flat bg-white text-gray-900 p-6 sm:p-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="tag bg-blue-100 text-blue-800">PARENT COMMAND CENTER</span>
            <h3 className="font-display text-3xl mt-3">See your child bloom</h3>
            <p className="mt-3 text-gray-600">Beautiful weekly reports. AI-explained strengths. Safe screen-time controls. All in one playful dashboard.</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[["Safe AI","🛡"],["Weekly Report","📊"],["Time Limits","⏱"]].map(([t,e])=>(
                <div key={t} className="rounded-xl border-4 border-gray-900 bg-gray-50 p-3 text-center">
                  <div className="text-2xl">{e}</div>
                  <div className="text-xs mt-1 font-bold">{t}</div>
                </div>
              ))}
            </div>
            <Link to="/parent" className="btn-game orange mt-6">Open Parent Zone</Link>
          </div>
          <div className="pixel-card bg-gray-50 text-gray-900 p-5">
            <div className="flex justify-between items-center"><div className="font-pixel text-[10px]">WEEKLY REPORT</div><span className="tag bg-[color:var(--grass)] text-white">+18%</span></div>
            <div className="mt-3 grid gap-2">
              {[["Logic", 82, "var(--sky-pop)"],["Creativity", 64, "var(--orange-pop)"],["Memory", 71, "var(--grass)"],["Communication", 58, "var(--cherry)"]].map(([n,v,c])=>(
                <div key={n as string}>
                  <div className="flex justify-between text-xs font-bold"><span>{n as string}</span><span>{v as number}%</span></div>
                  <div className="bar mt-1"><span style={{width:`${v}%`, background: c as string}}/></div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] p-3 text-sm font-bold">🤖 AI: "Aarav loves spatial puzzles — try architecture quests next!"</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-20">
        <SectionTitle eyebrow="LOVE NOTES" title="Heroes & parents say"/>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {n:"Aarav, 11", q:"I leveled up 4 times this week and beat the boss quiz! ⚔️", c:"var(--sunny)"},
            {n:"Priya (Mom)", q:"Finally a screen my kid asks for AND I trust.", c:"var(--teal-pop)"},
            {n:"Liam, 9", q:"The AI mentor said I'd be a great inventor!! 🚀", c:"var(--orange-pop)"},
          ].map((t)=>(
            <div key={t.n} className="pixel-card p-5 relative">
              <div className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]" style={{background: t.c}}>💬</div>
              <p className="mt-3 font-semibold">"{t.q}"</p>
              <div className="mt-3 font-pixel text-[10px] text-[color:var(--ink)]/60">— {t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 mt-20">
        <div className="pixel-card-flat bg-white text-gray-900 p-8 sm:p-12 text-center">
          <Map className="mx-auto animate-float text-orange-500" size={48}/>
          <h3 className="font-pixel text-xl sm:text-2xl mt-4">Ready, Player One?</h3>
          <p className="mt-2 font-semibold text-gray-600">Create a free hero and begin your first quest.</p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <Link to="/auth" className="btn-game">Create Hero</Link>
            <Link to="/dashboard" className="btn-game ghost">Try the demo</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="font-pixel text-[10px] text-[color:var(--cherry)]">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-black mt-2">{title}</h2>
    </div>
  );
}
