import React, { useState } from "react";
import { X, Calculator, DollarSign, Info, Copy, Check, ExternalLink, HelpCircle } from "lucide-react";

interface FinancialCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPartner?: boolean;
  defaultChildren?: number;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  isOpen,
  onClose,
  defaultPartner = false,
  defaultChildren = 0,
}) => {
  const [tuitionFee, setTuitionFee] = useState<number>(32000);
  const [depositPaid, setDepositPaid] = useState<number>(5000);
  const [hasPartner, setHasPartner] = useState<boolean>(defaultPartner);
  const [childrenCount, setChildrenCount] = useState<number>(defaultChildren);
  const [schoolAgeChildrenCount, setSchoolAgeChildrenCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Official Home Affairs Thresholds (Updated May 2024)
  const STUDENT_LIVING_COST = 29710;
  const PARTNER_LIVING_COST = 10394;
  const CHILD_LIVING_COST = 4449;
  const SCHOOLING_COST_PER_CHILD = 13502;
  const TRAVEL_COST_PER_PERSON = 2000;

  const totalPersons = 1 + (hasPartner ? 1 : 0) + childrenCount;
  const remainingTuition = Math.max(0, tuitionFee - depositPaid);
  const livingStudent = STUDENT_LIVING_COST;
  const livingPartner = hasPartner ? PARTNER_LIVING_COST : 0;
  const livingChildren = childrenCount * CHILD_LIVING_COST;
  const totalTravel = totalPersons * TRAVEL_COST_PER_PERSON;
  const totalSchooling = schoolAgeChildrenCount * SCHOOLING_COST_PER_CHILD;

  const grandTotal = remainingTuition + livingStudent + livingPartner + livingChildren + totalTravel + totalSchooling;
  const annualIncomeThreshold = hasPartner || childrenCount > 0 ? 102593 : 87856;

  const formatAUD = (amt: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amt);

  const handleCopySummary = () => {
    const summary = `Australian Student Visa (Subclass 500) Financial Capacity Estimate:
-------------------------------------------------------
• 1st Year Tuition (Remaining): ${formatAUD(remainingTuition)} (${formatAUD(tuitionFee)} - ${formatAUD(depositPaid)} deposit)
• Primary Student 12-Month Living Cost: ${formatAUD(livingStudent)}
${hasPartner ? `• Accompanying Partner Living Cost: ${formatAUD(livingPartner)}\n` : ""}${childrenCount > 0 ? `• Accompanying Children Living Cost (${childrenCount}): ${formatAUD(livingChildren)}\n` : ""}${schoolAgeChildrenCount > 0 ? `• School-Age Children Education (${schoolAgeChildrenCount}): ${formatAUD(totalSchooling)}\n` : ""}• Return Travel Expenses (${totalPersons} people @ $2,000): ${formatAUD(totalTravel)}
-------------------------------------------------------
TOTAL OFFICIAL FUNDS REQUIRED: ${formatAUD(grandTotal)}
(Alternative Parent/Spouse Annual Taxable Income: min. ${formatAUD(annualIncomeThreshold)})
Official Source: Australian Department of Home Affairs (May 2024 Thresholds)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Official Financial Capacity Calculator</h3>
              <p className="text-xs text-slate-500">Australian Student Visa Subclass 500 (Home Affairs May 2024 Rates)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Official Rule Notice */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950">Official 2024 Financial Requirement:</p>
              <p className="text-blue-800 mt-0.5">
                The primary student living cost threshold is set at <strong>AUD $29,710/year</strong> (75% of national minimum wage). You must show 12 months of tuition, living, and travel costs in a bank account, approved loan, or scholarship.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Controls */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                1. Tuition & Enrolment
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1st Year Annual Course Tuition Fee (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={tuitionFee}
                    onChange={e => setTuitionFee(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuition Deposit Already Paid (credited on CoE)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={depositPaid}
                    onChange={e => setDepositPaid(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Remaining unpaid tuition: <strong>{formatAUD(remainingTuition)}</strong>
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 pt-2">
                2. Accompanying Family
              </h4>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium text-slate-800">
                    Spouse / Partner accompanying? (+AUD $10,394)
                  </span>
                  <input
                    type="checkbox"
                    checked={hasPartner}
                    onChange={e => setHasPartner(e.target.checked)}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                </label>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-medium text-slate-800">
                    Number of Children (+AUD $4,449 each):
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={childrenCount}
                    onChange={e => {
                      const count = Math.max(0, parseInt(e.target.value) || 0);
                      setChildrenCount(count);
                      if (schoolAgeChildrenCount > count) setSchoolAgeChildrenCount(count);
                    }}
                    className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center"
                  />
                </div>

                {childrenCount > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-xs font-medium text-slate-800 block">
                        School-age children (5–18 years):
                      </span>
                      <span className="text-[10px] text-slate-500">Adds AUD $13,502/yr schooling</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={childrenCount}
                      value={schoolAgeChildrenCount}
                      onChange={e => setSchoolAgeChildrenCount(Math.min(childrenCount, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Live Calculation Result Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Official Evidentiary Requirement
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    12 Months Total
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {formatAUD(grandTotal)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Minimum verifiable funds required in AUD
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="mt-5 space-y-2 text-xs border-t border-slate-700/80 pt-4">
                  <div className="flex justify-between text-slate-300">
                    <span>12 Mo. Tuition (Remaining):</span>
                    <span className="font-semibold text-white">{formatAUD(remainingTuition)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Primary Student Living:</span>
                    <span className="font-semibold text-white">{formatAUD(livingStudent)}</span>
                  </div>
                  {hasPartner && (
                    <div className="flex justify-between text-slate-300">
                      <span>Partner Living (AUD $10,394):</span>
                      <span className="font-semibold text-white">{formatAUD(livingPartner)}</span>
                    </div>
                  )}
                  {childrenCount > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Children Living ({childrenCount} × $4,449):</span>
                      <span className="font-semibold text-white">{formatAUD(livingChildren)}</span>
                    </div>
                  )}
                  {schoolAgeChildrenCount > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>School Tuition ({schoolAgeChildrenCount} × $13,502):</span>
                      <span className="font-semibold text-white">{formatAUD(totalSchooling)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300">
                    <span>Travel ({totalPersons} × $2,000):</span>
                    <span className="font-semibold text-white">{formatAUD(totalTravel)}</span>
                  </div>
                </div>

                {/* Alternative Income Option */}
                <div className="mt-5 bg-white/10 rounded-xl p-3 border border-white/10 text-xs">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Alternative: Annual Income Evidence
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    Instead of bank deposits, your parents or legal spouse can show a personal taxable annual income of at least <strong>{formatAUD(annualIncomeThreshold)}</strong> via official tax assessments.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied to Clipboard" : "Copy Breakdown"}
                </button>
                <a
                  href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                >
                  Home Affairs Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
