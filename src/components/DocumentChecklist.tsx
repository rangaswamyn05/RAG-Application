import React, { useState } from "react";
import { X, CheckSquare, Square, FileText, Download, Check, AlertCircle, ExternalLink } from "lucide-react";
import { UserProfile } from "../types/index.ts";

interface DocumentChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

interface ChecklistItem {
  id: string;
  category: "identity" | "academic" | "genuine_student" | "english" | "financial" | "health_character";
  title: string;
  description: string;
  mandatory: boolean;
  notes?: string;
  conditional?: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Identity
  {
    id: "doc-passport",
    category: "identity",
    title: "Valid Passport (Bio-data page)",
    description: "High-resolution colour copy of your valid passport bio-data page with at least 6 months validity beyond your planned stay.",
    mandatory: true,
  },
  {
    id: "doc-national-id",
    category: "identity",
    title: "National Identity Card & Birth Certificate",
    description: "Official government ID and birth certificate confirming identity and parentage.",
    mandatory: true,
  },
  {
    id: "doc-photo",
    category: "identity",
    title: "Passport-Sized Photograph",
    description: "Recent digital passport photo conforming to Australian immigration specifications.",
    mandatory: true,
  },

  // Academic & Enrolment
  {
    id: "doc-coe",
    category: "academic",
    title: "Electronic Confirmation of Enrolment (CoE)",
    description: "Official CoE code generated through PRISMS for each course in your study package. (Letter of Offer is not sufficient).",
    mandatory: true,
  },
  {
    id: "doc-transcripts",
    category: "academic",
    title: "Academic Transcripts & Graduation Certificates",
    description: "Complete certified academic records for previous high school, bachelor, or diploma studies.",
    mandatory: true,
  },

  // Genuine Student
  {
    id: "doc-gs-statement",
    category: "genuine_student",
    title: "Genuine Student (GS) Statement",
    description: "Detailed responses addressing your choice of course, provider, Australia, home country ties, and future career plans (replacing the old GTE).",
    mandatory: true,
    notes: "Crucial factor for visa assessment. Must not be generic.",
  },
  {
    id: "doc-cv",
    category: "genuine_student",
    title: "Comprehensive Curriculum Vitae (CV / Resume)",
    description: "Complete chronological history of employment and studies. Any study or work gaps must be explained with documentary evidence.",
    mandatory: true,
  },
  {
    id: "doc-employment-evidence",
    category: "genuine_student",
    title: "Employment Reference Letters & Payslips",
    description: "Letters from past employers on official letterhead stating position, duties, dates, and salary proof.",
    mandatory: false,
    notes: "Mandatory if you have work experience or post-study gaps.",
  },

  // English Proficiency
  {
    id: "doc-english-test",
    category: "english",
    title: "English Language Test Certificate",
    description: "IELTS (min 6.5 higher ed / 6.0 VET), PTE Academic (min 58/50), TOEFL iBT (min 79), or Cambridge CAE (min 176) taken within 2 years.",
    mandatory: true,
    conditional: "Exempt if citizen of UK, USA, Canada, NZ, Ireland, or completed 5+ years English medium study.",
  },

  // Financial
  {
    id: "doc-bank-funds",
    category: "financial",
    title: "Evidence of Financial Capacity (AUD $29,710 + Tuition)",
    description: "Bank statements showing funds held for required period, approved education loan letter, or scholarship certificate.",
    mandatory: true,
    notes: "Updated May 2024 living cost rule.",
  },
  {
    id: "doc-sponsor-affidavit",
    category: "financial",
    title: "Sponsorship Affidavit & Relationship Proof",
    description: "If parents or spouse are funding: letter of financial support and birth/marriage certificates establishing relationship.",
    mandatory: false,
  },

  // Health & Character
  {
    id: "doc-oshc",
    category: "health_character",
    title: "Overseas Student Health Cover (OSHC) Certificate",
    description: "Certificate of insurance with an approved Australian provider covering from arrival until proposed visa completion date.",
    mandatory: true,
    notes: "Condition 8501 requirement.",
  },
  {
    id: "doc-emedical",
    category: "health_character",
    title: "Health Examination Referral (HAP ID)",
    description: "eMedical referral letter for 501 Medical Examination and 502 Chest X-ray at an approved panel physician.",
    mandatory: true,
  },
  {
    id: "doc-police-clearance",
    category: "health_character",
    title: "Police Clearance Certificate (Penal Clearance)",
    description: "Police certificate for every country lived in for 12 months or more over the last 10 years (if requested).",
    mandatory: false,
  },
];

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "doc-passport": true,
  });
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [downloadNotice, setDownloadNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItems = DEFAULT_ITEMS.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalItems) * 100);

  const filteredItems = activeCategory === "all"
    ? DEFAULT_ITEMS
    : DEFAULT_ITEMS.filter(item => item.category === activeCategory);

  const handleExportText = () => {
    const list = DEFAULT_ITEMS.map(i => {
      const status = checkedItems[i.id] ? "[X] COMPLETED" : "[ ] PENDING";
      return `${status} - ${i.title} (${i.mandatory ? "Mandatory" : "Optional/Circumstantial"})\n    Description: ${i.description}\n`;
    }).join("\n");

    const text = `AUSTRALIAN STUDENT VISA (SUBCLASS 500) - DOCUMENT READINESS CHECKLIST
Generated for: ${userProfile.studyLevel.toUpperCase()} (${userProfile.locationStatus.toUpperCase()})
Prepared with Immigration Pal | Department of Home Affairs Guidelines
Overall Readiness: ${completedCount}/${totalItems} documents ready (${percentComplete}%)
========================================================================

${list}

Important Notice: Documents in languages other than English must include certified NAATI translations.
Refer to https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Student_Visa_500_Document_Checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Subclass 500 Document Checklist</h3>
              <p className="text-xs text-slate-500">
                Official Evidentiary Checklist • Tailored for {userProfile.studyLevel.replace("_", " ")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 w-2/3">
            <span className="font-semibold text-slate-700 whitespace-nowrap">
              Readiness: {completedCount} / {totalItems} items ({percentComplete}%)
            </span>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleExportText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
          >
            {downloadNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-600" />}
            {downloadNotice ? "Exported!" : "Export Checklist"}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Items" },
            { id: "identity", label: "Identity" },
            { id: "academic", label: "Enrolment & CoE" },
            { id: "genuine_student", label: "Genuine Student (GS)" },
            { id: "english", label: "English Test" },
            { id: "financial", label: "Financials ($29.7k)" },
            { id: "health_character", label: "OSHC & Health" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium text-xs ${
                activeCategory === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Checklist Items List */}
        <div className="p-6 overflow-y-auto space-y-3 text-sm">
          {filteredItems.map(item => {
            const isChecked = checkedItems[item.id] || false;
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? "bg-emerald-50/40 border-emerald-300 text-slate-800"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-xs ${isChecked ? "text-emerald-950 line-through opacity-80" : "text-slate-900"}`}>
                      {item.title}
                    </span>
                    {item.mandatory ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        Circumstantial
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {item.conditional && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 rounded-md p-1.5 mt-2 border border-amber-200/60">
                      ℹ️ {item.conditional}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-[11px] text-blue-800 bg-blue-50/70 rounded-md p-1.5 mt-1.5 border border-blue-200/50">
                      💡 {item.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Remember: Submit clear color scans and certified NAATI English translations.</span>
          <a
            href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
          >
            Official Checklist Tool <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
