import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { Trophy, Lock, Star } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — NexaQuest AI" }] }),
  component: Achievements,
});

const RARITY_COLORS: Record<string, string> = {
  Common: "bg-gray-100 border-gray-300",
  Rare: "bg-blue-50 border-blue-300",
  Epic: "bg-purple-50 border-purple-300",
  Legendary: "bg-yellow-50 border-yellow-400",
};

function Achievements() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    api.get("/achievements").then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">🏆</div><div className="font-pixel text-sm mt-4">Loading badges...</div></div>
    </div>
  );

  const achievements = data?.achievements ?? [];
  const filtered = achievements.filter((a: any) =>
    filter === "all" ? true : filter === "unlocked" ? a.unlocked : !a.unlocked
  );

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-5xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        <div className="pixel-card-flat p-6" style={{ background: "linear-gradient(to right, var(--sunny), var(--orange-pop))", color: "var(--ink)" }}>
          <div className="font-pixel text-[10px] opacity-70">HALL OF FAME</div>
          <h1 className="font-pixel text-2xl mt-1">🏆 Achievements</h1>
          <div className="mt-2 font-bold">{data?.unlocked_count ?? 0} / {data?.total_count ?? 0} badges unlocked</div>
          <div className="mt-2 h-3 bg-white/30 rounded-full border-2 border-[color:var(--ink)] overflow-hidden">
            <div className="h-full bg-[color:var(--ink)] rounded-full" style={{ width: `${data?.total_count ? (data.unlocked_count / data.total_count) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "unlocked", "locked"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn-game text-sm ${filter === f ? "" : "ghost"}`}>
              {f === "all" ? "All" : f === "unlocked" ? "✅ Unlocked" : "🔒 Locked"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a: any) => (
            <div key={a.id}
              className={`pixel-card-flat p-5 border-4 transition-all ${a.unlocked ? RARITY_COLORS[a.rarity] : "bg-gray-50 border-gray-200 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{a.unlocked ? a.emoji : "🔒"}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  a.rarity === "Legendary" ? "bg-yellow-200 text-yellow-800" :
                  a.rarity === "Epic" ? "bg-purple-200 text-purple-800" :
                  a.rarity === "Rare" ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-700"
                }`}>{a.rarity}</span>
              </div>
              <div className="mt-3">
                <div className="font-black text-base">{a.unlocked ? a.name : "???"}</div>
                <div className="text-sm opacity-70 mt-1">{a.description}</div>
                {a.xp_bonus > 0 && <div className="text-xs font-bold text-purple-600 mt-2">+{a.xp_bonus} XP Bonus</div>}
                {a.unlocked && a.unlocked_at && (
                  <div className="text-xs text-green-600 font-bold mt-1">
                    ✅ Unlocked {new Date(a.unlocked_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
