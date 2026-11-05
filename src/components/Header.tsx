import React from "react";
import {
  FileText,
  Calculator,
  Database,
  UserCheck,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { UserProfile } from "../types/index.ts";

interface HeaderProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenCalculator: () => void;
  onOpenChecklist: () => void;
  onOpenKBInspector: () => void;
  onResetChat: () => void;
  hasMessages: boolean;
}

const STUDY_LEVEL_LABELS: Record<string, string> = {
  higher_ed: "Higher Ed (Uni)",
  vet: "VET (Vocational)",
  elicos: "ELICOS English",
  schools: "School Sector",
  postgrad_research: "Master's / PhD",
};

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenCalculator,
  onOpenChecklist,
  onOpenKBInspector,
  onResetChat,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-amber-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 flex-shrink-0">
              <span className="font-extrabold text-base tracking-tighter">AU</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
                  Immigration Pal
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Subclass 500
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
                Australian Student Visa Information • Powered by Verified Home Affairs Knowledge Base
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenChecklist}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Open Document Checklist Generator"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Checklist</span>
            </button>

            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Calculate official financial capacity requirement"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Financials ($29k+)</span>
            </button>

            <button
              onClick={onOpenKBInspector}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition-colors"
              title="Inspect 5 Knowledge Base Categories & Hybrid RAG Retrieval"
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">RAG Inspector</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              title="Personalize your study profile"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {STUDY_LEVEL_LABELS[userProfile.studyLevel] || "Profile"}
              </span>
            </button>

            {hasMessages && (
              <button
                onClick={onResetChat}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
