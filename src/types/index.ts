import type { KnowledgeChunk } from "../rag/knowledgeBase.ts";
import type { RetrievalResult } from "../rag/retrievalEngine.ts";

export interface Citation {
  title: string;
  url: string;
  section: string;
}

export interface ActiveSourceDetail {
  title: string;
  url: string;
  section?: string;
  categoryName?: string;
  lastVerifiedDate?: string;
  contentSnippet?: string;
  relevanceScore?: number;
  bm25Score?: number;
  vectorScore?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  retrievedChunks?: RetrievalResult[];
  confidenceScore?: number;
  confidenceLevel?: "high" | "medium" | "low" | "speculative_refusal" | "legal_escalation";
  guardrailTriggered?: {
    type: "speculative_policy" | "legal_advice" | "unsupported_claim";
    reason: string;
    suggestedResponse: string;
  };
  citations?: Citation[];
  feedback?: "up" | "down";
  suggestedFollowUps?: string[];
}

export interface UserProfile {
  studyLevel: "higher_ed" | "vet" | "elicos" | "schools" | "postgrad_research";
  locationStatus: "offshore" | "onshore";
  countryOfPassport: string;
  hasDependents: boolean;
  spouseAccompanying?: boolean;
  childrenCount?: number;
}
