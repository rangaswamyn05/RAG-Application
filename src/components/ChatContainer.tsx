import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calculator,
  Clock,
  Briefcase,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  UserCheck,
  MapPin,
  Users
} from "lucide-react";
import { ChatMessage, UserProfile, ActiveSourceDetail } from "../types/index.ts";
import { ChatMessageItem } from "./ChatMessageItem.tsx";
import { RetrievalResponse } from "../rag/retrievalEngine.ts";

interface ChatContainerProps {
  userProfile: UserProfile;
  onOpenCalculator: () => void;
  onOpenChecklist: () => void;
  onOpenKBInspector: (retrieval?: RetrievalResponse) => void;
  onOpenProfile: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSelectSource: (source: ActiveSourceDetail) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const QUICK_PROMPTS = [
  {
    icon: FileText,
    label: "Document Checklist Table",
    prompt: "What documents do I need for my student visa application?",
    badge: "Official Table",
  },
  {
    icon: Calculator,
    label: "Financial Capacity Breakdown",
    prompt: "How much financial capacity proof do I need to show?",
    badge: "Updated $29,710",
  },
  {
    icon: Briefcase,
    label: "Work Rights & Hours",
    prompt: "Can I work more than 48 hours per fortnight under Condition 8105?",
    badge: "Condition 8105",
  },
  {
    icon: Sparkles,
    label: "Genuine Student (GS) Criteria",
    prompt: "What is the Genuine Student requirement that replaced GTE?",
    badge: "March 2024 Rule",
  },
  {
    icon: Clock,
    label: "Sector Processing Times",
    prompt: "What are the current visa processing times by sector?",
    badge: "Sector Benchmark",
  },
  {
    icon: GraduationCap,
    label: "English Language Test Scores",
    prompt: "What English test scores are required for Higher Education or VET?",
    badge: "IELTS / PTE Table",
  },
];

const TEST_SCENARIOS = [
  {
    type: "refusal",
    label: "Test Refusal (Future Policy Speculation)",
    prompt: "What new student visa policy will Australia introduce six months from now?",
    desc: "Strictly refuses to speculate on unreleased future policies.",
  },
  {
    type: "escalation",
    label: "Test Escalation (Past Refusal / Legal Advice)",
    prompt: "I previously had a visa refusal. Can you confirm whether my next application will be approved?",
    desc: "Refuses legal guarantees and directs to registered migration agents (MARA).",
  },
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
  userProfile,
  onOpenCalculator,
  onOpenChecklist,
  onOpenKBInspector,
  onOpenProfile,
  onUpdateProfile,
  onSelectSource,
  messages,
  setMessages,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("Querying official Home Affairs knowledge base...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Smooth scroll to the top starting point of any new assistant answer!
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.role === "assistant") {
      const el = messageItemRefs.current[lastMsg.id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setLoadingStep("Matching verified Department of Home Affairs guidelines...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        retrievedChunks: data.retrievedChunks,
        confidenceScore: data.confidenceScore,
        confidenceLevel: data.confidenceLevel,
        guardrailTriggered: data.guardrailTriggered,
        citations: data.citations,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I apologise, but an error occurred while connecting to the official Home Affairs retrieval service. Please visit the official [Australian Department of Home Affairs Student Visa Portal](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500) or try your query again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        confidenceLevel: "low",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback } : m))
    );
  };

  const latestAssistantId = [...messages].reverse().find(m => m.role === "assistant")?.id;

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-3 sm:px-6">
      {/* Circumstance Customization Quick Bar */}
      <div className="mb-2.5 py-2 px-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 inline" />
              Tailor Answers to Your Circumstances:
            </span>

            {/* Sector chips */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => onUpdateProfile({ studyLevel: "higher_ed" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.studyLevel === "higher_ed"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Higher Ed
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ studyLevel: "vet" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.studyLevel === "vet"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                VET (Vocational)
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ studyLevel: "postgrad_research" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.studyLevel === "postgrad_research"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Master&apos;s/PhD
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ studyLevel: "elicos" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.studyLevel === "elicos"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ELICOS
              </button>
            </div>

            {/* Location chip */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => onUpdateProfile({ locationStatus: "offshore" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.locationStatus === "offshore"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Offshore
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ locationStatus: "onshore" })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  userProfile.locationStatus === "onshore"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Onshore
              </button>
            </div>
          </div>

          <button
            onClick={onOpenProfile}
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline text-[11px] whitespace-nowrap self-end sm:self-auto"
          >
            All Background Options ⚙️
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          /* Welcome Card */
          <div className="space-y-4 max-w-3xl mx-auto my-1 animate-in fade-in duration-300">
            {/* Main Hero Card */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/50 rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                    AU
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Immigration Pal
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Specialised Australian Student Visa (Subclass 500) Information Assistant
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                  Answers are grounded in official Australian Department of Home Affairs guidelines and presented in structured tables and checklists. Click any <strong>Source Info</strong> chip to slide open full verified legislative context.
                </p>

                {/* 5 Knowledge Areas Grid */}
                <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="font-bold text-slate-900 text-[11px]">1. Eligibility</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">CoE & GS Table</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="font-bold text-slate-900 text-[11px]">2. Financials</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">$29.7k Living Table</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="font-bold text-slate-900 text-[11px]">3. Application</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">ImmiAccount & $1,600</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="font-bold text-slate-900 text-[11px]">4. Conditions</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">8105 (48h/fortnight)</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="font-bold text-slate-900 text-[11px]">5. Processing</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sector Time Table</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Common Inquiries with Formatted Tables (Click to Ask)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {QUICK_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all text-left flex items-start gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {item.prompt}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guardrail Verification Buttons */}
            <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Verify Ethical Guardrails & Policy Boundaries:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEST_SCENARIOS.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(scenario.prompt)}
                    className="p-2.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 text-left transition-all text-xs shadow-2xs"
                  >
                    <div className="font-bold text-amber-900">{scenario.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {scenario.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Render Messages */
          <div className="space-y-1">
            {messages.map(m => (
              <div
                key={m.id}
                id={`msg-${m.id}`}
                ref={el => {
                  messageItemRefs.current[m.id] = el;
                }}
                className="scroll-mt-28"
              >
                <ChatMessageItem
                  message={m}
                  onFeedback={handleFeedback}
                  onOpenCalculator={onOpenCalculator}
                  onOpenChecklist={onOpenChecklist}
                  onSelectSource={onSelectSource}
                  onSelectPrompt={handleSendMessage}
                  isLatestAssistant={m.id === latestAssistantId}
                />
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 mb-5 animate-in fade-in duration-200">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center text-white shadow-xs flex-shrink-0 animate-pulse">
                  <span className="font-extrabold text-xs">AU</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-slate-200 shadow-xs max-w-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-slate-700">
                      {loadingStep}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Matching official Department of Home Affairs guidelines...
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Input Box */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-2 pb-1 border-t border-slate-200/80">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white shadow-xs transition-all"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Subclass 500 document checklist, $29k financial capacity, Genuine Student statement, work limits..."
            className="w-full px-4 pt-3 pb-9 text-xs sm:text-sm bg-transparent resize-none focus:outline-none text-slate-900 placeholder:text-slate-400"
          />

          <div className="absolute left-3 bottom-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] font-mono text-slate-600 border border-slate-200">Enter</kbd> to send</span>
            <span>•</span>
            <span className="hidden sm:inline">Official Home Affairs Grounding</span>
          </div>

          <div className="absolute right-2.5 bottom-1.5 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2 rounded-xl text-white transition-all ${
                inputText.trim() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-xs"
                  : "bg-slate-300 cursor-not-allowed text-slate-500"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-1.5">
          General immigration information based on official Australian Department of Home Affairs guidelines. Not legal advice.
        </p>
      </div>
    </div>
  );
};
