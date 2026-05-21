import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/parent-progress")({
  head: () => ({ meta: [{ title: "Child Progress — NexaQuest AI" }] }),
  component: ProgressPage,
  validateSearch: (s: Record<string, unknown>) => ({ childId: Number(s.childId ?? 0) }),
});

function ProgressPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { childId } = Route.useSearch();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [resolvedChildId, setResolvedChildId] = useState<number>(childId);

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "child") { navigate({ to: "/dashboard" }); return; }

    const fetchProgress = (id: number) => {
      api.get(`/parent/children/${id}/progress`)
        .then(r => { setData(r.data); setLoading(false); })
        .catch(() => setLoading(false));
    };

    if (childId) {
      setResolvedChildId(childId);
      fetchProgress(childId);
    } else {
      // No childId in URL (came from navbar) — auto-pick the first child
      api.get("/parent/dashboard")
        .then(r => {
          const first = r.data.children?.[0];
          if (first) {
            setResolvedChildId(first.id);
            fetchProgress(first.id);
          } else {
            navigate({ to: "/parent" });
          }
        })
        .catch(() => navigate({ to: "/parent" }));
    }
  }, [isAuthenticated, childId]);

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">📊</div><div className="font-pixel text-sm mt-4">Loading progress data...</div></div>
    </div>
  );

  const child = data?.child;
  const daily: any[] = data?.daily_activity ?? [];
  const history: any[] = data?.quiz_history ?? [];
  const skills: any[] = data?.skill_scores ?? [];
  const achievements: any[] = data?.achievements ?? [];

  const scoreColor = (s: number) => s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-5xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        {/* Header */}
        <div className="pixel-card-flat p-5" style={{ background: "linear-gradient(to right, var(--teal-pop), var(--sky-pop))", color: "var(--ink)" }}>
          <button onClick={() => navigate({ to: "/parent" })} className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 mb-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="font-pixel text-xl">📈 {child?.hero_name}'s Progress</h1>
          <p className="mt-1 font-semibold opacity-80">Level {child?.level} · {child?.xp} XP · 🔥 {child?.streak_count} day streak</p>
        </div>

        {/* 14-day activity chart */}
        <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
          <div className="font-pixel text-[10px] mb-5">📅 LAST 14 DAYS — QUIZZES COMPLETED</div>
          {daily.every(d => d.quizzes === 0) ? (
            <p className="text-sm opacity-60 text-center py-6">No quiz activity yet. Encourage your child to start playing!</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: "bold" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontFamily: "Nunito", borderRadius: 10, border: "3px solid #1a1a2e", fontSize: 12 }}
                  formatter={(v: any, name: string) => [v, name === "quizzes" ? "Quizzes" : "Avg Score"]}
                />
                <Bar dataKey="quizzes" fill="var(--teal-pop)" radius={[6, 6, 0, 0]} name="quizzes" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Average score chart */}
        {!daily.every(d => d.avg_score === 0) && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
            <div className="font-pixel text-[10px] mb-5">🎯 LAST 14 DAYS — AVERAGE SCORE %</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: "bold" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontFamily: "Nunito", borderRadius: 10, border: "3px solid #1a1a2e", fontSize: 12 }}
                  formatter={(v: any) => [`${v}%`, "Avg Score"]} />
                <Bar dataKey="avg_score" fill="var(--orange-pop, #fb923c)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Skills + Achievements side by side */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] mb-4">⚡ SKILL SCORES</div>
            {skills.length === 0 ? (
              <p className="text-sm opacity-60">No skills data yet.</p>
            ) : (
              <div className="space-y-3">
                {skills.map((s: any) => (
                  <div key={s.category}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{s.category}</span><span>{s.score}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-[color:var(--ink)]/20">
                      <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--teal-pop)] to-[color:var(--sky-pop)]"
                        style={{ width: `${s.score}%`, transition: "width 0.7s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] mb-4">🏆 ACHIEVEMENTS EARNED</div>
            {achievements.length === 0 ? (
              <p className="text-sm opacity-60">No badges yet — keep going!</p>
            ) : (
              <div className="space-y-2">
                {achievements.map((a: any, i: number) => (
                  <div key={i} className="flex items-center justify-between pixel-card bg-yellow-50 p-2 text-sm">
                    <span className="font-bold">{a.emoji} {a.name}</span>
                    <span className="text-xs text-gray-400">{a.earned_at}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full quiz history table */}
        <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
          <div className="font-pixel text-[10px] mb-4">📜 QUIZ HISTORY (LAST 30)</div>
          {history.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-4">No quizzes completed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-pixel opacity-60 text-left">
                    <th className="pb-2 pr-4">QUIZ</th>
                    <th className="pb-2 pr-4">CATEGORY</th>
                    <th className="pb-2 pr-4">SCORE</th>
                    <th className="pb-2 pr-4">XP</th>
                    <th className="pb-2">DATE</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {history.map((h: any, i: number) => (
                    <tr key={i} className="border-t border-[color:var(--ink)]/10">
                      <td className="py-2 pr-4 font-bold">{h.quiz_name}</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 rounded-full border border-purple-300 text-purple-600 text-xs font-bold">{h.category}</span>
                      </td>
                      <td className={`py-2 pr-4 font-black ${scoreColor(h.score)}`}>{h.score}%</td>
                      <td className="py-2 pr-4 text-purple-600 font-bold">+{h.xp_earned}</td>
                      <td className="py-2 text-gray-400 text-xs">{h.completed_at ? new Date(h.completed_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
