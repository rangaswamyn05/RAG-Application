import React, { useState } from "react";
import {
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Calculator,
  FileText,
  Info
} from "lucide-react";
import { ChatMessage, ActiveSourceDetail } from "../types/index.ts";

interface ChatMessageItemProps {
  message: ChatMessage;
  onFeedback?: (messageId: string, feedback: "up" | "down") => void;
  onOpenCalculator?: () => void;
  onOpenChecklist?: () => void;
  onSelectSource?: (source: ActiveSourceDetail) => void;
  onSelectPrompt?: (prompt: string) => void;
  isLatestAssistant?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onFeedback,
  onOpenCalculator,
  onOpenChecklist,
  onSelectSource,
  onSelectPrompt,
  isLatestAssistant = false,
}) => {
  const [showRetrievedChunks, setShowRetrievedChunks] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasFinancialTopic =
    message.content.includes("29,710") ||
    message.content.includes("living costs") ||
    message.content.includes("financial capacity") ||
    message.content.includes("tuition");

  const hasChecklistTopic =
    message.content.includes("checklist") ||
    message.content.includes("Confirmation of Enrolment") ||
    message.content.includes("CoE") ||
    message.content.includes("OSHC");

  // Handler to pop open source info on the side
  const handleOpenSourceDetail = (title: string, url: string, section?: string) => {
    // Look up chunk details if available
    const matchedChunk = message.retrievedChunks?.find(
      rc => rc.chunk.sourceUrl === url || rc.chunk.sourceTitle.includes(title) || rc.chunk.title.includes(title)
    );

    const detail: ActiveSourceDetail = {
      title: matchedChunk ? matchedChunk.chunk.title : title,
      url,
      section: matchedChunk?.chunk.section || section,
      categoryName: matchedChunk?.chunk.categoryName,
      lastVerifiedDate: matchedChunk?.chunk.lastVerifiedDate || "October 2026",
      contentSnippet: matchedChunk?.chunk.content,
      relevanceScore: matchedChunk?.finalScore,
      bm25Score: matchedChunk?.bm25Score,
      vectorScore: matchedChunk?.vectorScore,
    };

    if (onSelectSource) {
      onSelectSource(detail);
    }
  };

  // Parser supporting Markdown Headings, Lists, Bold, Links, and Tables
  const renderFormattedContent = (content: string) => {
    const rawLines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];

      // Detect Table block (starts with | and has | inside)
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          elements.push(renderTableBlock(tableLines, `table-${elements.length}`));
          continue;
        }
      }

      // Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={`h4-${i}`} className="font-bold text-slate-900 text-sm mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            {line.replace("### ", "")}
          </h4>
        );
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="font-extrabold text-slate-900 text-base mt-3.5 mb-2 text-blue-950">
            {line.replace("## ", "")}
          </h3>
        );
        i++;
        continue;
      }

      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        const itemText = line.trim().substring(2);
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2 my-1.5 pl-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <div className="flex-1">{renderInlineMarkdown(itemText)}</div>
          </div>
        );
        i++;
        continue;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`num-${i}`} className="flex items-start gap-2 my-1.5 pl-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <div className="flex-1">{renderInlineMarkdown(numMatch[2])}</div>
          </div>
        );
        i++;
        continue;
      }

      // Empty space
      if (!line.trim()) {
        elements.push(<div key={`sp-${i}`} className="h-2" />);
        i++;
        continue;
      }

      // Standard paragraph
      elements.push(
        <p key={`p-${i}`} className="text-slate-800 leading-relaxed text-xs sm:text-sm my-1.5">
          {renderInlineMarkdown(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  // Render Table / Grid Block
  const renderTableBlock = (tableLines: string[], key: string) => {
    const parseRow = (rowStr: string) =>
      rowStr
        .slice(1, -1)
        .split("|")
        .map(cell => cell.trim());

    const headerCells = parseRow(tableLines[0]);
    // Skip row 1 if it is the divider line (|---|---|)
    const dataRowStart = tableLines[1].includes("---") ? 2 : 1;
    const bodyRows = tableLines.slice(dataRowStart).map(parseRow);

    return (
      <div key={key} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 font-bold">
              {headerCells.map((header, hIdx) => (
                <th key={hIdx} className="px-3.5 py-2.5 font-bold tracking-tight">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2.5 text-slate-700 leading-relaxed">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper to get friendly action titles for URLs or domains
  const getActionLinkTitle = (rawUrlOrDomain: string): { title: string; href: string } => {
    let clean = rawUrlOrDomain.trim();
    // remove trailing punctuation
    clean = clean.replace(/[.,;:]+$/, "");
    let href = clean;
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`;
    }

    const lower = href.toLowerCase();
    if (lower.includes("online.immi.homeaffairs.gov.au")) {
      return { title: "ImmiAccount Portal (online.immi.homeaffairs.gov.au) ↗", href };
    }
    if (lower.includes("cricos.education.gov.au")) {
      return { title: "CRICOS Course Search (cricos.education.gov.au) ↗", href };
    }
    if (lower.includes("privatehealth.gov.au")) {
      return { title: "Compare OSHC (privatehealth.gov.au) ↗", href };
    }
    if (lower.includes("immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist")) {
      return { title: "Document Checklist Tool ↗", href };
    }
    if (lower.includes("immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times")) {
      return { title: "Visa Processing Times Guide ↗", href };
    }
    if (lower.includes("immi.homeaffairs.gov.au/visas/getting-a-visa/visa-pricing-estimator")) {
      return { title: "Visa Pricing Estimator ↗", href };
    }
    if (lower.includes("immi.homeaffairs.gov.au")) {
      return { title: "Home Affairs Subclass 500 Portal ↗", href };
    }
    if (lower.includes("fairwork.gov.au")) {
      return { title: "Fair Work Ombudsman (fairwork.gov.au) ↗", href };
    }
    if (lower.includes("ato.gov.au")) {
      return { title: "Australian Taxation Office (ato.gov.au) ↗", href };
    }
    if (lower.includes("mara.gov.au")) {
      return { title: "MARA Registered Agents (mara.gov.au) ↗", href };
    }
    if (lower.includes("ielts.com.au")) {
      return { title: "Official IELTS Australia ↗", href };
    }
    if (lower.includes("pearsonpte.com")) {
      return { title: "Pearson PTE Academic ↗", href };
    }
    if (lower.includes("jobsandskills.gov.au")) {
      return { title: "Jobs and Skills Australia ↗", href };
    }

    try {
      const parsed = new URL(href);
      return { title: `${parsed.hostname} ↗`, href };
    } catch {
      return { title: `${clean} ↗`, href };
    }
  };

  // Inline markdown: links [text](url), raw URLs, bare domains, bold **text**, inline `code`
  const renderInlineMarkdown = (text: string) => {
    // Regex matching:
    // 1. Markdown link: [Title](https://...)
    // 2. Explicit URL: https://...
    // 3. Bare domains: e.g. online.immi.homeaffairs.gov.au, cricos.education.gov.au, *.gov.au, etc.
    const linkRegex = /\[(.*?)\]\((https?:\/\/.*?)\)|(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s)\]<>"',]*)?)|(\b(?:(?:online\.)?immi\.homeaffairs\.gov\.au|cricos\.education\.gov\.au|(?:www\.)?privatehealth\.gov\.au|(?:www\.)?fairwork\.gov\.au|(?:www\.)?ato\.gov\.au|(?:www\.)?jobsandskills\.gov\.au|(?:www\.)?mara\.gov\.au|(?:www\.)?ielts\.com\.au|(?:www\.)?pearsonpte\.com|[a-zA-Z0-9-]+\.gov\.au)(?:\/[^\s)\]<>"',]*)?\b)/gi;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldAndCode(text.substring(lastIndex, match.index), `${lastIndex}`));
      }

      let linkTitle = "";
      let linkUrl = "";

      if (match[1] && match[2]) {
        // Markdown format [title](url)
        linkTitle = match[1];
        linkUrl = match[2];
      } else if (match[3]) {
        // Raw URL https://...
        const info = getActionLinkTitle(match[3]);
        linkTitle = info.title;
        linkUrl = info.href;
      } else if (match[4]) {
        // Bare domain: online.immi.homeaffairs.gov.au etc.
        const info = getActionLinkTitle(match[4]);
        linkTitle = info.title;
        linkUrl = info.href;
      }

      parts.push(
        <span key={`link-${match.index}`} className="inline-flex items-center gap-1 mx-1 my-0.5 align-middle">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-2.5 py-0.5 rounded-lg text-xs transition-all shadow-2xs group"
            title={`Open ${linkTitle} to take action`}
          >
            <span>{linkTitle}</span>
            <ExternalLink className="w-3 h-3 text-blue-500 group-hover:text-white flex-shrink-0" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenSourceDetail(linkTitle, linkUrl)}
            className="p-1 rounded-md text-slate-400 hover:text-blue-700 hover:bg-slate-100 transition-colors"
            title="Inspect official source verification in side panel"
          >
            <Info className="w-3 h-3" />
          </button>
        </span>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldAndCode(text.substring(lastIndex), `${lastIndex}`));
    }

    return parts.length > 0 ? parts : renderBoldAndCode(text, "0");
  };

  const renderBoldAndCode = (text: string, keyPrefix: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        if (boldText.includes("$") || boldText.includes("hours") || boldText.includes("IELTS") || boldText.includes("PTE")) {
          return (
            <span
              key={`${keyPrefix}-${i}`}
              className="font-bold text-slate-900 bg-amber-100/70 text-amber-950 px-1.5 py-0.2 rounded border border-amber-200/60 inline-block my-0.5"
            >
              {boldText}
            </span>
          );
        }
        return <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900">{boldText}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={`${keyPrefix}-${i}`} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // User Message
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="max-w-xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
            {message.content}
          </p>
          <div className="text-[10px] text-blue-200/80 mt-1.5 text-right font-mono">
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div
      className={`flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isLatestAssistant ? "ring-2 ring-blue-400/40 rounded-2xl p-0.5 transition-all" : ""
      }`}
    >
      {/* Australian Emblem Avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-amber-600 flex items-center justify-center text-white shadow-xs flex-shrink-0 mt-0.5 ring-2 ring-amber-400/30">
        <span className="font-extrabold text-xs tracking-tight">AU</span>
      </div>

      <div className="flex-1 max-w-3xl">
        {/* Assistant Header & Verification Badge */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-bold text-slate-900 text-xs sm:text-sm">Immigration Pal</span>
          <span className="text-[10px] text-slate-400 font-mono">{message.timestamp}</span>

          {message.confidenceLevel && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
                message.confidenceLevel === "high"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : message.confidenceLevel === "medium"
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : message.confidenceLevel === "speculative_refusal"
                  ? "bg-amber-50 text-amber-900 border border-amber-300"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {message.confidenceLevel === "speculative_refusal"
                ? "Future Policy Refusal"
                : message.confidenceLevel === "legal_escalation"
                ? "Legal Referral Required"
                : `Verified Home Affairs (${message.confidenceScore || 95}%)`}
            </span>
          )}
        </div>

        {/* Guardrail Notice */}
        {message.guardrailTriggered && (
          <div className="mb-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Official Policy Boundary:</span>
              <span className="text-amber-800">{message.guardrailTriggered.reason}</span>
            </div>
          </div>
        )}

        {/* Message Card Body */}
        <div className="bg-white rounded-2xl rounded-tl-xs p-4 sm:p-5 border border-slate-200 shadow-xs relative">
          {/* Main Answer Content (Formatted with Tables & Markdown) */}
          <div className="text-slate-800">
            {renderFormattedContent(message.content)}
          </div>

          {/* Contextual Action Shortcuts */}
          {(hasFinancialTopic || hasChecklistTopic) && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {hasFinancialTopic && onOpenCalculator && (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open $29,710 Capacity Calculator</span>
                </button>
              )}
              {hasChecklistTopic && onOpenChecklist && (
                <button
                  type="button"
                  onClick={onOpenChecklist}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open Interactive Document Checklist</span>
                </button>
              )}
            </div>
          )}

          {/* Compact Clickable Source Side-Pop Pills */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  Official Sources (Click for Side Details):
                </span>
                {message.citations.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleOpenSourceDetail(c.title, c.url, c.section)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 text-[11px] font-medium transition-colors shadow-2xs"
                  >
                    <span>{c.title.replace("Department of Home Affairs - ", "")}</span>
                    <Info className="w-3 h-3 text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Chunks Transparency */}
          {message.retrievedChunks && message.retrievedChunks.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100/80">
              <button
                type="button"
                onClick={() => setShowRetrievedChunks(!showRetrievedChunks)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>
                  {showRetrievedChunks
                    ? "Hide connected knowledge chunks"
                    : `Inspect ${message.retrievedChunks.length} connected Home Affairs chunks`}
                </span>
                {showRetrievedChunks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showRetrievedChunks && (
                <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                  {message.retrievedChunks.map((rc, idx) => (
                    <div
                      key={rc.chunk.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-bold text-slate-800">
                          #{idx + 1} {rc.chunk.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenSourceDetail(rc.chunk.title, rc.chunk.sourceUrl, rc.chunk.section)}
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
                        >
                          View Side Info <Info className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                        &quot;{rc.chunk.content.substring(0, 160)}...&quot;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className="flex items-center gap-3 mt-1.5 ml-1 text-slate-400 text-xs">
          <button
            onClick={handleCopy}
            className="hover:text-slate-700 flex items-center gap-1 transition-colors"
            title="Copy answer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
          </button>

          <span className="text-slate-300">•</span>

          <span className="text-[11px] text-slate-400">Accurate?</span>
          <button
            onClick={() => onFeedback && onFeedback(message.id, "up")}
            className={`p-1 rounded hover:bg-slate-100 transition-colors ${
              message.feedback === "up" ? "text-emerald-600 font-bold" : "hover:text-slate-700"
            }`}
            title="Helpful and accurate"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFeedback && onFeedback(message.id, "down")}
            className={`p-1 rounded hover:bg-slate-100 transition-colors ${
              message.feedback === "down" ? "text-rose-600 font-bold" : "hover:text-slate-700"
            }`}
            title="Inaccurate or incomplete"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
