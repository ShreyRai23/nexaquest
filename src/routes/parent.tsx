import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, Brain, Shield, Download, BookOpen, Activity, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [{ title: "Parent Zone — MindBloom AI" }, { name: "description", content: "Parent analytics, AI insights and weekly reports." }] }),
  component: Parent,
});

function Parent() {
  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 space-y-6">
        <div className="pixel-card-flat bg-[color:var(--teal-pop)] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">PARENT COMMAND CENTER</div>
            <h1 className="text-3xl font-black">Hello, Priya 👋</h1>
            <p className="font-semibold">Aarav had a brilliant week — let's see the highlights.</p>
          </div>
          <button className="btn-game orange"><Download size={16}/> Weekly report</button>
        </div>

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {t:"Overall aptitude", v:"86", s:"+8 this week", i:Brain, c:"var(--sunny)"},
            {t:"Strongest skill", v:"Logic", s:"92 / 100", i:Lightbulb, c:"var(--orange-pop)"},
            {t:"Weekly growth", v:"+18%", s:"vs last week", i:TrendingUp, c:"var(--grass)"},
            {t:"AI confidence", v:"92%", s:"high accuracy", i:Shield, c:"var(--cherry)"},
          ].map(c=>(
            <div key={c.t} className="pixel-card p-4">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg border-4 border-[color:var(--ink)] text-white" style={{background: c.c}}><c.i size={18}/></div>
                <span className="tag bg-[color:var(--cream)]">7d</span>
              </div>
              <div className="font-pixel text-[10px] mt-3 text-[color:var(--ink)]/60">{c.t.toUpperCase()}</div>
              <div className="text-3xl font-black">{c.v}</div>
              <div className="text-xs text-[color:var(--ink)]/60">{c.s}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black">Skill radar</h3>
            <div className="mt-4 space-y-3">
              {[["Logic",92,"var(--teal-pop)"],["Creativity",78,"var(--orange-pop)"],["Memory",70,"var(--grass)"],["Communication",58,"var(--cherry)"],["Leadership",65,"var(--sunny)"]].map(([n,v,c])=>(
                <div key={n as string}>
                  <div className="flex justify-between text-sm font-bold"><span>{n as string}</span><span>{v as number}%</span></div>
                  <div className="bar mt-1"><span style={{width:`${v}%`, background: c as string}}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black">Interest analytics</h3>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {["🔬","🎨","💻","👑","⚽"].map((e,i)=>(
                <div key={i} className="rounded-lg border-4 border-[color:var(--ink)] p-2 text-center" style={{background: ["var(--teal-pop)","var(--orange-pop)","var(--sky-pop)","var(--sunny)","var(--grass)"][i]}}>
                  <div className="text-2xl">{e}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end gap-2 h-32 border-b-4 border-[color:var(--ink)] pb-1">
              {[40,55,48,72,68,80,86].map((v,i)=>(
                <div key={i} className="flex-1 rounded-t-md border-4 border-[color:var(--ink)]" style={{height:`${v}%`, background: ["var(--sunny)","var(--teal-pop)","var(--orange-pop)","var(--cherry)","var(--grass)","var(--sky-pop)","var(--grape)"][i]}}/>
              ))}
            </div>
          </div>
        </div>

        {/* AI insights */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {t:"Strengths", c:"var(--grass)", l:["Strong spatial logic","Persistent problem-solver","Visual learner"]},
            {t:"Growth areas", c:"var(--orange-pop)", l:["Open-ended writing","Group leadership tasks","Patience under time"]},
            {t:"Recommendations", c:"var(--teal-pop)", l:["Try story-building quests","Add 1 team challenge / wk","Limit timed quizzes to 2/day"]},
          ].map(a=>(
            <div key={a.t} className="pixel-card p-5">
              <div className="font-pixel text-[10px]" style={{color:a.c}}>AI INSIGHT</div>
              <h4 className="text-lg font-black mt-1">{a.t}</h4>
              <ul className="mt-3 space-y-2">
                {a.l.map(i=><li key={i} className="rounded-lg border-4 border-[color:var(--ink)] bg-white p-2 text-sm font-semibold flex gap-2"><span>•</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="pixel-card-flat bg-[color:var(--sunny)] p-6">
          <h3 className="text-xl font-black">📚 Learning recommendations</h3>
          <div className="grid gap-4 mt-4 sm:grid-cols-4">
            {[
              {t:"Curious by Ian Leslie", e:"📕", k:"Book"},
              {t:"Lego Spike Robotics", e:"🧱", k:"Activity"},
              {t:"Pixel Painter game", e:"🎨", k:"Game"},
              {t:"Astronomy nights", e:"🔭", k:"Hobby"},
            ].map(r=>(
              <div key={r.t} className="pixel-card p-3 bg-white">
                <div className="aspect-video rounded-lg border-4 border-[color:var(--ink)] grid place-items-center text-5xl bg-[color:var(--cream)]">{r.e}</div>
                <div className="text-xs font-pixel mt-2 text-[color:var(--cherry)]">{r.k.toUpperCase()}</div>
                <div className="font-black text-sm">{r.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity timeline + reports */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black flex items-center gap-2"><Activity size={20}/> Activity timeline</h3>
            <div className="mt-4 space-y-3">
              {[
                {t:"Tue · Cleared Logic Lava", e:"⚔️", x:"+250 XP"},
                {t:"Mon · Chatted with Bloomy", e:"🤖", x:"5 mins"},
                {t:"Sun · Earned Memory badge", e:"🏅", x:"new"},
                {t:"Sat · Joined creativity quest", e:"🎨", x:"+180 XP"},
              ].map(a=>(
                <div key={a.t} className="flex items-center gap-3 rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--cream)] p-3">
                  <div className="text-2xl">{a.e}</div>
                  <div className="flex-1 font-bold">{a.t}</div>
                  <span className="tag bg-[color:var(--sunny)]">{a.x}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black flex items-center gap-2"><BookOpen size={20}/> Report cards</h3>
            <div className="space-y-3 mt-4">
              {["Week 14 Report","Week 13 Report","Season 1 Summary"].map((r,i)=>(
                <div key={r} className="rounded-lg border-4 border-[color:var(--ink)] p-3 flex items-center justify-between" style={{background: ["var(--teal-pop)","var(--orange-pop)","var(--sunny)"][i]}}>
                  <div>
                    <div className="font-black text-sm">{r}</div>
                    <div className="text-xs">PDF · 2.3 MB</div>
                  </div>
                  <button className="btn-game ghost"><Download size={14}/></button>
                </div>
              ))}
            </div>
            <Link to="/report" className="btn-game w-full mt-4">Open full report</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
