import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz Arena — NexaQuest AI" }] }),
  component: QuizPage,
});

type Phase = "list" | "playing" | "result";

function QuizPage() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("list");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    api.get("/quizzes").then(r => { setQuizzes(r.data.quizzes); setLoading(false); }).catch(() => setLoading(false));
  }, [isAuthenticated]);

  const startQuiz = async (quiz: any) => {
    setGenerating(true);
    try {
      const res = await api.get(`/quizzes/${quiz.id}`);
      setActiveQuiz(res.data.quiz);
      setQuestions(res.data.quiz.questions);
      setCurrentQ(0);
      setAnswers({});
      setSelected(null);
      setStartTime(Date.now());
      setPhase("playing");
    } catch (e) { alert("Failed to load quiz. Try again!"); }
    finally { setGenerating(false); }
  };

  const selectAnswer = (opt: string) => {
    setSelected(opt);
    setAnswers(a => ({ ...a, [questions[currentQ].id]: opt }));
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const answersPayload = Object.entries(answers).map(([qid, opt]) => ({
        question_id: parseInt(qid),
        selected_option: opt,
      }));
      const res = await api.post(`/quizzes/${activeQuiz.id}/submit`, {
        answers: answersPayload,
        time_taken_seconds: timeTaken,
      });
      setResult(res.data);
      setPhase("result");
      // Refresh user so XP/level in navbar updates immediately
      refreshUser();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">🎮</div><div className="font-pixel text-sm mt-4">Loading quizzes...</div></div>
    </div>
  );

  if (generating) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-pulse">🤖</div><div className="font-pixel text-sm mt-4 text-[color:var(--ink)]">Bloomy is generating questions...</div></div>
    </div>
  );

  // ─── QUIZ LIST ───────────────────────────────────────────────
  if (phase === "list") {
    const filtered = filter
      ? quizzes.filter(q => q.category === filter)
      : quizzes;

    const categories = [...new Set(quizzes.map(q => q.category))];

    return (
      <div className="min-h-screen bg-dots">
        <RoleNavbar />
        <div className="mx-auto max-w-5xl px-3 sm:px-6 pb-10 mt-8 space-y-6">
          <div className="pixel-card-flat p-6 text-white" style={{ background: "linear-gradient(to right, var(--cherry), var(--grape))" }}>
            <div className="font-pixel text-[10px] opacity-70">ADVENTURE MODE</div>
            <h1 className="font-pixel text-2xl mt-1">🎮 Quiz Arena</h1>
            <div className="font-semibold mt-1">{quizzes.length} quizzes ready · AI-generated questions</div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("")} className={`btn-game text-sm ${!filter ? "" : "ghost"}`}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`btn-game text-sm ${filter === cat ? "" : "ghost"}`}>{cat}</button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((quiz: any) => (
              <div key={quiz.id} className="pixel-card-flat bg-[color:var(--cream)] p-5 hover:-translate-y-1 transition-transform cursor-pointer"
                onClick={() => startQuiz(quiz)}>
                <div className="text-4xl">{quiz.emoji}</div>
                <div className="font-black mt-2 text-base">{quiz.title}</div>
                <div className="text-xs opacity-60 mt-1">{quiz.description}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2 text-xs font-bold">
                    <span className={`px-2 py-0.5 rounded-full border-2 ${quiz.difficulty === "Easy" ? "border-green-400 text-green-700" : quiz.difficulty === "Medium" ? "border-yellow-400 text-yellow-700" : "border-red-400 text-red-700"}`}>
                      {quiz.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-full border-2 border-purple-400 text-purple-700">{quiz.category}</span>
                  </div>
                  <span className="text-xs font-bold text-yellow-700">+{quiz.xp_reward} XP</span>
                </div>
                <div className="text-xs mt-2 opacity-50">{quiz.questions_count} questions</div>
                <button className="btn-game mt-3 w-full text-sm">Play! →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ─────────────────────────────────────────────────
  if (phase === "playing") {
    const q = questions[currentQ];
    const options = [
      { key: "a", text: q?.option_a },
      { key: "b", text: q?.option_b },
      { key: "c", text: q?.option_c },
      { key: "d", text: q?.option_d },
    ];

    return (
      <div className="min-h-screen bg-dots flex flex-col">
        <RoleNavbar />
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-6 mt-8 space-y-4">
          <div className="pixel-card-flat bg-[color:var(--sky-pop)] p-4">
            <div className="flex justify-between items-center">
              <div className="font-pixel text-[10px]">{activeQuiz?.title}</div>
              <div className="font-pixel text-[10px]">{currentQ + 1}/{questions.length}</div>
            </div>
            <div className="mt-2 h-3 bg-white/40 rounded-full overflow-hidden border-2 border-[color:var(--ink)]">
              <div className="h-full bg-[color:var(--ink)] rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="pixel-card-flat bg-[color:var(--cream)] p-6">
            <div className="font-pixel text-[10px] mb-3">QUESTION {currentQ + 1}</div>
            <h2 className="text-xl font-black leading-relaxed">{q?.question_text}</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {options.map(opt => {
              const isSelected = selected === opt.key;
              const cls = `pixel-card-flat p-4 text-left font-bold text-base hover:-translate-y-0.5 transition-transform cursor-pointer`;
              return (
                <button 
                  key={opt.key} 
                  onClick={() => selectAnswer(opt.key)} 
                  className={cls}
                  style={{
                    backgroundColor: isSelected ? 'var(--cherry)' : 'white',
                    color: isSelected ? 'white' : 'var(--ink)'
                  }}
                >
                  <span className="font-pixel text-[10px] mr-3 uppercase">{opt.key}.</span> {opt.text}
                </button>
              );
            })}
          </div>

          {selected && (
            <button onClick={nextQuestion} disabled={submitting} className="btn-game orange w-full">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : currentQ < questions.length - 1 ? "Next Question →" : "Submit Quiz! 🎯"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dots">
      <RoleNavbar />
      <div className="mx-auto max-w-2xl px-3 sm:px-6 mt-8 space-y-6">
        <div className={`pixel-card-flat p-8 text-center ${result?.score >= 70 ? "bg-[color:var(--sunny)]" : "bg-[color:var(--sky-pop)]"}`}>
          <div className="text-6xl">{result?.score >= 90 ? "🏆" : result?.score >= 70 ? "⭐" : "💪"}</div>
          <div className="font-pixel text-2xl mt-3">{result?.score}%</div>
          <div className="font-black text-lg mt-2">{result?.message}</div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-xl p-3"><div className="font-black text-2xl">{result?.correct_answers}</div><div className="text-xs font-bold">Correct</div></div>
            <div className="bg-white/50 rounded-xl p-3"><div className="font-black text-2xl text-purple-700">+{result?.xp_earned}</div><div className="text-xs font-bold">XP</div></div>
            <div className="bg-white/50 rounded-xl p-3"><div className="font-black text-2xl">{result?.total_questions}</div><div className="text-xs font-bold">Total</div></div>
          </div>
          {result?.new_achievements?.length > 0 && (
            <div className="mt-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3">
              <div className="font-pixel text-[10px]">🏆 NEW ACHIEVEMENT!</div>
              {result.new_achievements.map((a: any) => (
                <div key={a.id} className="font-black mt-1">{a.emoji} {a.name}</div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setPhase("list")} className="btn-game flex-1">← More Quizzes</button>
          <button onClick={() => navigate({ to: "/dashboard" })} className="btn-game teal flex-1">Dashboard 🏠</button>
        </div>

        {/* AI Summary */}
        {result?.ai_summary && (
          <div className="pixel-card-flat bg-white border-4 border-[color:var(--ink)] p-5 relative overflow-hidden shadow-[4px_4px_0_0_var(--ink)]">
            <div className="absolute top-0 right-0 p-2 text-6xl opacity-10 -rotate-12 translate-x-2 -translate-y-2">🤖</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[color:var(--sunny)] border-2 border-[color:var(--ink)] flex items-center justify-center text-sm shadow-[2px_2px_0_0_var(--ink)]">🤖</div>
              <div className="font-pixel text-[10px] text-[color:var(--ink)] tracking-wider">BLOOMY SAYS...</div>
            </div>
            <p className="font-semibold text-[color:var(--ink)] text-sm sm:text-base leading-relaxed z-10 relative">
              {result.ai_summary}
            </p>
          </div>
        )}

        {/* Answer breakdown */}
        <div className="pixel-card-flat bg-[color:var(--cream)] p-5">
          <div className="font-pixel text-[10px] mb-3">📋 ANSWER BREAKDOWN</div>
          <div className="space-y-3">
            {(result?.answers_breakdown ?? []).map((a: any, i: number) => (
              <div key={i} className={`pixel-card p-3 ${a.is_correct ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                <div className="flex items-start gap-2">
                  {a.is_correct ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-bold text-sm">{a.question}</div>
                    <div className="text-xs mt-1">Your answer: <strong className={a.is_correct ? "text-green-600" : "text-red-600"}>{a.your_answer?.toUpperCase() ?? "—"}</strong>
                      {!a.is_correct && <span className="text-green-600 ml-2">Correct: {a.correct_answer?.toUpperCase()}</span>}
                    </div>
                    {a.explanation && <div className="text-xs mt-1 opacity-60">{a.explanation}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
