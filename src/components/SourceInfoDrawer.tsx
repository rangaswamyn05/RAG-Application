import React from "react";
import { X, ExternalLink, ShieldCheck, FileText, Calendar, Database, CheckCircle2 } from "lucide-react";
import { ActiveSourceDetail } from "../types/index.ts";

interface SourceInfoDrawerProps {
  source: ActiveSourceDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceInfoDrawer: React.FC<SourceInfoDrawerProps> = ({
  source,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !source) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
                AU
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Official Source Verification
                  <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                </h3>
                <p className="text-[11px] text-blue-200">Australian Department of Home Affairs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close source info"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Source Title & Category */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {source.categoryName || "Student Visa Subclass 500"}
                </span>
                {source.lastVerifiedDate && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Verified: {source.lastVerifiedDate}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                {source.title}
              </h4>

              {source.section && (
                <p className="text-slate-500 text-[11px]">
                  <strong>Section:</strong> {source.section}
                </p>
              )}

              {/* Direct Link button */}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <span>Open Official Home Affairs Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* RAG Verification Metrics */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                <Database className="w-3.5 h-3.5 text-amber-700" />
                <span>Connected Knowledge Base Metadata:</span>
              </div>
              <p className="text-amber-800">
                This document is indexed in the Subclass 500 in-memory vector store and validated with BM25 keyword matching and dense cosine similarity.
              </p>
              {source.relevanceScore !== undefined && (
                <div className="pt-1 flex items-center gap-2 font-mono text-[10px] text-amber-900">
                  <span>RRF Relevance: {(source.relevanceScore * 100).toFixed(1)}%</span>
                  {source.bm25Score && <span>• BM25: {source.bm25Score}</span>}
                  {source.vectorScore && <span>• Vector: {source.vectorScore}</span>}
                </div>
              )}
            </div>

            {/* Legislation & Policy Excerpt */}
            {source.contentSnippet && (
              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Official Policy Text & Context:
                </h5>
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-sans text-xs whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {source.contentSnippet}
                </div>
              </div>
            )}

            {/* Regulatory Compliance Note */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Subclass 500 Compliance:</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Reflects current Australian Migration Regulations, including the 2024 Genuine Student criteria (replacing GTE) and the AUD $29,710 financial capacity requirement.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Official Government Portal: immi.homeaffairs.gov.au</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
