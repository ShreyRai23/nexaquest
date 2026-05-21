import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState, useCallback } from "react";
import { CheckCircle, Zap, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/missions")({
  head: () => ({ meta: [{ title: "Missions — NexaQuest AI" }] }),
  component: Missions,
});

type MissionStatus = "pending" | "ready_to_claim" | "completed";

interface MissionItem {
  id: number;
  status: MissionStatus;
  completed_at: string | null;
  assigned_date: string;
  progress_count: number;
  required_count: number;
  mission: {
    id: number;
    title: string;
    description: string;
    category: string;
    emoji: string;
    xp_reward: number;
  };
}

function Missions() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    loadMissions();
  }, [isAuthenticated]);

  const loadMissions = useCallback(() => {
    api.get("/missions/today")
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const claimMission = async (progressId: number, xpReward: number) => {
    setClaiming(progressId);
    try {
      const res = await api.post(`/missions/${progressId}/claim`);
      showToast(`🎉 +${xpReward} XP claimed!`, "success");
      if (res.data.new_achievements?.length > 0) {
        setTimeout(() => showToast(`🏆 Achievement unlocked: ${res.data.new_achievements[0].name}!`, "success"), 1500);
      }
      // Refresh both mission list and user XP in parallel
      await Promise.all([loadMissions(), refreshUser()]);
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to claim mission", "error");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) return <LoadingScreen />;

  const missions: MissionItem[] = data?.missions ?? [];
  const completed = data?.completed ?? 0;
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-2xl border-4 border-[color:var(--ink)] shadow-[4px_4px_0_0_var(--ink)] font-bold text-sm transition-all ${
          toast.type === "success"
            ? "bg-[color:var(--sunny)] text-[color:var(--ink)]"
            : "bg-[color:var(--cherry)] text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-4xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        {/* Header */}
        <div
          className="pixel-card-flat p-6"
          style={{ background: "linear-gradient(to right, var(--teal-pop), var(--sky-pop))", color: "var(--ink)" }}
        >
          <div className="font-pixel text-[10px] opacity-70">TODAY'S QUEST BOARD</div>
          <h1 className="font-pixel text-2xl mt-1">🗺️ Daily Missions</h1>
          <div className="mt-3">
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>{completed}/{total} completed</span>
              {data?.all_done && <span className="text-green-700">🎉 All done!</span>}
            </div>
            <div className="h-4 bg-white/30 rounded-full overflow-hidden border-2 border-[color:var(--ink)]">
              <div
                className="h-full bg-[color:var(--ink)] rounded-full transition-all duration-700"
                style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Mission cards */}
        <div className="space-y-4">
          {missions.length === 0 && (
            <div className="pixel-card-flat bg-[color:var(--cream)] p-8 text-center">
              <div className="text-5xl mb-3">🎯</div>
              <div className="font-pixel text-sm">No missions today yet. Check back soon!</div>
            </div>
          )}

          {missions.map((m) => {
            const pct = m.required_count > 0
              ? Math.round((m.progress_count / m.required_count) * 100)
              : 0;
            const isCompleted = m.status === "completed";
            const isReady = m.status === "ready_to_claim";
            const isClaiming = claiming === m.id;

            return (
              <div
                key={m.id}
                className={`pixel-card-flat p-5 transition-all ${
                  isCompleted
                    ? "bg-green-50 border-green-400"
                    : isReady
                      ? "bg-[color:var(--sunny)]/20 border-[color:var(--sunny)] hover:-translate-y-0.5"
                      : "bg-[color:var(--cream)] hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: icon + info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-4xl shrink-0">{m.mission?.emoji ?? "🎯"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-lg leading-tight">{m.mission?.title}</div>
                      <div className="text-sm opacity-70 mt-0.5">{m.mission?.description}</div>
                      <div className="mt-1.5 flex gap-2 text-xs font-bold flex-wrap">
                        <span className="px-2 py-0.5 rounded-full border-2 border-purple-400 text-purple-600">
                          {m.mission?.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full border-2 border-yellow-400 text-yellow-700">
                          +{m.mission?.xp_reward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: status */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle size={36} className="text-green-500" />
                        <span className="font-pixel text-[8px] text-green-600">CLAIMED</span>
                      </div>
                    ) : isReady ? (
                      <button
                        onClick={() => claimMission(m.id, m.mission.xp_reward)}
                        disabled={isClaiming}
                        className="btn-game orange flex items-center gap-2 text-sm px-4 py-2"
                      >
                        {isClaiming
                          ? <><Loader2 size={15} className="animate-spin" /> Claiming...</>
                          : <><Zap size={15} /> Claim XP!</>
                        }
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="font-pixel text-[9px] text-[color:var(--ink)]/60 mb-1">
                          {m.progress_count}/{m.required_count}
                        </div>
                        <div className="w-16 h-16 relative">
                          <CircleProgress pct={pct} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar — only for in-progress missions */}
                {!isCompleted && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold mb-1 opacity-70">
                      <span>
                        {isReady ? "✅ Target met!" : `${m.progress_count} of ${m.required_count} done`}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-3 bg-[color:var(--ink)]/10 rounded-full overflow-hidden border border-[color:var(--ink)]/20">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isReady
                            ? "bg-gradient-to-r from-[color:var(--sunny)] to-[color:var(--orange-pop)]"
                            : "bg-gradient-to-r from-[color:var(--teal-pop)] to-[color:var(--sky-pop)]"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {data?.all_done && (
          <div className="pixel-card-flat bg-[color:var(--sunny)] p-6 text-center">
            <div className="text-5xl">🏆</div>
            <div className="font-pixel text-sm mt-2">ALL MISSIONS COMPLETE!</div>
            <div className="font-semibold mt-1">You're a true hero! Come back tomorrow for more quests ⚡</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** SVG circle progress indicator */
function CircleProgress({ pct }: { pct: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="8" />
      <circle
        cx="32" cy="32" r={r} fill="none"
        stroke="var(--teal-pop)"
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.7s ease" }}
      />
    </svg>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-bounce">🗺️</div>
        <div className="font-pixel text-sm mt-4">Loading missions...</div>
      </div>
    </div>
  );
}
