import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleNavbar } from "@/components/RoleNavbar";
import { useEffect, useState, useRef } from "react";
import { Send, Loader2, Bot, User, Mic, Smile, Plus, Trash2, MessageSquarePlus } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/mentor")({
  head: () => ({ meta: [{ title: "Mentor — MindBloom AI" }] }),
  component: Mentor,
});

function Mentor() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + (prev ? " " : "") + finalTranscript);
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/auth" }); return; }
    if (user?.role === "parent") { navigate({ to: "/parent" }); return; }
    loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async (selectId?: number) => {
    try {
      setLoading(true);
      const convsRes = await api.get("/mentor/conversations");
      const convs = convsRes.data.conversations;
      setConversations(convs);

      if (convs.length > 0) {
        const targetConv = selectId ? convs.find((c: any) => c.id === selectId) || convs[0] : convs[0];
        await selectConversation(targetConv);
      } else {
        await createNewChat();
      }
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const newConv = await api.post("/mentor/conversations", { title: "New Conversation" });
      const conv = newConv.data.conversation;
      setConversations([conv, ...conversations]);
      await selectConversation(conv);
    } catch (e) {
      console.error("Failed to create new chat", e);
    }
  };

  const selectConversation = async (conv: any) => {
    setActiveConv(conv);
    setMessages([]);
    try {
      const msgsRes = await api.get(`/mentor/conversations/${conv.id}/messages`);
      setMessages(msgsRes.data.messages);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/conversations/${id}`);
      const updated = conversations.filter(c => c.id !== id);
      setConversations(updated);
      if (activeConv?.id === id) {
        if (updated.length > 0) {
          selectConversation(updated[0]);
        } else {
          createNewChat();
        }
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConv || sending) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: userMsg, created_at: new Date().toISOString() }]);
    setSending(true);

    try {
      const res = await api.post(`/mentor/conversations/${activeConv.id}/messages`, { message: userMsg });
      setMessages(m => [...m, { role: "assistant", content: res.data.ai_response, created_at: new Date().toISOString() }]);
      
      // Update the updated_at time in the list
      setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, updated_at: new Date().toISOString() } : c));
    } catch (e: any) {
      setMessages(m => [...m, { role: "assistant", content: "⚠️ " + (e.response?.data?.message || "Oops! Bloomy had a hiccup. Try again!"), created_at: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (loading && conversations.length === 0) return (
    <div className="min-h-screen bg-dots flex items-center justify-center">
      <div className="text-center"><div className="text-6xl animate-bounce">🤖</div><div className="font-pixel text-sm mt-4">Waking up Bloomy...</div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dots flex flex-col h-screen overflow-hidden">
      <RoleNavbar />
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6 min-h-0">
        
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-[300px] bg-white border-4 border-[color:var(--ink)] rounded-2xl shadow-[6px_6px_0_0_var(--ink)] overflow-hidden">
          <div className="p-4 flex justify-between items-center mt-2">
            <h2 className="font-pixel text-[color:var(--sunny)] drop-shadow-[1px_1px_0_var(--ink)] text-sm tracking-wider">QUEST LOG</h2>
            <button onClick={createNewChat} className="bg-[color:var(--cherry)] text-white p-1.5 rounded-lg border-2 border-[color:var(--ink)] hover:-translate-y-0.5 transition-transform" title="New Chat">
              <MessageSquarePlus size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversations.map(conv => {
              const isActive = activeConv?.id === conv.id;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => selectConversation(conv)}
                  className={`group relative p-4 rounded-xl border-4 cursor-pointer transition-all ${isActive ? "border-[color:var(--ink)] bg-[color:var(--sunny)] shadow-[4px_4px_0_0_var(--ink)]" : "border-transparent hover:border-[color:var(--ink)]/20 hover:bg-[color:var(--cream)]/30"}`}
                >
                  <div className={`font-bold truncate pr-6 ${isActive ? "text-[color:var(--ink)]" : "text-[color:var(--ink)]/40"}`}>{conv.title || "Chat with Bloomy"}</div>
                  <div className={`text-xs mt-1 ${isActive ? "text-[color:var(--ink)]/70" : "text-[color:var(--ink)]/30"}`}>{formatTimeAgo(conv.updated_at)}</div>
                  
                  <button 
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[color:var(--cherry)] text-white border-2 border-[color:var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white border-4 border-[color:var(--ink)] rounded-2xl shadow-[6px_6px_0_0_var(--ink)] overflow-hidden">
          
          {/* Header */}
          <div className="p-1.5 sm:p-2 border-b-4 border-[color:var(--ink)] bg-white flex items-center gap-3">
            <div className="text-2xl sm:text-3xl bg-[color:var(--cream)] rounded-xl p-1 border-2 border-[color:var(--ink)] shadow-[2px_2px_0_0_var(--ink)]">🤖</div>
            <div>
              <h1 className="font-pixel text-lg sm:text-xl text-[color:var(--ink)] mb-0.5">Bloomy</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--grass)]">
                <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></div>
                Online · Cheerful mood ✨
              </div>
            </div>
            <div className="ml-auto">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[color:var(--ink)] bg-[color:var(--cream)] text-sm font-bold shadow-[2px_2px_0_0_var(--ink)]">
                <span className="text-[color:var(--sunny)]">✨</span> Lvl 99 NPC
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <div className="text-5xl mb-4">💬</div>
                <div className="font-pixel text-sm">Start a new quest!</div>
              </div>
            )}
            
            {messages.map((m: any, i: number) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`text-[10px] font-pixel mb-2 opacity-50 ${isUser ? "mr-2" : "ml-2"}`}>{isUser ? "YOU" : "BLOOMY"}</div>
                  <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-2xl text-[15px] font-semibold border-4 border-[color:var(--ink)] shadow-[4px_4px_0_0_var(--ink)] ${isUser ? "bg-white text-[color:var(--ink)] rounded-tr-sm" : "bg-white rounded-tl-sm"}`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {sending && (
              <div className="flex flex-col items-start">
                <div className="text-[10px] font-pixel mb-2 opacity-50 ml-2">BLOOMY</div>
                <div className="bg-white border-4 border-[color:var(--ink)] px-5 py-4 rounded-2xl rounded-tl-sm shadow-[4px_4px_0_0_var(--ink)] flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[color:var(--grape)] animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2 h-2 rounded-full bg-[color:var(--grape)] animate-bounce" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2 h-2 rounded-full bg-[color:var(--grape)] animate-bounce" style={{animationDelay: "300ms"}}></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-3">
              {["💡 What are my strengths?", "💡 How can I improve focus?", "💡 Which games should I play?"].map(q => (
                <button key={q} onClick={() => setInput(q.replace("💡 ", ""))}
                  className="whitespace-nowrap text-xs font-bold px-4 py-2.5 rounded-full border-4 border-[color:var(--ink)] bg-white hover:bg-[color:var(--sunny)] transition shadow-[3px_3px_0_0_var(--ink)]">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-1.5 sm:p-2 border-t-4 border-[color:var(--ink)] bg-[color:var(--cream)]">
            <form onSubmit={sendMessage} className="flex gap-2 items-center bg-white p-1 sm:p-1.5 rounded-2xl border-4 border-[color:var(--ink)] shadow-[3px_3px_0_0_var(--ink)]">
              
              <button type="button" onClick={toggleListening} className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-[color:var(--ink)] flex items-center justify-center text-white transition-all ${isListening ? "bg-[color:var(--cherry)] animate-pulse scale-110 shadow-[0_0_15px_var(--cherry)]" : "bg-[color:var(--orange-pop)] hover:scale-105 shadow-[2px_2px_0_0_var(--ink)]"}`} title={isListening ? "Stop listening" : "Voice Input"}>
                <Mic size={16} className={isListening ? "animate-bounce" : ""} />
              </button>
              
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Bloomy anything..."
                className="flex-1 min-w-0 bg-transparent px-2 font-semibold outline-none placeholder:text-[color:var(--ink)]/40 text-sm sm:text-base py-1.5"
                disabled={sending}
                maxLength={500}
              />
              
              <button type="submit" disabled={sending || !input.trim()} className="shrink-0 rounded-xl border-4 border-[color:var(--ink)] bg-[color:var(--cherry)] px-4 py-2 sm:px-5 sm:py-2.5 font-pixel text-white hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2 text-xs sm:text-sm shadow-[2px_2px_0_0_var(--ink)]">
                <Send size={14} />
                <span className="hidden md:inline">SEND</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
