import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Download } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "My Report — MindBloom AI" }] }),
  component: Report,
});

function Report() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    loadReport();
  }, [isAuthenticated]);

  const loadReport = () => {
    setLoading(true);
    api.get("/reports/latest").then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/reports/generate");
      setData({ report: res.data.report, careers: res.data.careers });
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = async () => {
    if (!data?.report?.id) return;
    try {
      const res = await api.get(`/reports/${data.report.id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url; a.download = "mindbloom-report.pdf"; a.click();
    } catch { alert("PDF download failed."); }
  };

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">📊</div><div className="font-pixel text-sm mt-4">Loading report...</div></div>
    </div>
  );

  const report = data?.report;
  const careers = data?.careers ?? [];

  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-4xl px-3 sm:px-6 pb-10 mt-8 space-y-6">

        <div className="pixel-card-flat p-6 text-white" style={{ background: "linear-gradient(to right, var(--orange-pop), var(--cherry))" }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-pixel text-[10px] opacity-70">AI APTITUDE</div>
              <h1 className="font-pixel text-2xl mt-1">📊 My Report</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={generateReport} disabled={generating} className="btn-game text-sm">
                {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                {generating ? "Generating..." : "New Report"}
              </button>
              {report && (
                <button onClick={downloadPdf} className="btn-game ghost text-sm">
                  <Download size={14} /> PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {!report ? (
          <div className="pixel-card-flat bg-[color:var(--cream)] p-8 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <div className="font-pixel text-sm mb-4">No report yet! Generate your first AI aptitude report.</div>
            <button onClick={generateReport} disabled={generating} className="btn-game orange">
              {generating ? "Generating... ⏳" : "✨ Generate AI Report"}
            </button>
            <div className="text-xs mt-3 opacity-60">Complete a few quizzes first for best results!</div>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
              <div className="font-pixel text-[10px] mb-3">🤖 AI SUMMARY</div>
              <p className="font-semibold text-base leading-relaxed">{report.summary}</p>
              <div className="grid grid-cols-3 gap-4 mt-5">
                {[
                  { label: "Top Strength", value: report.top_strength, emoji: "💪" },
                  { label: "Learning Style", value: report.learning_style, emoji: "🧠" },
                  { label: "Personality", value: report.personality_type, emoji: "🌟" },
                ].map(s => (
                  <div key={s.label} className="pixel-card bg-white p-3 text-center">
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="font-pixel text-[8px] mt-1 opacity-60">{s.label.toUpperCase()}</div>
                    <div className="font-black text-sm mt-1">{s.value ?? "—"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="pixel-card-flat bg-green-50 border-green-300 p-5">
                <div className="font-pixel text-[10px] mb-3">💪 STRENGTHS</div>
                <div className="space-y-2">
                  {(report.strengths_json ?? []).map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm font-semibold">
                      <span className="text-green-500 mt-0.5">✅</span> {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pixel-card-flat bg-orange-50 border-orange-300 p-5">
                <div className="font-pixel text-[10px] mb-3">📈 GROWTH AREAS</div>
                <div className="space-y-2">
                  {(report.weaknesses_json ?? []).map((w: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm font-semibold">
                      <span className="text-orange-500 mt-0.5">🎯</span> {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            {careers.length > 0 && (
              <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
                <div className="font-pixel text-[10px] mb-4">🚀 FUTURE CAREER MATCHES</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {careers.map((c: any, i: number) => (
                    <div key={i} className="pixel-card bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{c.career_emoji}</span>
                          <div className="font-black">{c.career_title}</div>
                        </div>
                        <div className="text-lg font-black text-green-600">{c.match_percentage}%</div>
                      </div>
                      <div className="text-xs mt-2 opacity-70">{c.ai_reasoning}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(c.skills_needed ?? []).map((s: string) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">{s}</span>
                        ))}
                      </div>
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
