import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { Zap, Trophy, Flame, Star, TrendingUp, BookOpen, Target, Cpu } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MindBloom AI" }] }),
  component: Dashboard,
});

const SKILL_COLORS: Record<string, string> = {
  Logic: "#6366f1", Creativity: "#ec4899", Memory: "#06b6d4",
  Communication: "#f59e0b", Leadership: "#10b981", "Problem Solving": "#8b5cf6",
  Focus: "#f43f5e", Innovation: "#14b8a6",
};

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    api.get("/dashboard").then(r => { setData(r.data); setLoading(false); })
      .catch(e => { setError(e.response?.data?.message || "Failed to load dashboard"); setLoading(false); });
  }, [isAuthenticated, user]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!data) return null;

  const { child, stats, skill_scores, ai_tips, recent_attempts } = data;

  const radarData = ["Logic", "Creativity", "Memory", "Communication", "Leadership", "Problem Solving", "Focus", "Innovation"].map(cat => ({
    category: cat.substring(0, 5),
    score: skill_scores.find((s: any) => s.category === cat)?.score ?? 0,
    fullCategory: cat,
  }));

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-6xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        {/* Hero header */}
        <div className="pixel-card-flat p-6 text-[color:var(--ink)]" style={{ background: "linear-gradient(to right, var(--cherry), var(--orange-pop), var(--sunny))" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{child.avatar_emoji}</div>
              <div>
                <div className="font-pixel text-[10px] opacity-70">WELCOME BACK</div>
                <h1 className="font-pixel text-2xl">{child.hero_name}</h1>
                <div className="font-bold mt-1">Level {child.level} Explorer ⚡ {child.xp} XP</div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <StatBadge icon="🔥" label="Streak" value={`${child.streak_count} days`} />
              <StatBadge icon="🏆" label="Badges" value={stats.badges_count} />
              <StatBadge icon="⚡" label="Today XP" value={`+${stats.today_xp}`} />
            </div>
          </div>
          {/* XP Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Level {child.level}</span>
              <span>{child.xp}/{child.xp_to_next_level} XP → Level {child.level + 1}</span>
            </div>
            <div className="h-4 bg-white/30 rounded-full overflow-hidden border-2 border-[color:var(--ink)]">
              <div className="h-full bg-[color:var(--ink)] rounded-full transition-all duration-1000"
                style={{ width: `${child.level_progress_pct}%` }} />
            </div>
          </div>
        </div>

        {/* AI Daily Tips */}
        {ai_tips?.length > 0 && (
          <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-5">
            <div className="font-pixel text-[10px] mb-3">🤖 BLOOMY'S DAILY TIPS</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {ai_tips.map((tip: string, i: number) => (
                <div key={i} className="pixel-card bg-white/80 p-3 text-sm font-semibold">{tip}</div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Skill Radar */}
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] mb-4">⚡ SKILL RADAR</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fontWeight: 700 }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Tooltip formatter={(v: any, _: any, props: any) => [`${v}%`, props.payload.fullCategory]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Bars */}
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] mb-4">📊 SKILL BREAKDOWN</div>
            <div className="space-y-3">
              {skill_scores.length === 0 && (
                <p className="text-center text-sm opacity-60 py-8">Complete quizzes to reveal your skills! 🎮</p>
              )}
              {skill_scores.map((s: any) => (
                <div key={s.category}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{s.category}</span><span>{s.score}%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-[color:var(--ink)]">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.score}%`, backgroundColor: SKILL_COLORS[s.category] ?? "#6366f1" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { to: "/quiz", emoji: "🎮", label: "Play Quiz", color: "bg-[color:var(--cherry)]" },
            { to: "/missions", emoji: "🗺️", label: "Missions", color: "bg-[color:var(--teal-pop)]" },
            { to: "/mentor", emoji: "🤖", label: "Ask Bloomy", color: "bg-[color:var(--grape)]" },
            { to: "/report", emoji: "📊", label: "My Report", color: "bg-[color:var(--orange-pop)]" },
          ].map(b => (
            <button key={b.to} onClick={() => navigate({ to: b.to })}
              className={`pixel-card-flat ${b.color} p-5 text-center hover:-translate-y-1 transition-transform`}>
              <div className="text-4xl">{b.emoji}</div>
              <div className="font-pixel text-[9px] mt-2">{b.label}</div>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        {recent_attempts?.length > 0 && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
            <div className="font-pixel text-[10px] mb-4">📜 RECENT ACTIVITY</div>
            <div className="space-y-2">
              {recent_attempts.slice(0, 5).map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between pixel-card bg-white p-3">
                  <div className="font-bold text-sm">Quiz #{a.quiz_id}</div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="text-green-600">Score: {a.score}%</span>
                    <span className="text-purple-600">+{a.xp_earned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value }: { icon: string; label: string; value: any }) {
  return (
    <div className="bg-white/30 backdrop-blur rounded-xl px-4 py-2 text-center border-2 border-[color:var(--ink)] hover:-translate-y-1 hover:shadow-lg transition-transform cursor-default">
      <div className="text-xl">{icon}</div>
      <div className="font-pixel text-[8px] opacity-70">{label}</div>
      <div className="font-black text-lg">{value}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🌸</div>
        <div className="font-pixel text-sm">Loading your adventure...</div>
      </div>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="pixel-card-flat bg-red-50 p-8 text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="font-pixel text-sm text-red-600">{message}</div>
        <a href="/auth" className="btn-game mt-4 inline-block">← Back to Login</a>
      </div>
    </div>
  );
}
