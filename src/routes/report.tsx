import { createFileRoute } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useRoleGuard } from "@/lib/role";
import { Download, Award, Sparkles, Brain, Palette, Rocket, Crown, Microscope, Code2, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "AI Aptitude Report — MindBloom AI" }, { name: "description", content: "Personalized AI report: strengths, learning style, careers, growth missions." }] }),
  component: Report,
});

function Report() {
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 space-y-6">
        {/* Header */}
        <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-6 flex flex-wrap items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-[color:var(--ink)] bg-[color:var(--orange-pop)] text-4xl shadow-[4px_4px_0_0_var(--ink)]">🦊</div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">APTITUDE REPORT · SEASON 1</div>
            <h1 className="text-3xl font-black">Aarav Mehta</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="tag bg-[color:var(--sunny)]">LVL 12</span>
              <span className="tag bg-[color:var(--grass)] text-white"><Crown size={12}/> Rank: Explorer Gold</span>
              <span className="tag bg-white"><Sparkles size={12}/> AI Confidence 92%</span>
            </div>
          </div>
          <button className="btn-game orange"><Download size={16}/> Download Report</button>
        </div>

        {/* AI summary */}
        <div className="pixel-card-flat bg-[color:var(--sunny)] p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-white">🤖</div>
            <div className="font-pixel text-[10px]">AI SUMMARY</div>
          </div>
          <p className="mt-3 text-lg font-semibold">
            Aarav is a <span className="bg-white px-2 border-4 border-[color:var(--ink)] rounded-md">visual-spatial learner</span> with strong logical reasoning. He thrives on building, puzzles and stories — and shows early signs of inventor-style creativity. Recommend more team-based quests to grow communication.
          </p>
          <div className="grid gap-3 mt-4 sm:grid-cols-3">
            {[
              {t:"Top Strength", v:"Spatial Logic", c:"var(--teal-pop)"},
              {t:"Learning Style", v:"Visual + Hands-on", c:"var(--orange-pop)"},
              {t:"Personality", v:"Curious Inventor", c:"var(--cherry)"},
            ].map(s=>(
              <div key={s.t} className="rounded-xl border-4 border-[color:var(--ink)] p-3 text-white shadow-[3px_3px_0_0_var(--ink)]" style={{background: s.c}}>
                <div className="font-pixel text-[9px]">{s.t.toUpperCase()}</div>
                <div className="font-black mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="pixel-card p-5">
            <h3 className="text-xl font-black">Skill breakdown</h3>
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
            <h3 className="text-xl font-black">Weekly progress</h3>
            <BarsChart data={[40,55,48,72,68,80,86]}/>
          </div>
        </div>

        {/* Interest heatmap */}
        <div className="pixel-card-flat bg-white p-5">
          <h3 className="text-xl font-black">Interest heatmap</h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              {n:"Science", e:"🔬", v:88, c:"var(--teal-pop)"},
              {n:"Arts", e:"🎨", v:72, c:"var(--orange-pop)"},
              {n:"Tech", e:"💻", v:84, c:"var(--sky-pop)"},
              {n:"Leadership", e:"👑", v:55, c:"var(--sunny)"},
              {n:"Sports", e:"⚽", v:48, c:"var(--grass)"},
            ].map(i=>(
              <div key={i.n} className="rounded-xl border-4 border-[color:var(--ink)] p-4 text-center shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-1 transition" style={{background:i.c}}>
                <div className="text-4xl">{i.e}</div>
                <div className="font-black mt-1">{i.n}</div>
                <div className="font-pixel text-[10px] mt-1">{i.v}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended careers */}
        <div>
          <h3 className="text-xl font-black mb-3">🎯 Future career matches</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {n:"Scientist", i:Microscope, m:91, c:"var(--teal-pop)"},
              {n:"Game Designer", i:Sparkles, m:88, c:"var(--orange-pop)"},
              {n:"Engineer", i:Code2, m:84, c:"var(--sky-pop)"},
              {n:"Entrepreneur", i:Rocket, m:76, c:"var(--cherry)"},
            ].map(c=>(
              <div key={c.n} className="pixel-card p-4 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-xl border-4 border-[color:var(--ink)] mx-auto" style={{background: c.c, color:"white"}}>
                  <c.i size={28}/>
                </div>
                <div className="font-black mt-3">{c.n}</div>
                <div className="bar mt-2"><span style={{width:`${c.m}%`, background: c.c}}/></div>
                <div className="font-pixel text-[10px] mt-2">{c.m}% match</div>
                <button className="btn-game w-full mt-3">Unlock path</button>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement missions */}
        <div className="pixel-card-flat bg-[color:var(--teal-pop)] p-6">
          <h3 className="text-xl font-black">🚀 Growth missions from AI</h3>
          <div className="grid gap-4 mt-4 sm:grid-cols-3">
            {[
              {t:"Story Builder", d:"Boost communication +12%", i:Brain, c:"var(--cherry)"},
              {t:"Color Quest", d:"Explore creativity tracks", i:Palette, c:"var(--orange-pop)"},
              {t:"Lead the Squad", d:"Team challenge to grow leadership", i:Lightbulb, c:"var(--sunny)"},
            ].map(m=>(
              <div key={m.t} className="pixel-card p-4 bg-white">
                <m.i size={24} style={{color: m.c}}/>
                <div className="font-black mt-2">{m.t}</div>
                <p className="text-sm text-[color:var(--ink)]/70">{m.d}</p>
                <button className="btn-game mt-3" style={{background: m.c, color:"white"}}>Accept quest</button>
              </div>
            ))}
          </div>
        </div>

        <div className="pixel-card-flat bg-[color:var(--cherry)] text-white p-8 text-center">
          <Award size={40} className="mx-auto animate-bounce-soft"/>
          <h3 className="font-pixel text-xl mt-3">Ready to share?</h3>
          <p className="mt-2 font-semibold">Send this report to a parent, mentor or teacher.</p>
          <button className="btn-game mt-4"><Download size={16}/> Download PDF</button>
        </div>
      </div>
    </div>
  );
}

function BarsChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="mt-4 flex items-end gap-2 h-44 border-b-4 border-[color:var(--ink)] pb-2">
      {data.map((v,i)=>(
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md border-4 border-[color:var(--ink)] shadow-[2px_2px_0_0_var(--ink)]" style={{height: `${(v/max)*100}%`, background: ["var(--sunny)","var(--teal-pop)","var(--orange-pop)","var(--cherry)","var(--grass)","var(--sky-pop)","var(--grape)"][i]}}/>
          <div className="font-pixel text-[8px]">D{i+1}</div>
        </div>
      ))}
    </div>
  );
}
