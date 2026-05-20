import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/parent")({
  head: () => ({ meta: [{ title: "Parent Dashboard — MindBloom AI" }] }),
  component: Parent,
});

function Parent() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);

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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-pixel text-[10px] opacity-70">PARENT CENTER</div>
              <h1 className="font-pixel text-2xl mt-1">👩 {data?.parent?.name}'s Dashboard</h1>
              <div className="font-semibold mt-1">{children.length} child{children.length !== 1 ? "ren" : ""} tracked</div>
            </div>
            <button onClick={() => logout().then(() => navigate({ to: "/auth" }))} className="btn-game ghost text-sm">
              Sign Out
            </button>
          </div>
        </div>

        {children.length === 0 && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-8 text-center">
            <div className="text-5xl mb-4">👧</div>
            <div className="font-pixel text-sm mb-3">No children linked yet!</div>
            <div className="text-sm opacity-60">Ask your child to sign up and you'll see their progress here.</div>
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
          <div className="space-y-6">
            {/* Child Overview */}
            <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-5xl">{selectedChild.avatar_emoji}</div>
                <div className="flex-1">
                  <h2 className="font-black text-xl">{selectedChild.hero_name ?? selectedChild.name}</h2>
                  <div className="text-sm opacity-70">Level {selectedChild.level} · {selectedChild.xp} XP · 🔥 {selectedChild.streak_count} day streak</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Quizzes" value={selectedChild.quizzes_taken} emoji="🎮" />
                  <Stat label="Badges" value={selectedChild.badges_count} emoji="🏆" />
                  <Stat label="Avg Score" value={`${selectedChild.avg_weekly_score}%`} emoji="📊" />
                </div>
              </div>
            </div>

            {/* Skill Breakdown */}
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
                        <div className="h-full rounded-full bg-[color:var(--teal-pop)] transition-all" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strengths & Career */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="pixel-card-flat bg-green-50 p-5">
                <div className="font-pixel text-[10px] mb-3">💪 KEY INSIGHTS</div>
                <div className="space-y-2 text-sm font-semibold">
                  <div>🏆 Strongest: <strong>{selectedChild.strongest_skill ?? "Not yet"}</strong> ({selectedChild.strongest_score ?? 0}%)</div>
                  <div>📈 Growth Area: <strong>{selectedChild.weakest_skill ?? "Not yet"}</strong></div>
                </div>
              </div>
              {selectedChild.top_careers?.length > 0 && (
                <div className="pixel-card-flat bg-purple-50 p-5">
                  <div className="font-pixel text-[10px] mb-3">🚀 TOP CAREERS</div>
                  <div className="space-y-2">
                    {selectedChild.top_careers.slice(0, 3).map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between text-sm font-semibold">
                        <span>{c.career_emoji} {c.career_title}</span>
                        <span className="text-green-600">{c.match_percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {selectedChild.recent_activity?.length > 0 && (
              <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
                <div className="font-pixel text-[10px] mb-4">📜 RECENT ACTIVITY</div>
                <div className="space-y-2">
                  {selectedChild.recent_activity.slice(0, 7).map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between pixel-card bg-white p-3 text-sm">
                      <span className="font-bold">Quiz #{a.quiz_id}</span>
                      <div className="flex gap-4 font-semibold">
                        <span className="text-green-600">{a.score}%</span>
                        <span className="text-purple-600">+{a.xp_earned} XP</span>
                        <span className="text-gray-400">{a.completed_at ? new Date(a.completed_at).toLocaleDateString() : ""}</span>
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

function Stat({ label, value, emoji }: { label: string; value: any; emoji: string }) {
  return (
    <div className="pixel-card bg-white p-3 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="font-black text-lg">{value}</div>
      <div className="font-pixel text-[8px] opacity-60">{label}</div>
    </div>
  );
}
