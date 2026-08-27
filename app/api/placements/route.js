import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

function newestTimestamp(...candidates) {
  return candidates.reduce((latest, current) => {
    if (!current || Number.isNaN(Date.parse(current))) return latest;
    if (!latest || Date.parse(current) > Date.parse(latest)) return current;
    return latest;
  }, null);
}

function normalizeAddition(addition) {
  const shortName = (addition.name || addition.slug || "NA")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    slug: addition.slug,
    name: addition.name,
    shortName,
    companyUrl: null,
    industry: "Software engineering",
    package: { stipend: null },
    ppo: null,
    description: addition.currentStage || "Campus application submitted; awaiting next-stage details.",
    roles: addition.roles || (addition.role ? [addition.role] : []),
    requirements: [],
    eligibility: [],
    skills: [],
    deadline: null,
    applicationUrl: null,
    jdUrl: null,
    jdLinks: [],
    timeline: [],
    source: "Placement Tracker 2026 / confirmed user state",
    ...addition,
  };
}

function applyConfirmedState(sourceCompanies, overrides) {
  const companies = new Map((sourceCompanies || []).map((company) => [company.slug, company]));
  for (const override of overrides.overrides || []) {
    const existing = companies.get(override.slug) || { slug: override.slug };
    const merged = { ...existing, ...override };
    if (override.applicationStatus === "Not Applicable" || override.applicationStatus === "Not Applied") {
      merged.deadline = null;
      merged.timeline = [];
    }
    companies.set(override.slug, merged);
  }
  for (const addition of overrides.additions || []) {
    const existing = companies.get(addition.slug);
    companies.set(addition.slug, existing ? { ...existing, ...addition } : normalizeAddition(addition));
  }
  const exclusions = new Set((overrides.exclusions || []).map((name) => name.toLowerCase()));
  return Array.from(companies.values()).filter((company) => {
    const name = (company.name || "").toLowerCase();
    const slug = (company.slug || "").toLowerCase();
    return !Array.from(exclusions).some((excluded) => name.includes(excluded) || slug.includes(excluded));
  });
}

function applyRuntimeCorrections(sourceCompanies) {
  const companies = [...sourceCompanies];
  const upsert = (addition) => {
    const i = companies.findIndex((c) => c.slug === addition.slug);
    if (i >= 0) companies[i] = { ...companies[i], ...addition };
    else companies.push(normalizeAddition(addition));
  };

  upsert({ slug: "idfc-first-bank", applicationStatus: "Not Selected", currentStage: "OA completed on 10-Aug-2026. IDFC FIRST Bank sent a direct update on 22-Aug-2026 confirming they will not move forward with Puneet's Application Engineer application.", nextAction: "No further action for this application unless a new IDFC role opens.", deadline: null, timeline: [{ stage: "OA completed", date: "10 August 2026" }, { stage: "Application closed by IDFC FIRST Bank", date: "22 August 2026" }] });
  upsert({ slug: "evertz-india", currentStage: "Evertz online assessment was held on 19-Aug-2026. The official 20-Aug absentee blacklist did not include Puneet; personal result/next-round status is still pending.", nextAction: "Wait for Evertz result / next-round communication." });
  upsert({ slug: "relyntis-software", applicationStatus: "Need Info", currentStage: "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence confirms whether Puneet submitted the RELYNTIS form.", nextAction: "No active deadline; treat personal application status as unconfirmed unless newer evidence appears." });
  upsert({ slug: "eurofins", applicationStatus: "Not Shortlisted", currentStage: "Official Eurofins final shortlist for the 9–10 Sep process was published on 21-Aug-2026; Puneet is not on it.", nextAction: "No Eurofins action unless a corrected/additional shortlist is published.", timeline: [{ stage: "Final shortlist published", date: "21 August 2026; Puneet not listed" }] });
  upsert({ slug: "sartorius-india", package: { stipend: "₹20,000 per month" }, applicationStatus: "Not Selected", currentStage: "Sartorius Stedim India published the final LCM & Quality Team internship result on 21-Aug-2026; Puneet is not among the final selects.", nextAction: "No Sartorius action unless a newer official correction/additional selection appears.", timeline: [{ stage: "Final selection published", date: "21 August 2026; Puneet not selected" }] });
  upsert({ slug: "amd-india", name: "AMD India Pvt Ltd", role: "Co-Op / Internship (with PPO) — Software/Hardware domain allocation", industry: "Semiconductors / Software / Hardware / Systems", package: { stipend: "₹40,000 per month for B.Tech" }, ppo: "BE FTE Year-1 earning potential ₹19.45 LPA", applicationStatus: "Not Applied", currentStage: "AMD registration deadline passed on 21-Aug-2026 at 7:00 AM without a completed registration/resume upload.", nextAction: "No current action unless RVITM/AMD reopens registration.", deadline: null, timeline: [], source: "RVITM Placement WhatsApp archive plus deadline verification" });
  upsert({ slug: "dover-india", name: "Dover India", role: "Associate Software Engineer", industry: "Software Engineering / Industrial Technology", package: { stipend: "₹25,000 per month" }, ppo: "₹12 LPA FTE + ₹2 lakh joining bonus", applicationStatus: "Not Applied", currentStage: "Dover registration deadline passed on 22-Aug-2026 at 9:00 AM with Puneet's Gender field still blank; resume entry was present but registration remained incomplete.", nextAction: "No current action unless RVITM/Dover reopens registration or accepts a correction.", deadline: null, timeline: [], source: "Official Dover registration sheet" });
  upsert({ slug: "arctic-wolf-networks", name: "Arctic Wolf Networks", role: "Security / Software Intern (Internship + PPO)", industry: "Cybersecurity / Software Engineering", package: { stipend: "₹60,000 per month" }, ppo: "₹22 LPA last-year CTC reference", applicationStatus: "Not Shortlisted", currentStage: "RVITM placement leadership confirmed on 21-Aug-2026 that no student from RVITM was shortlisted by Arctic Wolf.", nextAction: "No action unless a revised shortlist/reopening appears.", timeline: [{ stage: "RVITM no-shortlist confirmation", date: "21 August 2026" }], source: "RVITM Placement WhatsApp dated 21-Aug-2026" });
  upsert({ slug: "juspay", name: "Juspay Technologies", role: "Software Development Engineer (SDE)", industry: "Payments Technology / Backend / Distributed Systems / Infrastructure", package: { stipend: "₹40,000 per month" }, ppo: "₹27 LPA CTC", applicationStatus: "Applied", appliedDate: "2026-08-23", currentStage: "Registration is confirmed and the mandatory Virtual PPT was completed. Newer RVITM scheduling on 26-Aug confirms the postponed Juspay process as an OA on Friday, 28-Aug-2026. Exact reporting time and venue are still TBD.", nextAction: "Prepare for the Juspay OA on 28-Aug and monitor RVITM communication for exact reporting time/venue. Keep college ID, updated resume, charged laptop and black pen ready.", deadline: null, timeline: [{ stage: "Registration confirmed", date: "23 August 2026" }, { stage: "Virtual Pre-Placement Talk", date: "25 August 2026, 3:45 PM IST" }, { stage: "Online Assessment", date: "Friday, 28 August 2026; exact time/venue TBD" }], source: "Official RVITM Placement email plus newer WhatsApp dated 26-Aug-2026", notes: "The 26-Aug scheduling supersedes the earlier 27-Aug 9:30 AM campus-hiring schedule and confirms the next Juspay stage as an OA on 28-Aug." });
  upsert({ slug: "qnance-technologies", name: "Qnance Technologies LLP", role: "Software Developer Intern", industry: "Software Engineering / Product Development", package: { stipend: "₹70,000 per month" }, ppo: "> ₹12 LPA FTE, performance-based conversion", requirements: ["BE CS & EC cluster", "8.0 CGPA & above", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/1YDv76kXupmefO6V77VGUER_B06uYK1oY0pe8PRUYZAg/edit?usp=sharing", applicationStatus: "Applied", appliedDate: "2026-08-25", currentStage: "Official Qnance registration sheet confirms Puneet / 1RF23CS119 with Gender and resume populated.", nextAction: "Prepare for the Qnance PPT + Online Assessment on 4-Sep-2026 and monitor for exact time/venue.", deadline: null, timeline: [{ stage: "Registration completed", date: "25 August 2026" }, { stage: "PPT + Online Assessment", date: "4 September 2026; time TBD" }, { stage: "Interviews", date: "5–7 September 2026; personal slot TBD" }], source: "RVITM Placement WhatsApp plus official registration sheet" });
  upsert({ slug: "kinaxis", name: "Kinaxis", role: "Associate Consultant", industry: "Supply Chain Software / Enterprise SaaS / Consulting", package: { stipend: "₹35,000 per month" }, ppo: "₹8 LPA base FTE; 6-month internship + FTE conversion LOI", applicationStatus: "Not Applied", currentStage: "Kinaxis registration closed before 9:00 AM on 25-Aug-2026. Final recheck found no Puneet / 1RF23CS119 registration row and no required Puneet-named resume upload. Newer 26-Aug login instructions are explicitly for shortlisted students and do not independently establish Puneet's shortlist.", nextAction: "No active Kinaxis action unless RVITM/Kinaxis explicitly confirms Puneet in a corrected shortlist.", deadline: null, timeline: [], source: "Official Kinaxis registration sheet plus RVITM Placement WhatsApp" });
  upsert({ slug: "cargill-dtd", name: "Cargill", role: "DT&D Internship Program – Software Engineer pathway", applicationStatus: "Applied", currentStage: "Both mandatory registrations are complete. The Cargill PPT was held on 26-Aug-2026 at RVITM Auditorium; a raw placement update said it started at 11:00 AM. No Cargill rejection email is present in connected Gmail.", nextAction: "Prepare for the 31-Aug 2:00 PM online test if shortlisted and monitor for any pre-test instructions. Only refill Cargill forms if an actual rejection message is received.", timeline: [{ stage: "Both registrations completed", date: "18 August 2026" }, { stage: "Pre-Placement Talk", date: "26 August 2026 at RVITM Auditorium" }, { stage: "Online Test", date: "31 August 2026, 2:00 PM" }, { stage: "Interviews", date: "11 September 2026, 10:00 AM; conditional on progression" }], source: "Official RVITM/Cargill evidence plus 26-Aug WhatsApp update" });
  upsert({ slug: "outbox", name: "OutBox", role: "Software Development Engineer – Intern", industry: "Full Stack Development / Software Engineering", package: { stipend: "₹30,000–₹40,000 per month" }, ppo: "₹10–12 LPA", applicationStatus: "Need Info", currentStage: "Registration deadline passed on 25-Aug-2026 at 6:00 PM. No connected evidence confirms whether Puneet submitted the OutBox form before the deadline.", nextAction: "Treat registration as unverified until an official candidate list, acknowledgement or explicit user confirmation appears.", deadline: null, source: "Official RVITM Placement Gmail and WhatsApp" });
  upsert({ slug: "nhai-internship-program", name: "NHAI (National Highways Authority of India)", role: "Winter Internship Programme 2026-27 / Term Internship Programme 2027", industry: "Government Infrastructure / Highway Projects / Technology", package: { stipend: "₹20,000 per month" }, applicationStatus: "Considering", currentStage: "Official AICTE notice forwarded by RVITM; NHAI student application deadline is 20-Oct-2026.", nextAction: "Verify institute eligibility and submit the NHAI portal application before 20-Oct-2026.", deadline: "20 October 2026; exact clock cutoff not stated", timeline: [{ stage: "Student application deadline", date: "20 October 2026; time TBD" }, { stage: "Institute verification/recommendation deadline", date: "10 November 2026" }], applicationUrl: "https://internshipsatnhai.digitalindiacorporation.in/" });
  upsert({ slug: "walmart-global-tech", name: "Walmart Global Tech", role: "Full-Time + Internship — 2027 Campus Drive", industry: "Software Engineering / Global Technology / Enterprise Systems", ppo: "BE total compensation ₹26.09 LPA", applicationStatus: "Applied", appliedDate: "2026-08-26", currentStage: "Official Walmart registration sheet confirms Puneet / 1RF23CS119 with Gender = Male and Resume Link populated. Newer RVITM scheduling on 26-Aug postpones Walmart again to Friday, 28-Aug-2026. No exact OA time/venue update is confirmed yet.", nextAction: "Do not report for Walmart on 27-Aug. Prepare for a 28-Aug OA and monitor RVITM communication for the exact time/venue and reporting instructions.", deadline: null, timeline: [{ stage: "Registration completed", date: "26 August 2026" }, { stage: "Online Assessment", date: "Postponed to Friday, 28 August 2026; exact time/venue TBD" }], source: "RVITM Placement WhatsApp plus official Walmart registration sheet", notes: "The 26-Aug postponement supersedes the earlier 27-Aug OA date. The previously listed 1-Sep interview date should be treated as provisional until reconfirmed after the postponement." });
  upsert({ slug: "qualcomm-hw-2027", name: "Qualcomm", role: "Full-Time HW — 2027 Campus Drive", industry: "Semiconductors / Hardware Engineering / Embedded Systems", applicationStatus: "Applying", appliedDate: "2026-08-26", currentStage: "Puneet is a confirmed Qualcomm registered candidate from the direct 26-Aug email. HirePro registration remains due by 8:00 AM on 27-Aug unless already completed. Newer RVITM scheduling confirms Qualcomm OA today, 27-Aug-2026, at 3:00 PM.", nextAction: "Complete/verify HirePro registration before 8:00 AM, then prepare for and attend the Qualcomm OA at 3:00 PM today. Monitor placement communication for the exact RVCE room/reporting point.", deadline: "27 August 2026, 8:00 AM IST", timeline: [{ stage: "HirePro registration deadline", date: "27 August 2026, 8:00 AM IST" }, { stage: "Online Assessment", date: "27 August 2026, 3:00 PM; RVCE room/reporting point TBD" }], source: "Direct Qualcomm registered-candidate email dated 26-Aug-2026 plus newer RVITM scheduling WhatsApp dated 26-Aug-2026", notes: "Package and detailed JD remain unconfirmed. The 3:00 PM OA timing supersedes the earlier time-TBD drive placeholder." });
  upsert({ slug: "coupa", name: "Coupa", role: "Software Engineer – Intern (Internship followed by PBC to FTE)", industry: "Enterprise SaaS / Software Engineering / Spend Management", package: { stipend: "₹65,000 per month" }, ppo: "₹20 LPA CTC", requirements: ["B.E. CSE, ISE, ECE, EEE, DS, CY, ETCE, AIML", "7.0+ CGPA", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/1K3r1qe8S0OplabpLK6bfw9D5C0IiW8FtE9c3c9WaBJo/edit?usp=sharing", applicationStatus: "Not Applied", currentStage: "RVITM announced Coupa on 26-Aug-2026 with a same-day 6:00 PM deadline. Final post-deadline recheck finds neither Puneet nor USN 1RF23CS119 in the official Coupa registration sheet.", nextAction: "No active Coupa action unless RVITM/Coupa reopens registration or publishes a correction/additional list.", deadline: null, timeline: [], source: "RVITM Placement WhatsApp dated 26-Aug-2026 plus official Coupa sheet", notes: "Drive was virtual; PPT 27-Aug at 11:00 AM, assessment 27-Aug at 5:00 PM and interviews 28-Aug, but these stages are non-actionable without a completed registration." });

  return companies;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];
  if (bySlug.get("qualcomm-hw-2027")?.applicationStatus === "Applying") announcements.push({ id: "qualcomm-oa-2026-08-27", title: "Qualcomm OA today at 3:00 PM", message: "Qualcomm OA is confirmed for 27-Aug at 3:00 PM. HirePro registration is due by 8:00 AM unless already completed; exact RVCE room/reporting point is still TBD.", date: "2026-08-27", type: "warning" });
  if (bySlug.get("walmart-global-tech")?.applicationStatus === "Applied") announcements.push({ id: "walmart-postponed-2026-08-28", title: "Walmart postponed to Friday", message: "Walmart Global Tech registration is complete, but the OA is postponed to Friday, 28-Aug. Exact time/venue are TBD.", date: "2026-08-26", type: "warning" });
  if (bySlug.get("juspay")?.applicationStatus === "Applied") announcements.push({ id: "juspay-oa-2026-08-28", title: "Juspay OA on Friday", message: "The postponed Juspay process is confirmed as an OA on Friday, 28-Aug. Exact time/venue are TBD.", date: "2026-08-26", type: "warning" });
  return [...announcements, ...(sourceData.announcements || []).filter((a) => !announcements.some((x) => x.id === a.id))];
}

export async function GET() {
  const companies = applyRuntimeCorrections(applyConfirmedState(sourceData.companies || [], overrideData));
  const meta = overrideData.meta || {};
  const lastUpdated = newestTimestamp(sourceData.meta?.lastUpdated, meta.lastUpdated, rawSourceMeta.lastUpdated, rawSourceMeta.rawSourceLatestCommitAt);
  return Response.json({
    ...sourceData,
    meta: {
      ...sourceData.meta,
      lastUpdated: lastUpdated || sourceData.meta?.lastUpdated,
      rawDataThrough: rawSourceMeta.rawDataThrough || meta.rawDataThrough || sourceData.meta?.rawDataThrough,
      rawSourceLatestCommit: rawSourceMeta.rawSourceLatestCommit || meta.rawSourceLatestCommit,
      rawSourceLatestCommitAt: rawSourceMeta.rawSourceLatestCommitAt || meta.rawSourceLatestCommitAt,
      rawSourceFreshness: rawSourceMeta.rawSourceFreshness,
      notice: "Placement records combine the primary tracker with authoritative overrides and newer official updates. Qualcomm is an active registered-candidate process with HirePro registration due 27-Aug at 8:00 AM and OA today at 3:00 PM. Walmart is Applied but postponed to Friday 28-Aug, time/venue TBD. Juspay is Applied with OA Friday 28-Aug, time/venue TBD. Coupa closed 26-Aug without a completed Puneet registration. Cargill is Applied with the 31-Aug 2:00 PM test next if shortlisted. Qnance is Applied. IDFC is Not Selected; InMobi is Not Applicable; Sama is Not Applied; ShareChat/Eurofins are Not Shortlisted; Sartorius is Not Selected; AMD/Dover/Kinaxis/Coupa are Not Applied. Google and Flipkart remain excluded unless a fresh official notice appears.",
    },
    announcements: buildAnnouncements(companies),
    companies,
  }, { headers: { "Cache-Control": "no-store" } });
}
