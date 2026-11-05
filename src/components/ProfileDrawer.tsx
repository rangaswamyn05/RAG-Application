import React from "react";
import { X, Check, Globe, GraduationCap, MapPin, Users } from "lucide-react";
import { UserProfile } from "../types/index.ts";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const COMMON_COUNTRIES = [
  "India",
  "China",
  "Nepal",
  "Vietnam",
  "Philippines",
  "Indonesia",
  "Pakistan",
  "Sri Lanka",
  "Brazil",
  "Colombia",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
];

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = React.useState<UserProfile>(profile);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Study Profile</h3>
              <p className="text-xs text-slate-500">Personalize visa guidance, checklists, and funds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Study Sector */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Proposed Education Sector (CRICOS)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "higher_ed", label: "Higher Education", desc: "Bachelor / Master Coursework" },
                { id: "postgrad_research", label: "Postgrad Research", desc: "Master by Research / PhD" },
                { id: "vet", label: "Vocational (VET)", desc: "Certificates / Diplomas" },
                { id: "elicos", label: "ELICOS English", desc: "Standalone or Packaged" },
                { id: "schools", label: "School Sector", desc: "Primary / Secondary (Years 1-12)" },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, studyLevel: opt.id as any })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    formData.studyLevel === opt.id
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600/30 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Status */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Application Location Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, locationStatus: "offshore" })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.locationStatus === "offshore"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600/30"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-xs">Offshore (Outside Australia)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Applying from your home country</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, locationStatus: "onshore" })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.locationStatus === "onshore"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600/30"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-xs">Onshore (Inside Australia)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Subject to July 2024 visa hopping laws</div>
              </button>
            </div>
          </div>

          {/* Country of Passport */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              Country of Passport
            </label>
            <select
              value={formData.countryOfPassport}
              onChange={e => setFormData({ ...formData, countryOfPassport: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {COMMON_COUNTRIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Used to personalize English proficiency exemptions and country-specific biometric requirements.
            </p>
          </div>

          {/* Dependents */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-600" />
              Accompanying Family Members (Dependents)
            </label>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasDependents}
                  onChange={e => setFormData({ ...formData, hasDependents: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-medium text-slate-800 text-xs">
                  I will include family members (partner/spouse or children) on my visa
                </span>
              </label>

              {formData.hasDependents && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2 pl-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.spouseAccompanying || false}
                      onChange={e => setFormData({ ...formData, spouseAccompanying: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700">Accompanying Spouse / De facto partner</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-700">Number of dependent children:</span>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={formData.childrenCount || 0}
                      onChange={e => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Profile
          </button>
        </div>
      </div>
    </div>
  );
};
