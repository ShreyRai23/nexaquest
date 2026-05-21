import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Download, RefreshCw, Brain, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/parent-report")({
  head: () => ({ meta: [{ title: "AI Report — MindBloom AI" }] }),
  component: ReportPage,
  validateSearch: (s: Record<string, unknown>) => ({ childId: Number(s.childId ?? 0) }),
});


function ReportPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { childId } = Route.useSearch();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [resolvedChildId, setResolvedChildId] = useState<number>(childId);

  const load = (id: number) => {
    setLoading(true);
    api.get(`/parent/children/${id}/report/latest`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "child") { navigate({ to: "/dashboard" }); return; }
    
    if (childId) {
      setResolvedChildId(childId);
      load(childId);
    } else {
      // No childId in URL (came from navbar) — auto-pick the first child
      api.get("/parent/dashboard")
        .then(r => {
          const first = r.data.children?.[0];
          if (first) {
            setResolvedChildId(first.id);
            load(first.id);
          } else {
            navigate({ to: "/parent" });
          }
        })
        .catch(() => navigate({ to: "/parent" }));
    }
  }, [isAuthenticated, childId]);

  const generate = async () => {
    if (!resolvedChildId) return;
    setGenerating(true);
    try {
      await api.post(`/parent/children/${resolvedChildId}/report`);
      showToast("✅ New AI report generated!");
      load(resolvedChildId);
    } catch (e: any) {
      showToast(e.response?.data?.message ?? "Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = () => {
    const report = data?.report;
    if (!report || !resolvedChildId) return;
    const token = localStorage.getItem("mb.token");
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/parent/children/${resolvedChildId}/report/${report.id}/pdf`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    // Append token as query param so the server can read it (or open in new tab)
    a.href = url + "?token=" + token;
    a.click();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const report = data?.report;
  const careers: any[] = data?.careers ?? [];
  const child = data?.child;

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">🤖</div><div className="font-pixel text-sm mt-4">Loading AI report...</div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-2xl border-4 border-[color:var(--ink)] shadow-[4px_4px_0_0_var(--ink)] font-bold text-sm bg-[color:var(--sunny)] text-[color:var(--ink)]">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-4xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        {/* Header */}
        <div className="pixel-card-flat p-5" style={{ background: "linear-gradient(to right, var(--sunny), var(--orange-pop, #fb923c))", color: "var(--ink)" }}>
          <button onClick={() => navigate({ to: "/parent" })} className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 mb-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-pixel text-xl">🤖 AI Aptitude Report</h1>
              {child && <p className="mt-1 font-semibold opacity-80">For {child.hero_name ?? child.user?.name}</p>}
              {report && <p className="text-xs opacity-60 mt-0.5">Generated on {new Date(report.created_at).toLocaleDateString()}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={generate} disabled={generating}
                className="btn-game ghost flex items-center gap-2 text-sm">
                {generating
                  ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
                  : <><RefreshCw size={14} /> {report ? "Regenerate" : "Generate Report"}</>
                }
              </button>
              {report && (
                <button onClick={downloadPdf} className="btn-game orange flex items-center gap-2 text-sm">
                  <Download size={14} /> Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {!report && !generating && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-10 text-center">
            <div className="text-6xl mb-4">📄</div>
            <div className="font-pixel text-sm mb-2">No report yet!</div>
            <p className="text-sm opacity-60 mb-6">Click "Generate Report" to create an AI-powered aptitude summary for your child. Requires at least one completed quiz.</p>
            <button onClick={generate} disabled={generating}
              className="btn-game orange flex items-center gap-2 mx-auto text-sm">
              {generating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate AI Report</>}
            </button>
          </div>
        )}

        {generating && !report && (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-10 text-center">
            <div className="text-6xl mb-4 animate-pulse">🤖</div>
            <div className="font-pixel text-sm">Bloomy is analysing your child's data...</div>
            <p className="text-sm opacity-60 mt-2">This usually takes 10–20 seconds.</p>
          </div>
        )}

        {report && (
          <>
            {/* Summary */}
            <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
              <div className="flex items-center gap-2 font-pixel text-[10px] mb-3">
                <Brain size={14} /> AI SUMMARY
              </div>
              <p className="text-sm leading-relaxed">{report.summary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <InfoTag label="Top Strength" value={report.top_strength} emoji="💪" color="bg-green-50 border-green-300" />
                <InfoTag label="Learning Style" value={report.learning_style} emoji="🧠" color="bg-blue-50 border-blue-300" />
                <InfoTag label="Personality Type" value={report.personality_type} emoji="✨" color="bg-purple-50 border-purple-300" />
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="pixel-card-flat bg-green-50 p-5">
                <div className="font-pixel text-[10px] mb-3">💚 STRENGTHS</div>
                <ul className="space-y-2">
                  {(report.strengths_json ?? []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold">
                      <span className="text-green-500 mt-0.5">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pixel-card-flat bg-orange-50 p-5">
                <div className="font-pixel text-[10px] mb-3">🎯 GROWTH AREAS</div>
                <ul className="space-y-2">
                  {(report.weaknesses_json ?? []).map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold">
                      <span className="text-orange-500 mt-0.5">→</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {report.recommendations_json?.length > 0 && (
              <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
                <div className="font-pixel text-[10px] mb-3">💡 PARENT RECOMMENDATIONS</div>
                <ul className="space-y-2">
                  {report.recommendations_json.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold">
                      <span className="text-blue-500 mt-0.5 shrink-0">{i + 1}.</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Career matches */}
            {careers.length > 0 && (
              <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
                <div className="font-pixel text-[10px] mb-4">🚀 CAREER MATCHES</div>
                <div className="space-y-3">
                  {careers.map((c: any) => (
                    <div key={c.id} className="pixel-card bg-purple-50 p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-base">{c.career_emoji} {c.career_title}</span>
                        <span className="font-black text-green-600 text-lg">{c.match_percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden border border-purple-300 mb-2">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                          style={{ width: `${c.match_percentage}%` }} />
                      </div>
                      <p className="text-xs opacity-70">{c.ai_reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfoTag({ label, value, emoji, color }: { label: string; value: string; emoji: string; color: string }) {
  return (
    <div className={`pixel-card border-2 ${color} p-3 text-center`}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-pixel text-[8px] opacity-60 mb-1">{label.toUpperCase()}</div>
      <div className="font-black text-sm leading-tight">{value}</div>
    </div>
  );
}
