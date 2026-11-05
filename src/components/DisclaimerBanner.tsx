import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, ExternalLink, ShieldAlert } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-50/70 to-blue-50 border-b border-amber-200/70 px-4 py-2 text-xs text-amber-900 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="font-medium text-amber-950">
            <strong className="font-semibold">General Information Notice:</strong> Immigration Pal is an informational assistant based on official Australian Department of Home Affairs guidelines. It does not provide legal advice, is not a registered migration agent (MARA), and cannot guarantee visa approval.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2"
          >
            <span>{expanded ? "Less details" : "Scope & Limitations"}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <a
            href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {expanded && (
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-amber-200/60 text-slate-700 text-[11px] leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/50">
            <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Not Registered Migration Advice
            </h4>
            <p>Under Australian law, only Registered Migration Agents (OMARA) or qualified legal practitioners can provide formal migration advice for individual applications.</p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/50">
            <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              Verified Department Sources
            </h4>
            <p>Every response is retrieved from verified Australian Department of Home Affairs documents, updated to the latest 2024–2026 regulations (including Genuine Student test & $29,710 fund rule).</p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/50">
            <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              No Future Policy Speculation
            </h4>
            <p>Immigration Pal strictly refuses to speculate on unreleased future policies, leak announcements, or draft bills, ensuring complete factual fidelity.</p>
          </div>
        </div>
      )}
    </div>
  );
};
