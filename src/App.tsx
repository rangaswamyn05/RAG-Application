/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { DisclaimerBanner } from "./components/DisclaimerBanner.tsx";
import { ChatContainer } from "./components/ChatContainer.tsx";
import { ProfileDrawer } from "./components/ProfileDrawer.tsx";
import { FinancialCalculator } from "./components/FinancialCalculator.tsx";
import { DocumentChecklist } from "./components/DocumentChecklist.tsx";
import { KnowledgeBaseInspector } from "./components/KnowledgeBaseInspector.tsx";
import { SourceInfoDrawer } from "./components/SourceInfoDrawer.tsx";
import { ChatMessage, UserProfile, ActiveSourceDetail } from "./types/index.ts";
import { RetrievalResponse } from "./rag/retrievalEngine.ts";

const DEFAULT_PROFILE: UserProfile = {
  studyLevel: "higher_ed",
  locationStatus: "offshore",
  countryOfPassport: "India",
  hasDependents: false,
  spouseAccompanying: false,
  childrenCount: 0,
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("immigration_pal_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("immigration_pal_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal visibility states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isKBInspectorOpen, setIsKBInspectorOpen] = useState(false);
  const [latestRetrieval, setLatestRetrieval] = useState<RetrievalResponse | null>(null);

  // Side pop drawer for official source info
  const [selectedSourceDetail, setSelectedSourceDetail] = useState<ActiveSourceDetail | null>(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  // Persist profile
  useEffect(() => {
    localStorage.setItem("immigration_pal_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem("immigration_pal_messages", JSON.stringify(messages));
  }, [messages]);

  const handleResetChat = () => {
    if (window.confirm("Start a new conversation? Previous messages will be cleared.")) {
      setMessages([]);
      localStorage.removeItem("immigration_pal_messages");
    }
  };

  const handleOpenKBInspector = (retrieval?: RetrievalResponse) => {
    if (retrieval) setLatestRetrieval(retrieval);
    setIsKBInspectorOpen(true);
  };

  const handleSelectSource = (source: ActiveSourceDetail) => {
    setSelectedSourceDetail(source);
    setIsSourceDrawerOpen(true);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Top Navigation Bar */}
      <Header
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenKBInspector={() => handleOpenKBInspector()}
        onResetChat={handleResetChat}
        hasMessages={messages.length > 0}
      />

      {/* 2. Official Legal Disclaimer & Scope Notice */}
      <DisclaimerBanner />

      {/* 3. Main Conversational Chat Space */}
      <main className="flex-1 flex flex-col">
        <ChatContainer
          userProfile={userProfile}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenChecklist={() => setIsChecklistOpen(true)}
          onOpenKBInspector={handleOpenKBInspector}
          onOpenProfile={() => setIsProfileOpen(true)}
          onUpdateProfile={handleUpdateProfile}
          onSelectSource={handleSelectSource}
          messages={messages}
          setMessages={setMessages}
        />
      </main>

      {/* 4. Side Pop Drawer for Official Source Information */}
      <SourceInfoDrawer
        source={selectedSourceDetail}
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
      />

      {/* 5. Interactive Modals & Tools */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={setUserProfile}
      />

      <FinancialCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultPartner={userProfile.hasDependents && userProfile.spouseAccompanying}
        defaultChildren={userProfile.childrenCount || 0}
      />

      <DocumentChecklist
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        userProfile={userProfile}
      />

      <KnowledgeBaseInspector
        isOpen={isKBInspectorOpen}
        onClose={() => setIsKBInspectorOpen(false)}
        latestRetrieval={latestRetrieval}
      />
    </div>
  );
}
