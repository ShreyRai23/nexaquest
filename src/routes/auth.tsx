import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Mail, Lock, User, Sparkles, Baby, Users } from "lucide-react";
import { setRole as persistRole } from "@/lib/role";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — MindBloom AI" }, { name: "description", content: "Enter the magical academy. Sign in or create your hero." }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<"child" | "parent">("child");
  const navigate = useNavigate();
  const enter = (e: React.FormEvent) => {
    e.preventDefault();
    persistRole(role);
    navigate({ to: role === "parent" ? "/parent" : "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <div className="mx-auto max-w-6xl px-3 sm:px-6 mt-6 grid gap-6 lg:grid-cols-2 items-center">
        {/* Illustration */}
        <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-8 relative overflow-hidden min-h-[420px]">
          <div className="absolute top-6 left-6 text-7xl animate-bounce-soft">🦊</div>
          <div className="absolute top-10 right-12 text-5xl animate-float">🌟</div>
          <div className="absolute bottom-10 left-12 text-5xl animate-wiggle">🪄</div>
          <div className="absolute bottom-20 right-8 text-6xl animate-float">🏰</div>
          <div className="absolute bottom-6 right-32 text-4xl animate-bounce-soft">🎮</div>
          <div className="relative z-10 mt-40 text-center">
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">MAGICAL ACADEMY</div>
            <h2 className="font-pixel text-2xl mt-2">Welcome, hero!</h2>
            <p className="mt-3 font-semibold max-w-sm mx-auto">Your AI mentor is waiting at the gates. Pick a path and step inside the adventure.</p>
          </div>
        </div>

        {/* Form */}
        <div className="pixel-card-flat bg-[color:var(--cream)] p-6 sm:p-8">
          <div className="flex gap-2">
            <button onClick={()=>setMode("in")} className={`flex-1 btn-game ${mode==="in"?"":"ghost"}`}>Sign In</button>
            <button onClick={()=>setMode("up")} className={`flex-1 btn-game ${mode==="up"?"teal":"ghost"}`}>Create Hero</button>
          </div>

          <div className="mt-5">
            <div className="font-pixel text-[10px] text-[color:var(--cherry)]">PICK YOUR ROLE</div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button onClick={()=>setRole("child")} className={`pixel-card p-4 text-left ${role==="child"?"bg-[color:var(--sunny)]":"bg-white"}`}>
                <Baby size={22}/>
                <div className="font-black mt-2">Child</div>
                <div className="text-xs">Ages 8–16 · Play & learn</div>
              </button>
              <button onClick={()=>setRole("parent")} className={`pixel-card p-4 text-left ${role==="parent"?"bg-[color:var(--teal-pop)]":"bg-white"}`}>
                <Users size={22}/>
                <div className="font-black mt-2">Parent</div>
                <div className="text-xs">See progress & insights</div>
              </button>
            </div>
          </div>

          <form className="space-y-3 mt-5" onSubmit={(e)=>e.preventDefault()}>
            {mode==="up" && (
              <Field icon={User} label="Hero name" placeholder="e.g. PixelFox"/>
            )}
            <Field icon={Mail} label="Email" placeholder="hero@mindbloom.ai" type="email"/>
            <Field icon={Lock} label="Password" placeholder="••••••••" type="password"/>
            <Link to="/dashboard" className="btn-game orange w-full">
              <Sparkles size={16}/> {mode==="in"?"Enter Academy":"Begin Adventure"}
            </Link>
          </form>

          <div className="mt-4 text-center text-xs text-[color:var(--ink)]/60">
            By continuing you agree to our playful Terms ✨
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...rest }: any) {
  return (
    <label className="block">
      <span className="font-pixel text-[9px] text-[color:var(--ink)]/70">{label.toUpperCase()}</span>
      <div className="mt-1 flex items-center gap-2 rounded-xl border-4 border-[color:var(--ink)] bg-white px-3 py-2 shadow-[3px_3px_0_0_var(--ink)] focus-within:-translate-y-0.5 transition">
        <Icon size={16} className="text-[color:var(--ink)]/60"/>
        <input {...rest} className="flex-1 outline-none font-semibold bg-transparent"/>
      </div>
    </label>
  );
}
