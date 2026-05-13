import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Send, Mic, Smile, Sparkles } from "lucide-react";

export const Route = createFileRoute("/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — MindBloom AI" }, { name: "description", content: "Chat with your friendly AI mentor for tips, encouragement and quests." }] }),
  component: Mentor,
});

type Msg = { role: "ai" | "me"; t: string };

function Mentor() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", t: "Hi Explorer! 🌟 I'm Bloomy, your AI mentor. Ready for today's quest?" },
    { role: "me", t: "What are my biggest strengths?" },
    { role: "ai", t: "You're a logic ⚡ champion! You also rock spatial puzzles. Want to try Pixel Painter to grow creativity too?" },
  ]);
  const [v, setV] = useState("");

  const send = () => {
    if (!v.trim()) return;
    setMsgs(m => [...m, { role: "me", t: v }, { role: "ai", t: "Great question! Let's explore that together 🚀" }]);
    setV("");
  };

  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Quest log sidebar */}
        <aside className="pixel-card-flat bg-[color:var(--ink)] text-[color:var(--cream)] p-4">
          <div className="font-pixel text-[10px] text-[color:var(--sunny)]">QUEST LOG</div>
          <div className="mt-3 space-y-2">
            {["Today's chat", "Career talk", "Logic boost", "Confidence quest", "Reading help"].map((c,i)=>(
              <div key={c} className={`rounded-lg border-4 px-3 py-2 text-sm font-bold ${i===0?"bg-[color:var(--sunny)] text-[color:var(--ink)] border-[color:var(--ink)]":"border-white/20 hover:bg-white/10 cursor-pointer"}`}>
                <div>{c}</div>
                <div className="text-[10px] opacity-70">2 min ago</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main chat */}
        <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-4 flex flex-col" style={{minHeight:"70vh"}}>
          {/* Header */}
          <div className="pixel-card bg-white p-4 flex items-center gap-3">
            <div className="text-4xl animate-bounce-soft">🤖</div>
            <div className="flex-1">
              <div className="font-black">Bloomy</div>
              <div className="text-xs flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--grass)] inline-block"/> Online · Cheerful mood ✨</div>
            </div>
            <span className="tag bg-[color:var(--sunny)]"><Sparkles size={12}/> Lvl 99 NPC</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {msgs.map((m,i)=>(
              <div key={i} className={`flex ${m.role==="me"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[80%] pixel-card p-3 ${m.role==="me"?"bg-[color:var(--sunny)]":"bg-white"} animate-pop`}>
                  <div className="font-pixel text-[9px] mb-1 opacity-60">{m.role==="me"?"YOU":"BLOOMY"}</div>
                  <div className="font-semibold">{m.t}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested prompts */}
          <div className="grid gap-2 sm:grid-cols-3 mb-3">
            {["What are my strengths?","How can I improve focus?","Which games should I play?"].map(s=>(
              <button key={s} onClick={()=>setV(s)} className="pixel-card bg-[color:var(--cream)] p-3 text-sm font-bold text-left hover:-translate-y-0.5 transition">
                💡 {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="pixel-card bg-white p-2 flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--orange-pop)] text-white shrink-0"><Mic size={16}/></button>
            <button className="grid h-10 w-10 place-items-center rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--sunny)] shrink-0"><Smile size={16}/></button>
            <input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask Bloomy anything..." className="flex-1 px-3 py-2 rounded-lg border-4 border-[color:var(--ink)] bg-[color:var(--cream)] font-semibold outline-none"/>
            <button onClick={send} className="btn-game cherry"><Send size={16}/> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
