/**
 * Official Australian Department of Home Affairs Student Visa (Subclass 500) Knowledge Base
 * Structured into 5 logical categories with exact metadata, chunk IDs, source URLs, and timestamps.
 */

export interface KnowledgeChunk {
  id: string;
  category: 1 | 2 | 3 | 4 | 5;
  categoryName: string;
  title: string;
  section: string;
  sourceUrl: string;
  sourceTitle: string;
  publishDate: string;
  lastVerifiedDate: string;
  keywords: string[];
  content: string;
  tokenCount?: number;
}

export const CATEGORY_NAMES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Visa Overview & Eligibility",
  2: "Financial & Documentation Requirements",
  3: "Application Process & Costs",
  4: "Visa Conditions & Student Obligations",
  5: "Processing Times & Policy Updates",
};

export const OFFICIAL_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // CATEGORY 1: VISA OVERVIEW & ELIGIBILITY
  {
    id: "chunk-overview-purpose",
    category: 1,
    categoryName: "Visa Overview & Eligibility",
    title: "Subclass 500 Visa Purpose and Entitlements",
    section: "About the Student Visa (Subclass 500)",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    sourceTitle: "Department of Home Affairs - Student Visa (Subclass 500)",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["subclass 500", "student visa", "purpose", "study in australia", "stay length", "cricos", "entitlements"],
    content: `The Student Visa (Subclass 500) allows international students to reside temporarily in Australia to participate in a full-time course of study at a recognised Australian education institution. 

Key entitlements include:
- Participate in an eligible course of primary, secondary, vocational education (VET), higher education (bachelor, master, doctoral degrees), or ELICOS (standalone English course).
- Bring eligible family members (partner/spouse and dependent unmarried children under 18) to Australia as secondary applicants.
- Work up to 48 hours per fortnight during regular study sessions and unrestricted hours during scheduled course vacations (Condition 8105).
- Travel in and out of Australia multiple times while the visa is valid.
- Stay for up to 5 years, aligned directly with the duration of the registered course of study indicated on the Confirmation of Enrolment (CoE).`,
  },
  {
    id: "chunk-eligibility-enrolment-coe",
    category: 1,
    categoryName: "Visa Overview & Eligibility",
    title: "Enrolment and Confirmation of Enrolment (CoE) Requirement",
    section: "Eligibility - Enrolment in a Registered Course",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
    sourceTitle: "Department of Home Affairs - Student Visa Eligibility",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["coe", "confirmation of enrolment", "cricos", "course registration", "package courses", "prins"],
    content: `To be eligible for a Student Visa (Subclass 500), applicants must be enrolled in a full-time course registered on the Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS).

Enrolment rules:
- Applicants must provide an official Confirmation of Enrolment (CoE) code issued by their Australian education provider at the time of application submission.
- Letter of Offer alone is NOT accepted for offshore or regular visa lodgement; the actual electronic CoE generated via PRISMS is mandatory.
- Course packaging: You can package two or more courses if there is clear academic progression (for example, ELICOS English course leading to a Diploma, leading to a Bachelor's Degree). A separate CoE is required for each individual course in the study package. The preliminary course must lead logically into the principal course.
- Exemptions from CoE: Only applicable for Foreign Affairs or Defence-sponsored students (who provide a letter of support) or secondary school exchange students (who provide an Acceptance Advice of Secondary Exchange Students - AASES form).`,
  },
  {
    id: "chunk-eligibility-genuine-student",
    category: 1,
    categoryName: "Visa Overview & Eligibility",
    title: "Genuine Student (GS) Requirement Criteria",
    section: "Eligibility - Genuine Student Criterion",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement",
    sourceTitle: "Department of Home Affairs - Genuine Student Requirement",
    publishDate: "2024-03-23",
    lastVerifiedDate: "2026-10-15",
    keywords: ["genuine student", "gs requirement", "gte replacement", "statement", "home country ties", "career value", "study rationale"],
    content: `On 23 March 2024, the Australian Government replaced the Genuine Temporary Entrant (GTE) requirement with the new Genuine Student (GS) requirement for Student Visa (Subclass 500) applications.

The GS requirement focuses on assessing whether the applicant is genuinely intending to obtain a quality Australian education:
- Details of current circumstances, including ties to family, community, employment, and economic conditions in the applicant's home country.
- An explanation of why the applicant chose this specific course, why they chose Australia, and how the education provider was selected over domestic or other international alternatives.
- The realistic value of the course to the applicant's future employment opportunities and expected salary in their home country or internationally.
- Complete academic study history, including reasons for any gaps between studies or changes in academic fields.
- Immigration and travel history to Australia or other countries, including any previous visa refusals or cancellations.
- While the previous GTE test strictly required applicants to prove an intention to leave Australia permanently, the GS requirement recognises that Australia needs skilled graduates; however, applicants must demonstrate a genuine commitment to their study programme and have realistic future plans. Vague or generic statements without supporting documentary proof are a frequent cause for visa refusal.`,
  },
  {
    id: "chunk-eligibility-age-welfare",
    category: 1,
    categoryName: "Visa Overview & Eligibility",
    title: "Age Requirements and Welfare Arrangements for Minors",
    section: "Eligibility - Welfare and Minors Under 18",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
    sourceTitle: "Department of Home Affairs - Welfare Arrangements for Minors",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["age", "under 18", "minor", "welfare", "caaw", "guardian", "subclass 590", "school age"],
    content: `Age criteria and child welfare regulations for Subclass 500:
- School students: Must be at least 6 years old at the time of visa application. A student cannot be more than 17 years old when starting Year 9, cannot be more than 18 when starting Year 10, cannot be more than 19 when starting Year 11, and cannot be more than 20 when starting Year 12.
- Students under 18 years of age must have adequate welfare arrangements in place for the full duration of their stay in Australia:
  1. Option A: Nominate a parent, legal custodian, or eligible relative over 21 years old as their Student Guardian (holding or applying for a Student Guardian Visa Subclass 590).
  2. Option B: Obtain a Confirmation of Appropriate Accommodation and Welfare (CAAW) issued by the education provider.
  3. Option C: Approval of Secondary Exchange Student arrangements (AASES form).
- Students under 18 cannot enter Australia before the welfare start date specified on the CAAW letter or before their guardian arrives in Australia.`,
  },

  // CATEGORY 2: FINANCIAL & DOCUMENTATION REQUIREMENTS
  {
    id: "chunk-financial-capacity-thresholds",
    category: 2,
    categoryName: "Financial & Documentation Requirements",
    title: "Financial Capacity Living Cost Thresholds and Calculations",
    section: "Financial Capacity Evidence and Amounts",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
    sourceTitle: "Department of Home Affairs - Financial Capacity Requirement",
    publishDate: "2024-05-10",
    lastVerifiedDate: "2026-10-15",
    keywords: ["financial capacity", "funds required", "living cost", "29710", "bank statement", "dependent funds", "travel costs"],
    content: `On 10 May 2024, the Australian Department of Home Affairs increased the minimum financial capacity requirement for student visa applicants to align with 75% of the national minimum wage.

Current required financial amounts (all values in AUD):
- Primary Student Living Costs: AUD $29,710 per year (12 months).
- Accompanying Spouse / Partner: AUD $10,394 per year.
- Accompanying Dependent Child: AUD $4,449 per year per child.
- Schooling Costs for School-Age Dependents: AUD $13,502 per year per child.
- Travel Expenses: Approximately AUD $2,000 per person (primary applicant and each dependent) for return airfare to Australia.

Total Financial Calculation Formula:
Total Funds = [12 months Course Tuition Fee (minus any deposit already paid on CoE)] + [AUD $29,710 Primary Living Costs] + [Accompanying Dependents Living Costs] + [Schooling Costs if children aged 5-18] + [AUD $2,000 Travel per person].

Acceptable Evidence of Funds:
1. Money deposit held in a financial institution (bank savings, fixed deposit held by student, spouse, or parents for a verifiable period).
2. Government educational loan or approved institutional education loan in the applicant's name.
3. Scholarship or official sponsorship from an approved university, Australian Government, or foreign government.
4. Annual Income Option: Demonstrating that parents or legal spouse have a personal annual income of at least AUD $87,856 (or AUD $102,593 if accompanied by secondary applicants) earned in the 12 months immediately prior to application, evidenced by official government tax assessment notices.`,
  },
  {
    id: "chunk-english-language-requirements",
    category: 2,
    categoryName: "Financial & Documentation Requirements",
    title: "English Language Proficiency Minimum Test Scores",
    section: "English Proficiency Requirements and Exemptions",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
    sourceTitle: "Department of Home Affairs - English Language Requirements",
    publishDate: "2024-03-23",
    lastVerifiedDate: "2026-10-15",
    keywords: ["english test", "ielts", "pte", "toefl", "cambridge", "minimum score", "elicos package", "exemptions"],
    content: `In March 2024, the Department of Home Affairs increased the minimum English language requirements for Student Visa (Subclass 500) applicants.

Minimum test scores required (tests must have been taken within 2 years before application date):
- Direct Entry to Higher Education / Vocational Course:
  - IELTS: Minimum overall score of 6.5 (or equivalent test score) for direct entry into standard university courses, or minimum 6.0 overall for vocational education.
  - PTE Academic: Minimum score of 58 (higher education) or 50 (vocational).
  - Cambridge C1 Advanced (CAE): Minimum score of 176.
  - TOEFL iBT: Minimum score of 79.
- Packaged with ELICOS English (minimum 10 weeks course):
  - IELTS overall 5.5 (or PTE Academic 42).
- Packaged with ELICOS English (minimum 20 weeks course):
  - IELTS overall 5.0 (or PTE Academic 36).
- English test exemptions apply ONLY to:
  - Citizens and passport holders of the United Kingdom, United States of America, Canada, New Zealand, or the Republic of Ireland.
  - Students who have completed at least 5 years of full-time study in English in Australia, UK, USA, Canada, New Zealand, South Africa, or Republic of Ireland.
  - Primary school or secondary exchange students.
  - Foreign Affairs or Defence sponsored students.`,
  },
  {
    id: "chunk-oshc-health-cover",
    category: 2,
    categoryName: "Financial & Documentation Requirements",
    title: "Overseas Student Health Cover (OSHC) Regulations",
    section: "Health Insurance - OSHC Mandatory Requirement",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
    sourceTitle: "Department of Home Affairs - Overseas Student Health Cover",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["oshc", "overseas student health cover", "medical insurance", "allianz", "medibank", "bupa", "condition 8501"],
    content: `International students must maintain adequate Overseas Student Health Cover (OSHC) for the entire duration of their stay in Australia (Visa Condition 8501).

Key OSHC rules:
- Policy Start Date: Must begin before or on the date of your scheduled arrival in Australia. It cannot start after your arrival.
- Policy End Date: Must extend until the expected end date of your student visa (typically 1 to 2 months after course completion for standard courses, or up to 3 months after completion for courses ending in November/December).
- Approved OSHC Providers: Allianz Care, Medibank Private, Bupa Australia, nib Health Funds, CBHS International Health.
- Policy Types: Single (student only), Dual Family (student + spouse or student + children), or Multi Family (student + spouse + children).
- Exemptions: Norwegian students covered by the Norwegian National Insurance Scheme, Swedish students covered by CSN International/Kammarkollegiet, and Belgian students covered by the Reciprocal Health Care Agreement.`,
  },
  {
    id: "chunk-documentation-checklist-evidence",
    category: 2,
    categoryName: "Financial & Documentation Requirements",
    title: "Comprehensive Student Visa Document Checklist",
    section: "Documentation - Required Evidentiary Checklist",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/document-checklist",
    sourceTitle: "Department of Home Affairs - Document Checklist Tool",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["document checklist", "required documents", "passport", "transcripts", "certified copies", "translations", "evidence"],
    content: `When applying for Subclass 500, applicants must submit clear, high-resolution colour scans of original documents. Any document not in English must be accompanied by an accredited certified English translation (NAATI accredited if translated in Australia).

Standard Document Checklist:
1. Identity Documents:
   - Current valid passport bio-data page (valid for the full duration of proposed stay).
   - National Identity Card and Birth Certificate.
   - Evidence of any name change (marriage certificate, deed poll, if applicable).
2. Enrolment & Welfare:
   - Electronic Confirmation of Enrolment (CoE) for all courses in package.
   - CAAW letter or Form 157N (Nomination of student guardian) if under 18.
3. Genuine Student Evidence:
   - Detailed Genuine Student (GS) statement addressing specific circumstances, course relevance, and career plans.
   - CV/Resume showing detailed employment and educational background without unexplained gaps.
   - Letters of reference from current/previous employers and payslips (if applicable).
4. Academic & Professional Qualifications:
   - Academic transcripts, certificates, graduation diplomas, and degrees.
5. English Language Test Certificate:
   - IELTS, PTE Academic, TOEFL iBT, or Cambridge certificate taken within 2 years (or proof of exemption).
6. Financial Capacity Proof:
   - Bank statements covering at least 3-6 months, loan sanction letter, or tax returns matching the AUD $29,710 + tuition formula.
   - Affidavit of support if supported by parents/spouse, along with relationship proof.
7. Health & Character:
   - OSHC policy certificate with exact policy dates.
   - Police clearance certificates (if requested) and completed Form 80 / Form 1221.`,
  },

  // CATEGORY 3: APPLICATION PROCESS & COSTS
  {
    id: "chunk-application-fees-charges",
    category: 3,
    categoryName: "Application Process & Costs",
    title: "Visa Application Charges (Fees) and Payment Rules",
    section: "Cost - Visa Pricing and Surcharges",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-pricing-estimator",
    sourceTitle: "Department of Home Affairs - Visa Pricing Estimator",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["visa fee", "vac", "1600 aud", "subsequent temporary application charge", "costs", "price increase", "stac"],
    content: `On 1 July 2024, the Australian Government adjusted the Visa Application Charge (VAC) for the Student Visa (Subclass 500).

Official Application Fees (in AUD):
- Base Application Charge (Main Applicant): AUD $1,600.
- Additional Applicant Charge (18 and over, e.g., spouse/partner): AUD $1,190.
- Additional Applicant Charge (Under 18, e.g., child): AUD $390 per child.
- Subsequent Temporary Application Charge (STAC): An additional AUD $700 per person applies if the applicant is inside Australia and already holds certain temporary visas when lodging another temporary visa application onshore.
- Credit Card Surcharge: ImmiAccount applies a payment surcharge (approximately 1.4% for Visa/MasterCard, 1.99% for American Express, 0.99% for PayPal).
- Non-Refundable: Visa application charges are strictly non-refundable regardless of whether the visa is granted, refused, or withdrawn, except in very narrow legislative circumstances (such as applicant death or provider default).`,
  },
  {
    id: "chunk-application-steps-immiaccount",
    category: 3,
    categoryName: "Application Process & Costs",
    title: "Step-by-Step ImmiAccount Application Lodgement Procedure",
    section: "Step by Step - How to Apply via ImmiAccount",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/step-by-step",
    sourceTitle: "Department of Home Affairs - How to Apply Step by Step",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["immiaccount", "form 157a", "how to apply", "application steps", "lodgement", "timing", "online application"],
    content: `Applications for the Student Visa (Subclass 500) must be lodged online through the Department of Home Affairs ImmiAccount portal.

Step-by-Step Procedure:
1. Obtain CoE & OSHC: Secure an unconditional offer from a CRICOS institution, pay deposit, obtain official electronic CoE, and purchase OSHC for the complete duration.
2. Prepare Documents: Gather all identity, academic, financial, English test, and Genuine Student evidence in PDF/JPG format (max 5MB per file).
3. Create ImmiAccount: Register at online.immi.homeaffairs.gov.au.
4. Complete Application Form 157A: Fill in personal details, passport info, previous travel history, education history, and Genuine Student answers.
5. Attach Documents: Upload supporting documents under appropriate categories. Ensure clear filenames and legible scans.
6. Pay Visa Fee: Pay AUD $1,600 (plus applicable dependent or STAC fees) via credit card, PayPal, or BPAY.
7. Record Transaction Reference Number (TRN): Keep your TRN for tracking and communication.
8. Application Timing: Recommended to apply 8 to 12 weeks before course commencement date. Home Affairs allows lodging up to 124 days (approx. 4 months) prior to course start date.`,
  },
  {
    id: "chunk-health-biometrics-process",
    category: 3,
    categoryName: "Application Process & Costs",
    title: "Health Examinations and Biometrics Collection Requirements",
    section: "After Lodging - Health and Biometrics",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/step-by-step#After",
    sourceTitle: "Department of Home Affairs - Health & Biometrics Process",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["health exam", "emedical", "hap id", "biometrics", "vfs global", "panel physician", "bupa medical", "chest x-ray"],
    content: `After lodging your application in ImmiAccount, you may need to complete health examinations and biometrics collection.

Health Examinations (eMedical):
- Generate a HAP ID through your ImmiAccount under 'View health assessment'.
- Download the eMedical referral letter containing your HAP ID and required medical tests (typically 501 Medical Examination and 502 Chest X-ray for tuberculosis screening).
- Book an appointment with an approved Department of Home Affairs Panel Physician (if offshore) or Bupa Medical Visa Services (if inside Australia).
- Medical examination results are uploaded directly by the clinic into the Australian eMedical system.

Biometrics Collection:
- Applicants lodging from specified countries must provide biometric data (digital facial photograph and 10-digit fingerprint scan).
- Home Affairs issues a Biometrics Requirement Letter with a requirement date (usually within 14 days of lodgement).
- Book an appointment at an official Australian Biometric Collection Centre (ABCC) managed by VFS Global or TLScontact.
- Failure to complete biometrics within the required timeframe can lead to application refusal.`,
  },

  // CATEGORY 4: VISA CONDITIONS & STUDENT OBLIGATIONS
  {
    id: "chunk-conditions-work-8105",
    category: 4,
    categoryName: "Visa Conditions & Student Obligations",
    title: "Condition 8105 Work Restrictions and Working Hours Limit",
    section: "Visa Conditions - Condition 8105 (Work Limit)",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/visa-conditions",
    sourceTitle: "Department of Home Affairs - Student Visa Work Conditions",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["condition 8105", "work hours", "48 hours fortnight", "unlimited work", "work restrictions", "phd work", "masters work"],
    content: `All Student Visa (Subclass 500) holders are subject to Visa Condition 8105 governing employment rights in Australia.

Condition 8105 Rules:
- General Fortnightly Limit: Primary visa holders cannot work in Australia before their course of study has officially commenced. Once the course has commenced, students may work up to 48 hours per fortnight (a fortnight is defined as any period of 14 days starting on a Monday) when their course of study is in session.
- Semester Breaks: Students can work unrestricted hours during officially scheduled course vacations or breaks recognised by their education provider (such as summer or winter holidays, or after the course has officially ended as listed on their CoE).
- Research Students: Students enrolled in a Master's by Research or Doctoral (PhD) degree have NO work limit once their course has commenced; they can work unrestricted hours.
- Work Placements / Internships: Work that is a registered, mandatory part of the CRICOS course curriculum does not count toward the 48-hour fortnightly limit.
- Family Members (Secondary Applicants): Cannot work before the primary student's course commences. Once commenced, family members can work up to 48 hours per fortnight. If the primary student is studying a Master's degree (coursework or research) or Doctoral degree, dependent family members have unrestricted work rights.
- Penalty: Working beyond permitted hours is a breach of visa condition and can result in visa cancellation under Section 116 of the Migration Act.`,
  },
  {
    id: "chunk-conditions-academic-8202-8501-8533",
    category: 4,
    categoryName: "Visa Conditions & Student Obligations",
    title: "Mandatory Study Progress, OSHC, and Address Reporting Conditions",
    section: "Visa Conditions - Conditions 8202, 8501, 8516, 8533",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/visa-conditions",
    sourceTitle: "Department of Home Affairs - Mandatory Student Visa Conditions",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["condition 8202", "condition 8501", "condition 8516", "condition 8533", "course progress", "address update", "changing course"],
    content: `Key mandatory conditions attached to all Subclass 500 visas:

1. Condition 8202 (Enrolment and Satisfactory Course Progress):
   - You must remain enrolled in a registered full-time CRICOS course.
   - You must maintain satisfactory attendance (if required by your provider, especially in ELICOS and VET) and satisfactory course academic progress for each study period.
   - You cannot transfer to a lower Australian Qualifications Framework (AQF) level course without applying for and being granted a new student visa (e.g., cannot downgrade from a Bachelor's Degree AQF 7 to a Diploma AQF 5 without a new visa).

2. Condition 8501 (Maintain Health Cover):
   - You must maintain continuous Overseas Student Health Cover (OSHC) throughout your stay in Australia. A gap in health insurance coverage violates this condition.

3. Condition 8516 (Continue to Satisfy Visa Criteria):
   - You must continue to satisfy the prerequisites for visa grant, including maintaining financial capacity and remaining a genuine student.

4. Condition 8533 (Notify Residential Address):
   - You must inform your education provider of your Australian residential address within 7 days of arriving in Australia.
   - If you change your address, you must notify your provider within 7 days of the move.`,
  },
  {
    id: "chunk-conditions-onshore-restrictions",
    category: 4,
    categoryName: "Visa Conditions & Student Obligations",
    title: "Onshore Visa Hopping Restrictions (July 2024 Policy)",
    section: "Visa Conditions - Restrictions on Applying Onshore",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    sourceTitle: "Department of Home Affairs - Ending Visa Hopping Onshore",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["visa hopping", "onshore application", "visitor visa 600", "temporary graduate 485", "restrictions", "july 2024", "no further stay 8503"],
    content: `Effective 1 July 2024, the Australian Government implemented strict regulations to prevent 'visa hopping' inside Australia:

Key Onshore Lodgement Restrictions:
- Visitor Visa (Subclass 600) holders are no longer permitted to apply for a Student Visa (Subclass 500) while in Australia. Tourists wanting to study in Australia must depart and apply from offshore.
- Temporary Graduate Visa (Subclass 485) holders cannot apply for a Student Visa (Subclass 500) while onshore. Graduates are expected to find skilled employment or depart Australia when their graduate visa expires, rather than cycling back onto student visas.
- Maritime Crew (Subclass 988) and Electronic Travel Authority (Subclass 601) holders are similarly prohibited from lodging an onshore Subclass 500 application.
- Condition 8503 (No Further Stay): If your current visa has Condition 8503 or 8534 attached, you cannot lodge any substantive visa application in Australia unless you receive a formal waiver from the Department of Home Affairs based on major, uncontrollable compassionate or compelling circumstances.`,
  },

  // CATEGORY 5: PROCESSING TIMES & POLICY UPDATES
  {
    id: "chunk-processing-times-sectors",
    category: 5,
    categoryName: "Processing Times & Policy Updates",
    title: "Official Visa Processing Timeframes by Education Sector",
    section: "Processing Times - Standard Sector Estimates",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times",
    sourceTitle: "Department of Home Affairs - Global Visa Processing Times",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["processing times", "how long", "timeframe", "higher education", "vet", "elicos", "evidence levels", "sector"],
    content: `The Department of Home Affairs assesses Subclass 500 applications on a case-by-case basis. Actual processing times depend on whether all required documents are attached at lodgement, responsiveness to requests for information, and the applicant's risk rating.

Typical Published Processing Timeframes by Sector:
- Higher Education Sector (Universities):
  - 50% of applications processed within 25 to 35 calendar days.
  - 90% of applications processed within 45 to 60 calendar days.
- Vocational Education and Training (VET Sector):
  - 50% of applications processed within 45 to 70 calendar days.
  - 90% of applications processed within 3 to 4 months (due to enhanced integrity screening).
- ELICOS (Standalone English Language Sector):
  - 50% of applications processed within 25 to 35 calendar days.
  - 90% of applications processed within 60 to 75 calendar days.
- Schools Sector:
  - 50% of applications processed within 35 to 45 calendar days.
  - 90% of applications processed within 60 to 80 calendar days.
- Postgraduate Research Sector (Master's by Research & PhD):
  - 50% of applications processed within 30 to 45 calendar days.
  - 90% of applications processed within 50 to 70 calendar days.
- Decision Ready Applications: Applications submitted with all required identity, financial, English, and genuine student documentation upfront are processed substantially faster than incomplete submissions requiring Section 56 requests.`,
  },
  {
    id: "chunk-policy-priority-direction-107",
    category: 5,
    categoryName: "Processing Times & Policy Updates",
    title: "Ministerial Direction 107 and Provider Risk Ratings",
    section: "Policy Updates - Ministerial Direction 107",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    sourceTitle: "Department of Home Affairs - Visa Processing Priorities",
    publishDate: "2024-01-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["ministerial direction 107", "priority processing", "risk tier", "evidence level", "streamlined processing", "university rating"],
    content: `Under Ministerial Direction 107 (and the Simplified Student Visa Framework - SSVF), the Department of Home Affairs assigns priority processing to student visa applications based on institutional risk ratings:

Priority Order:
- Priority 1: Applications lodged for higher education institutions, vocational providers, and schools classified as Evidence Level 1 (lowest immigration risk). Level 1 university applications receive the fastest processing and simplified evidentiary requirements.
- Priority 2: Applications for institutions classified as Evidence Level 2.
- Priority 3: Applications for institutions classified as Evidence Level 3 (highest immigration risk). These applications undergo intensive scrutiny, mandatory upfront proof of financial capacity and English scores, and longer processing durations.
- Offshore vs Onshore: Complete, decision-ready offshore applications from Level 1 providers are actively prioritized in departmental visa processing centres.`,
  },
  {
    id: "chunk-policy-future-speculation-warning",
    category: 5,
    categoryName: "Processing Times & Policy Updates",
    title: "Policy Limitations, Future Speculation, and Legal Advice Boundaries",
    section: "Important Notices - Scope and Limitations",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    sourceTitle: "Department of Home Affairs - Official Visa Policies",
    publishDate: "2024-07-01",
    lastVerifiedDate: "2026-10-15",
    keywords: ["future policy", "speculation", "legal advice", "mara", "refusal", "guarantee approval", "unannounced rules"],
    content: `Immigration Pal operates under strict boundaries regarding future policy speculation and individual legal determinations:
1. No Speculation on Future Changes: The Department of Home Affairs periodically reviews student visa policy. Immigration Pal cannot speculate on draft legislation, media leaks, or unannounced policy changes scheduled for future dates. Users must rely on verified, published legislation.
2. No Legal Advice or Guarantees: Immigration Pal provides general informational guidance based strictly on published Australian immigration law. It is NOT a registered migration agent (MARA) or immigration lawyer and cannot predict, assure, or guarantee visa approval.
3. Prior Visa Refusals: Applicants with previous Australian visa refusals, cancellations, or adverse immigration history in other countries (Five Eyes or others) require individualized case assessment. Such applicants are advised to consult a registered migration agent or an Australian legal practitioner.`,
  },
];
