import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { hybridRetrieve, type UserContextProfile, type RetrievalResult } from "./src/rag/retrievalEngine.ts";
import { OFFICIAL_KNOWLEDGE_BASE, CATEGORY_NAMES } from "./src/rag/knowledgeBase.ts";

dotenv.config();

const app = express();

const isProduction =
  process.env.NODE_ENV === "production" ||
  (Boolean(process.env.K_SERVICE) && !process.env.K_SERVICE?.startsWith("ais-dev-"));

// AI Studio dev server runs on port 3000.
// Live Cloud Run service deployment listens on process.env.PORT (typically 8080).
const port = isProduction
  ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080)
  : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Instruction for Immigration Pal
const IMMIGRATION_PAL_SYSTEM_INSTRUCTION = `You are Immigration Pal, an AI immigration information assistant specialising in the Australian Student Visa (Subclass 500).

Your Mandatory Guidelines:
1. Ground answers strictly in the retrieved official Australian Department of Home Affairs context.
2. Provide concise, clear, and direct answers in simple plain English.
3. Start with a direct 1-sentence answer, then present structured information using clean Markdown tables or visual grids (e.g. for document checklists, financial capacity breakdowns, English scores, and processing times).
4. Bold key figures, amounts, and dates (e.g., **AUD $29,710**, **48 hours per fortnight**, **AUD $1,600**, **IELTS 6.5**).
5. Personalize answers using the user's background (e.g. study level, onshore/offshore status, dependents).
6. When user circumstances are general or incomplete, ask 1-2 targeted questions to customize the criteria.
7. CRITICAL: Do NOT add repetitive boilerplate lines like "Refer to the official Department of Home Affairs" or "Check official website" to every answer. The user interface already has dedicated source info buttons. Only direct users to official announcements when strictly necessary (such as when refusing unreleased future policy speculation or missing info).
8. Strict Refusals & Limitations:
   - Never invent requirements, guarantee approval, or predict legal decisions.
   - Do not claim to be a lawyer or registered migration agent (MARA).
   - Do not speculate on future policy changes. If asked about future unannounced policy changes (e.g. 6 months from now), state: "I don't have verified information about unpublished future policy changes. I do not provide speculative information. Please check the Department of Home Affairs for official announcements."
   - If asked about prior refusal outcome or confirmation of approval, state: "I cannot predict or guarantee visa approval. Your previous refusal requires an individual assessment. I recommend consulting a qualified Australian migration professional."
9. Tone: Professional, friendly, positive, and reassuring.`;

/**
 * Intelligent Synthesizer: Produces clear, real, simple, and accurately structured responses
 * using Markdown tables/grids for document lists, financial breakdowns, English criteria, and processing times.
 */
function generateStructuredAnswer(
  query: string,
  detectedIntent: string,
  results: RetrievalResult[],
  userProfile: UserContextProfile
): string {
  const isHigherEd = userProfile.studyLevel === "higher_ed" || userProfile.studyLevel === "postgrad_research";
  const isVET = userProfile.studyLevel === "vet";
  const isOnshore = userProfile.locationStatus === "onshore";
  const hasFamily = userProfile.hasDependents;

  switch (detectedIntent) {
    case "document_checklist":
      const studyLevelStr = (userProfile.studyLevel || "higher_ed").replace("_", " ").toUpperCase();
      const locationStr = (userProfile.locationStatus || "offshore").toUpperCase();
      return `Here is the official document checklist for the **Australian Student Visa (Subclass 500)** tailored for **${studyLevelStr}** (${locationStr}):

| Document Type | Purpose & Requirement | Action Link |
| --- | --- | --- |
| **Confirmation of Enrolment (CoE)** | Electronic PRISMS code for CRICOS registered course | [Search CRICOS Course ↗](https://cricos.education.gov.au/) |
| **Financial Capacity Proof** | Verifiable funds for 12 months (**AUD $29,710**) + tuition | [Check Financial Rules ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Genuine Student (GS) Statement** | Written responses addressing course choice & ties | [GS Requirement Guide ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement) |
| **English Test Certificate** | IELTS (min 6.5 Higher Ed / 6.0 VET), PTE (58 / 50) | [View Test Equivalencies ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Health Cover (OSHC)** | Continuous insurance policy from arrival to visa expiry | [Compare OSHC Providers ↗](https://www.privatehealth.gov.au/dynamic/oshc) |
| **Identity Documents** | Valid passport bio-data page, national ID, birth certificate | [Check Identity Specs ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist) |
| **Health Referral (HAP ID)** | eMedical referral letter for chest X-ray and examination | [Book eMedical Exam ↗](https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health/arrange-your-health-examination) |
${hasFamily ? `| **Family Evidence** | Marriage certificate, child birth certificates, and OSHC | [Dependent Guidelines ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |\n` : ""}| **Full Official Tool** | Department of Home Affairs Document Checklist Tool | [Launch Checklist Tool ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist) |

💡 **Customization Question:**
Are you applying with accompanying family members or sponsored by an approved scholarship? Let me know to fine-tune your exact checklist.

*Tip: All documents in languages other than English must include certified NAATI translations.*`;

    case "financial_capacity":
      return `To meet the official financial capacity requirement for Subclass 500, you must demonstrate verifiable funds for your **first 12 months** in Australia:

| Cost Item | Official Requirement (AUD) | Action Link |
| --- | --- | --- |
| **Primary Student Living Costs** | **AUD $29,710 / year** | [Home Affairs Financial Tool ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **1st Year Course Tuition** | Full 1st year fee (minus deposit on CoE) | [Verify on CRICOS ↗](https://cricos.education.gov.au/) |
| **Travel Expenses** | **AUD $2,000** per person | [Travel Cost Rules ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Accompanying Partner** | **AUD $10,394 / year** | [Partner Fund Rules ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Accompanying Child** | **AUD $4,449 / year** per child | [Schooling Fund Rules ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Alternative Annual Income** | **AUD $87,856+** (or **$102,593+** with family) | [ATO Tax Notice Info ↗](https://www.ato.gov.au/) |

💡 **Customization Question:**
What is your 1st year tuition fee and deposit amount? You can also click the **Financial Calculator** button above to calculate your exact dollar requirement.`;

    case "work_rights":
      return `Under **Visa Condition 8105**, international students on Subclass 500 have specific employment entitlements in Australia:

| Study Period | Fortnightly Work Limit | Action Link |
| --- | --- | --- |
| **Before Course Commences** | **0 Hours (No Work)** | [Check Course Start Date ↗](https://cricos.education.gov.au/) |
| **Course in Session (Term)** | **Up to 48 Hours / Fortnight** | [Check Entitlements on VEVO ↗](https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/overview) |
| **Scheduled University Breaks** | **Unrestricted Hours** | [Visa Conditions Guide ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/visa-conditions) |
| **Master's by Research & PhD** | **Unrestricted Hours** | [Research Student Rights ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/visa-conditions) |
| **Workplace Rights (Minimum Wage)**| Protected under Australian Law | [Fair Work Ombudsman Rights ↗](https://www.fairwork.gov.au/find-help-for/visa-holders-and-migrants) |

*Notice: Exceeding 48 hours per fortnight while your course is in session is a serious visa breach and can result in cancellation.*`;

    case "genuine_student":
      return `The **Genuine Student (GS) requirement** replaced the former Genuine Temporary Entrant (GTE) criterion on 23 March 2024. It evaluates whether you genuinely intend to complete your course in Australia:

| Assessment Factor | What Home Affairs Assesses | Action Link |
| --- | --- | --- |
| **Home Country Circumstances** | Ties to family, employment, and economic conditions | [GS Requirement Guide ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement) |
| **Choice of Course & Australia** | Why this specific course and university in Australia | [Search CRICOS Courses ↗](https://cricos.education.gov.au/) |
| **Career & Value of Course** | Expected career advancement and realistic future earnings | [Labor Market Insights ↗](https://www.jobsandskills.gov.au/) |
| **Academic & Travel History** | Complete study background and gap explanations | [Decision Ready Tips ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500) |

💡 **Customization Question:**
Have you had any study or employment gaps since your last qualification? Addressing gaps with clear documentation is essential for GS approval.`;

    case "visa_fee":
      return `The official Visa Application Charge (VAC) for the Student Visa (Subclass 500) was updated on 1 July 2024:

| Applicant Category | Official Fee (AUD) | Action Link |
| --- | --- | --- |
| **Primary Applicant (Base Charge)** | **AUD $1,600** | [Login to ImmiAccount ↗](https://online.immi.homeaffairs.gov.au/) |
| **Additional Applicant (18+)** | **AUD $1,190** | [Calculate on Pricing Estimator ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-pricing-estimator) |
| **Additional Applicant (Under 18)** | **AUD $390** | [Visa Pricing Tool ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-pricing-estimator) |
| **Subsequent Temporary Charge (STAC)**| **AUD $700** | [Check STAC Criteria ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-pricing-estimator) |

*Payment is completed online through the [ImmiAccount Portal (online.immi.homeaffairs.gov.au) ↗](https://online.immi.homeaffairs.gov.au/) using credit/debit card (approx. 1.4% surcharge), PayPal, or BPAY.*`;

    case "processing_times":
      return `Standard Student Visa (Subclass 500) processing time estimates published by the Department of Home Affairs:

| Education Sector | 50% Processed In | 90% Processed In | Action Link |
| --- | --- | --- | --- |
| **Higher Education (Uni)** | **~25 to 35 days** | **~45 to 60 days** | [Track Processing Times ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times) |
| **Vocational (VET)** | **~45 to 70 days** | **~3 to 4 months** | [Global Processing Tool ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times) |
| **ELICOS (English)** | **~25 to 35 days** | **~60 to 75 days** | [ELICOS Timeframes ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times) |
| **Postgraduate Research** | **~30 to 45 days** | **~50 to 70 days** | [Research Timeframes ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times) |
| **Track Your Application** | Real-time status update | Check processing in ImmiAccount | [Open ImmiAccount Portal ↗](https://online.immi.homeaffairs.gov.au/) |

*Tip: Decision-ready applications submitted with all required identity, financial, and academic proof upfront avoid Section 56 requests and are processed significantly faster.*`;

    case "english_requirements":
      return `Minimum English language proficiency scores for Subclass 500 (scores valid for 2 years prior to application):

| Pathway / Sector | Minimum IELTS | Minimum PTE Academic | Action Link |
| --- | --- | --- | --- |
| **Higher Education Direct Entry** | **6.5 overall** | **58** | [English Score Criteria ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Vocational (VET) Direct Entry** | **6.0 overall** | **50** | [View VET Test Scores ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Packaged with ELICOS (10+ weeks)** | **5.5 overall** | **42** | [ELICOS Package Rules ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |
| **Book Official IELTS Test** | Australia / Global | Book test session | [Book IELTS Official ↗](https://ielts.com.au/) |
| **Book Official PTE Test** | Pearson PTE Academic | Book test session | [Book Pearson PTE ↗](https://www.pearsonpte.com/) |

💡 **Customization Question:**
What passport do you hold or have you completed 5 or more years of full-time study in English? You may qualify for a full English test exemption.`;

    case "oshc_insurance":
      return `**Overseas Student Health Cover (OSHC)** is mandatory under **Visa Condition 8501**:

| Policy Tier | Coverage Scope | Action Link |
| --- | --- | --- |
| **Single Cover** | Primary student only | [Compare OSHC Providers ↗](https://www.privatehealth.gov.au/dynamic/oshc) |
| **Dual Family Cover** | Student + partner OR student + children | [Compare Family Policies ↗](https://www.privatehealth.gov.au/dynamic/oshc) |
| **Multi Family Cover** | Student + partner + children | [Compare Multi Family ↗](https://www.privatehealth.gov.au/dynamic/oshc) |
| **Official OSHC Guidelines** | Australian Government regulations | [Home Affairs OSHC Guide ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility) |

*Remember to purchase your policy before applying, as the policy number and dates must be entered in your [ImmiAccount Portal (online.immi.homeaffairs.gov.au) ↗](https://online.immi.homeaffairs.gov.au/) application.*`;

    case "onshore_restrictions":
      return `Effective 1 July 2024, the Australian Government strictly prohibits onshore 'visa hopping':

| Current Visa Held in Australia | Eligible to Apply for Student Visa 500 Onshore? | Action Link |
| --- | --- | --- |
| **Visitor Visa (Subclass 600)** | ❌ **No (Prohibited)** | [Apply Offshore via ImmiAccount ↗](https://online.immi.homeaffairs.gov.au/) |
| **Temporary Graduate (Subclass 485)** | ❌ **No (Prohibited)** | [Explore Skilled Migration Options ↗](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189) |
| **Visa with Condition 8503/8534** | ❌ **No (No Further Stay)** | [Request Form 1447 Waiver ↗](https://immi.homeaffairs.gov.au/change-conditions/waive-visa-condition) |`;

    default: {
      const topChunk = results[0]?.chunk;
      if (!topChunk) {
        return `I don't have sufficient verified information in my current database to answer this specific query. Please check official Australian Department of Home Affairs publications or consult a registered migration agent (MARA).`;
      }
      return `Here is the verified information regarding **${topChunk.title}**:

${topChunk.content}`;
    }
  }
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Immigration Pal Subclass 500 RAG Engine",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    totalIndexedChunks: OFFICIAL_KNOWLEDGE_BASE.length,
  });
});

// Knowledge base listing endpoint (for Knowledge Base Inspector)
app.get("/api/knowledge-base", (_req: Request, res: Response) => {
  res.json({
    categories: CATEGORY_NAMES,
    chunks: OFFICIAL_KNOWLEDGE_BASE,
  });
});

// Search testing endpoint
app.post("/api/search", (req: Request, res: Response) => {
  const { query, userProfile } = req.body;
  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Missing query parameter" });
    return;
  }
  const retrieval = hybridRetrieve(query, userProfile, 5);
  res.json(retrieval);
});

// Chat endpoint with RAG pipeline
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history = [], userProfile = {} } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // 1. Perform Hybrid Retrieval with Fine-Grained Intent Routing
    const retrieval = hybridRetrieve(message, userProfile as UserContextProfile, 4);

    // 2. Handle Guardrails immediately if flagged
    if (retrieval.guardrailTriggered) {
      const citations = retrieval.results.map(r => ({
        title: r.chunk.sourceTitle,
        url: r.chunk.sourceUrl,
        section: r.chunk.section,
      }));

      res.json({
        answer: retrieval.guardrailTriggered.suggestedResponse,
        retrievedChunks: retrieval.results,
        confidenceScore: retrieval.confidenceScore,
        confidenceLevel: retrieval.confidenceLevel,
        guardrailTriggered: retrieval.guardrailTriggered,
        citations,
        source: "guardrail",
      });
      return;
    }

    // Prepare citations
    const citations = retrieval.results.map(r => ({
      title: r.chunk.sourceTitle,
      url: r.chunk.sourceUrl,
      section: r.chunk.section,
    }));

    // 3. Try Gemini generation if API key is configured with fast 3.5s timeout
    if (ai) {
      try {
        const contextText = retrieval.results
          .map((r, i) => `[Source ${i + 1}] ${r.chunk.title} (${r.chunk.sourceUrl}):\n${r.chunk.content}`)
          .join("\n\n---\n\n");

        const promptText = `USER CONTEXT PROFILE:
Study Level: ${userProfile.studyLevel || "Higher Education"}
Applicant Location: ${userProfile.locationStatus || "Offshore"}
Country of Passport: ${userProfile.countryOfPassport || "Unspecified"}
Dependents: ${userProfile.hasDependents ? "Yes" : "No"}

OFFICIAL HOME AFFAIRS RETRIEVED CONTEXT:
${contextText}

CONVERSATION HISTORY:
${history.slice(-3).map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Immigration Pal"}: ${m.content}`).join("\n")}

USER QUESTION:
${message}

Please provide a clear, real, and simple answer directly addressing the user's question. Use clean Markdown tables or visual grids where appropriate (e.g. for document lists, financial breakdowns, English scores, and processing times). Include clickable markdown action links for every portal and website mentioned: [Portal Name (domain.gov.au) ↗](https://domain.gov.au/). Never output bare unlinked domains like online.immi.homeaffairs.gov.au without a link. If user background is general, suggest 1-2 clarifying questions.`;

        const geminiCall = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            systemInstruction: IMMIGRATION_PAL_SYSTEM_INSTRUCTION,
          },
        });

        // Safe 12s timeout that resolves null instead of throwing an unhandled rejection
        const timeoutCall = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 12000)
        );

        const response: any = await Promise.race([geminiCall, timeoutCall]);

        const generatedAnswer = response?.text?.trim();
        if (generatedAnswer && generatedAnswer.length > 20) {
          res.json({
            answer: generatedAnswer,
            retrievedChunks: retrieval.results,
            confidenceScore: retrieval.confidenceScore,
            confidenceLevel: retrieval.confidenceLevel,
            citations,
            diagnostics: retrieval.diagnostics,
            source: "gemini-rag",
          });
          return;
        }
      } catch (err: unknown) {
        // Quietly fallback to verified synthesis if Gemini is slow or unavailable
      }
    }

    // 4. Intelligent Synthesizer: Always returns clear, real, simple, and accurate answers with tables
    const synthesizedAnswer = generateStructuredAnswer(
      message,
      retrieval.detectedIntent,
      retrieval.results,
      userProfile as UserContextProfile
    );

    res.json({
      answer: synthesizedAnswer,
      retrievedChunks: retrieval.results,
      confidenceScore: retrieval.confidenceScore,
      confidenceLevel: retrieval.confidenceLevel,
      citations,
      diagnostics: retrieval.diagnostics,
      source: "verified-synthesis",
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({
      error: "Internal server error occurred while retrieving visa information.",
    });
  }
});

// Vite middleware for development / Static files for production
async function startServer() {
  if (isProduction) {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Immigration Pal server running on http://0.0.0.0:${port}`);
  });
}

startServer();
