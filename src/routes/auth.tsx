import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Mail, Lock, User, Sparkles, Baby, Users, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — MindBloom AI" }, { name: "description", content: "Enter the magical academy. Sign in or create your hero." }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<"child" | "parent">("child");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [heroName, setHeroName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const enter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "in") {
        await login(email, password);
      } else {
        await register({ name, email, password, role, hero_name: heroName || name });
      }
      navigate({ to: role === "parent" ? "/parent" : "/dashboard" });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response?.data?.errors || {}).flat().join(" ")
        : "Something went wrong. Please try again!";
      setError(msg as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <div className="mx-auto max-w-6xl px-3 sm:px-6 mt-8 grid gap-6 lg:grid-cols-2 items-center">
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
            <button onClick={() => setMode("in")} className={`flex-1 btn-game ${mode === "in" ? "" : "ghost"}`}>Sign In</button>
            <button onClick={() => { setMode("up"); setRole("parent"); }} className={`flex-1 btn-game ${mode === "up" ? "teal" : "ghost"}`}>Create Account</button>
          </div>

          {mode === "in" && (
            <div className="mt-5">
              <div className="font-pixel text-[10px] text-[color:var(--cherry)]">PICK YOUR ROLE</div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setRole("child")} 
                  className="pixel-card p-4 text-left transition-colors"
                  style={{ backgroundColor: role === "child" ? "var(--sunny)" : "white" }}
                >
                  <Baby size={22} />
                  <div className="font-black mt-2">Child</div>
                  <div className="text-xs">Ages 8–16 · Play &amp; learn</div>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole("parent")} 
                  className="pixel-card p-4 text-left transition-colors"
                  style={{ backgroundColor: role === "parent" ? "var(--teal-pop)" : "white" }}
                >
                  <Users size={22} />
                  <div className="font-black mt-2">Parent</div>
                  <div className="text-xs">See progress &amp; insights</div>
                </button>
              </div>
            </div>
          )}

          {mode === "up" && (
            <div className="mt-5 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm font-semibold text-blue-800">
              <div className="flex gap-2 items-start">
                <Users size={20} className="shrink-0 mt-0.5 text-blue-500" />
                <div>
                  Parents start here! Create your parent account first. You'll be able to create your child's hero profile inside the Parent Center.
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border-2 border-red-400 rounded-xl px-3 py-2 text-red-700 text-sm font-semibold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="space-y-3 mt-5" onSubmit={enter}>
            {mode === "up" && (
                <Field icon={User} label="Full name" placeholder="e.g. Priya Mehta" value={name} onChange={(e: any) => setName(e.target.value)} required />
            )}
            <Field icon={Mail} label="Email" placeholder="hero@mindbloom.ai" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
            <Field icon={Lock} label="Password" placeholder="••••••••" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-game orange w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">⏳ {mode === "in" ? "Entering..." : "Creating..."}</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} /> {mode === "in" ? (role === "parent" ? "Enter Parent Center" : "Enter Academy") : "Create Parent Account"}
                </span>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-xs">
            <div className="font-pixel text-[8px] text-purple-600 mb-1">DEMO ACCOUNTS</div>
            <div>🦊 Child: <strong>aarav@mindbloom.ai</strong> / password123</div>
            <div>👩 Parent: <strong>priya@mindbloom.ai</strong> / password123</div>
          </div>

          <div className="mt-3 text-center text-xs text-[color:var(--ink)]/60">
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
        <Icon size={16} className="text-[color:var(--ink)]/60" />
        <input {...rest} className="flex-1 outline-none font-semibold bg-transparent" />
      </div>
    </label>
  );
}
