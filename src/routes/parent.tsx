import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { BarChart2, Award, Target, TrendingUp, FileText, Zap, User, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [{ title: "Parent Dashboard — NexaQuest AI" }] }),
  component: Parent,
});

function Parent() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [childForm, setChildForm] = useState({ name: "", heroName: "", email: "", password: "", age: "" });
  const [addingChild, setAddingChild] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddingChild(true);
    try {
      await api.post("/parent/children", {
        name: childForm.name,
        hero_name: childForm.heroName || childForm.name,
        email: childForm.email,
        password: childForm.password,
        age: parseInt(childForm.age) || 10,
      });
      // reload dashboard
      api.get("/parent/dashboard").then(r => {
        setData(r.data);
        if (r.data.children?.length > 0) setSelectedChild(r.data.children[0]);
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response?.data?.errors || {}).flat().join(" ")
        : "Failed to create child account.";
      setAddError(msg as string);
    } finally {
      setAddingChild(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "child") { navigate({ to: "/dashboard" }); return; }
    api.get("/parent/dashboard").then(r => {
      setData(r.data);
      if (r.data.children?.length > 0) setSelectedChild(r.data.children[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">👩</div><div className="font-pixel text-sm mt-4">Loading parent dashboard...</div></div>
    </div>
  );

  const children = data?.children ?? [];

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-6xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        {/* Header */}
        <div className="pixel-card-flat p-6" style={{ background: "linear-gradient(to right, var(--teal-pop), var(--sky-pop))", color: "var(--ink)" }}>
          <div className="font-pixel text-[10px] opacity-70">PARENT CENTER</div>
          <h1 className="font-pixel text-2xl mt-1">👩 {data?.parent?.name}'s Dashboard</h1>
          <p className="font-semibold mt-1 opacity-80">{children.length} child{children.length !== 1 ? "ren" : ""} tracked</p>
        </div>

        {children.length === 0 && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-6 sm:p-10 text-center max-w-xl mx-auto">
            <div className="text-5xl mb-4">👧</div>
            <div className="font-pixel text-xl mb-2">Welcome to the Parent Center!</div>
            <div className="text-sm font-semibold opacity-80 mb-6">Let's create your child's hero profile so they can start playing and learning.</div>
            
            {addError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border-2 border-red-400 rounded-xl px-3 py-2 text-red-700 text-sm font-semibold text-left">
                <AlertCircle size={16} className="shrink-0" /> {addError}
              </div>
            )}

            <form onSubmit={handleAddChild} className="space-y-3 text-left">
              <Field icon={User} label="Child's Name" placeholder="e.g. Aarav Mehta" value={childForm.name} onChange={(e: any) => setChildForm({ ...childForm, name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Field icon={User} label="Hero Name (Optional)" placeholder="e.g. PixelFox" value={childForm.heroName} onChange={(e: any) => setChildForm({ ...childForm, heroName: e.target.value })} />
                <Field icon={Target} label="Age" type="number" min="5" max="20" placeholder="10" value={childForm.age} onChange={(e: any) => setChildForm({ ...childForm, age: e.target.value })} required />
              </div>
              <div className="font-pixel text-[9px] text-[color:var(--cherry)] mt-4 mb-1">CHILD'S LOGIN DETAILS</div>
              <Field icon={Mail} label="Child's Login Email" type="email" placeholder="child@nexaquest.ai" value={childForm.email} onChange={(e: any) => setChildForm({ ...childForm, email: e.target.value })} required />
              <Field icon={Lock} label="Child's Password" type="password" placeholder="••••••••" value={childForm.password} onChange={(e: any) => setChildForm({ ...childForm, password: e.target.value })} required />
              
              <button type="submit" className="btn-game orange w-full mt-4" disabled={addingChild}>
                {addingChild ? "Creating..." : <><Sparkles size={16} /> Create Child Account</>}
              </button>
            </form>
          </div>
        )}

        {children.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {children.map((c: any) => (
              <button key={c.id} onClick={() => setSelectedChild(c)}
                className={`btn-game text-sm ${selectedChild?.id === c.id ? "" : "ghost"}`}>
                {c.avatar_emoji} {c.hero_name ?? c.name}
              </button>
            ))}
          </div>
        )}

        {selectedChild && (
          <div className="space-y-5">

            {/* Child hero card */}
            <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
              <div className="flex items-center gap-5 flex-wrap">
                <div className="text-6xl">{selectedChild.avatar_emoji}</div>
                <div className="flex-1">
                  <h2 className="font-black text-2xl">{selectedChild.hero_name ?? selectedChild.name}</h2>
                  <div className="text-sm opacity-70 mt-0.5">
                    Level {selectedChild.level} · {selectedChild.xp} XP · 🔥 {selectedChild.streak_count} day streak
                  </div>
                  {/* XP bar */}
                  <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-[color:var(--ink)] max-w-xs">
                    <div className="h-full bg-gradient-to-r from-[color:var(--teal-pop)] to-[color:var(--sky-pop)] rounded-full transition-all"
                      style={{ width: `${Math.min((selectedChild.xp % 1000) / 10, 100)}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard emoji="🎮" value={selectedChild.quizzes_taken} label="Quizzes" color="bg-purple-50" />
                  <StatCard emoji="🏆" value={selectedChild.badges_count} label="Badges" color="bg-yellow-50" />
                  <StatCard emoji="📊" value={`${selectedChild.avg_weekly_score}%`} label="Avg Score" color="bg-green-50" />
                  <StatCard emoji="🗺️" value={`${selectedChild.missions_done ?? 0}/${selectedChild.missions_today ?? 0}`} label="Missions" color="bg-blue-50" />
                </div>
              </div>
            </div>

            {/* Quick nav to detail pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/parent-progress" search={{ childId: selectedChild.id }}
                className="pixel-card-flat bg-[color:var(--cream)] p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="text-4xl p-3 rounded-2xl border-4 border-[color:var(--ink)] bg-[color:var(--teal-pop)]/20 group-hover:scale-110 transition-transform">
                  <BarChart2 size={28} />
                </div>
                <div>
                  <div className="font-black text-lg">Weekly Progress</div>
                  <div className="text-sm opacity-60">Charts, quiz history & skill growth</div>
                </div>
              </Link>

              <Link to="/parent-report" search={{ childId: selectedChild.id }}
                className="pixel-card-flat bg-[color:var(--cream)] p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="text-4xl p-3 rounded-2xl border-4 border-[color:var(--ink)] bg-[color:var(--sunny)]/30 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <div>
                  <div className="font-black text-lg">AI Report</div>
                  <div className="text-sm opacity-60">Aptitude summary, career matches & PDF</div>
                </div>
              </Link>
            </div>

            {/* Skill breakdown */}
            <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
              <div className="font-pixel text-[10px] mb-4">⚡ SKILL BREAKDOWN</div>
              {selectedChild.skill_scores?.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-4">No quiz data yet. Encourage your child to play!</p>
              ) : (
                <div className="space-y-3">
                  {(selectedChild.skill_scores ?? []).map((s: any) => (
                    <div key={s.category}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{s.category}</span><span>{s.score}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-[color:var(--ink)]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--teal-pop)] to-[color:var(--sky-pop)] transition-all"
                          style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key insights + top careers */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="pixel-card-flat bg-green-50 p-5">
                <div className="font-pixel text-[10px] mb-3">💪 KEY INSIGHTS</div>
                <div className="space-y-2 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-600" />
                    Strongest: <strong>{selectedChild.strongest_skill ?? "Not yet"}</strong> ({selectedChild.strongest_score ?? 0}%)
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-orange-500" />
                    Growth Area: <strong>{selectedChild.weakest_skill ?? "Not yet"}</strong>
                  </div>
                </div>
              </div>

              {selectedChild.top_careers?.length > 0 && (
                <div className="pixel-card-flat bg-purple-50 p-5">
                  <div className="font-pixel text-[10px] mb-3">🚀 TOP CAREER MATCHES</div>
                  <div className="space-y-2">
                    {selectedChild.top_careers.slice(0, 3).map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between text-sm font-semibold">
                        <span>{c.career_emoji} {c.career_title}</span>
                        <span className="text-green-600 font-black">{c.match_percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent activity */}
            {selectedChild.recent_activity?.length > 0 && (
              <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
                <div className="font-pixel text-[10px] mb-4">📜 RECENT ACTIVITY</div>
                <div className="space-y-2">
                  {selectedChild.recent_activity.slice(0, 5).map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between pixel-card bg-white p-3 text-sm">
                      <span className="font-bold">Quiz #{a.quiz_id}</span>
                      <div className="flex gap-4 font-semibold">
                        <span className="text-green-600">{a.score}%</span>
                        <span className="text-purple-600 flex items-center gap-1"><Zap size={12} /> +{a.xp_earned} XP</span>
                        <span className="text-gray-400 hidden sm:block">{a.completed_at ? new Date(a.completed_at).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label, color }: { emoji: string; value: any; label: string; color: string }) {
  return (
    <div className={`pixel-card ${color} p-3 text-center`}>
      <div className="text-2xl">{emoji}</div>
      <div className="font-black text-lg leading-none mt-1">{value}</div>
      <div className="font-pixel text-[8px] opacity-60 mt-0.5">{label}</div>
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
