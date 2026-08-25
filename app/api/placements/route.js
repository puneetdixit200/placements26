import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-25T15:02:00+05:30";

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
  upsert({ slug: "juspay", name: "Juspay Technologies", role: "Software Development Engineer (SDE)", industry: "Payments Technology / Backend / Distributed Systems / Infrastructure", package: { stipend: "₹40,000 per month" }, ppo: "₹27 LPA CTC", applicationStatus: "Applied", appliedDate: "2026-08-23", currentStage: "Registration is confirmed. Mandatory Virtual PPT is 25-Aug-2026 at 3:45 PM (join by 3:35 PM). Campus hiring is 27-Aug-2026 at RVITM Auditorium, reporting 9:30 AM; every round is eliminatory.", nextAction: "Attend the mandatory 25-Aug PPT, then report to RVITM Auditorium by 9:30 AM on 27-Aug with college ID, updated resume, fully charged laptop and black pen.", deadline: null, timeline: [{ stage: "Registration confirmed", date: "23 August 2026" }, { stage: "Virtual Pre-Placement Talk", date: "25 August 2026, 3:45 PM IST; join by 3:35 PM" }, { stage: "Campus Hiring Process", date: "27 August 2026, report 9:30 AM at RVITM Auditorium" }], source: "Official RVITM Placement email and WhatsApp dated 24-Aug-2026" });
  upsert({ slug: "qnance-technologies", name: "Qnance Technologies LLP", role: "Software Developer Intern", industry: "Software Engineering / Product Development", package: { stipend: "₹70,000 per month" }, ppo: "> ₹12 LPA FTE, performance-based conversion", description: "2027 RV placement drive for a Bangalore-based Software Developer Intern role with internship-to-FTE conversion based on performance.", requirements: ["BE CS & EC cluster", "8.0 CGPA & above", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/1YDv76kXupmefO6V77VGUER_B06uYK1oY0pe8PRUYZAg/edit?usp=sharing", applicationStatus: "Applied", appliedDate: "2026-08-25", currentStage: "Official Qnance registration sheet row 84 shows Puneet / 1RF23CS119 fully populated with Gender = Male and the Qnance resume link present. Registration is complete.", nextAction: "Prepare for the Qnance PPT + Online Assessment on 4-Sep-2026 and monitor RVITM communication for exact time/venue.", deadline: null, timeline: [{ stage: "Registration completed", date: "25 August 2026" }, { stage: "PPT + Online Assessment", date: "4 September 2026; time TBD" }, { stage: "Interviews", date: "5–7 September 2026; personal slot TBD" }], skills: ["DSA", "Coding", "OOP", "DBMS/SQL", "Operating Systems", "Computer Networks", "Debugging"], source: "RVITM Placement WhatsApp plus official registration sheet", notes: "Registration confirmed complete." });
  upsert({ slug: "kinaxis", name: "Kinaxis", role: "Associate Consultant", industry: "Supply Chain Software / Enterprise SaaS / Consulting", package: { stipend: "₹35,000 per month" }, ppo: "₹8 LPA base FTE; 6-month internship + FTE conversion LOI", description: "Associate Consultant campus opportunity in supply-chain software.", requirements: ["BE CS, DS, IS, AIML, CY, Mech & IEM", "7.5 CGPA & above", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/1puYcMXWtwps4UbGe48pcouIfJR2p2jzFEK1pg4aaoDA/edit?usp=sharing", applicationStatus: "Not Applied", currentStage: "Kinaxis registration closed before 9:00 AM on 25-Aug-2026. Final recheck found no Puneet / 1RF23CS119 registration row and no required Puneet-named resume upload.", nextAction: "No active Kinaxis action unless RVITM/Kinaxis reopens registration or accepts a correction.", deadline: null, timeline: [], skills: ["Problem Solving", "Analytical Reasoning", "SQL", "DBMS", "OOP", "CS Fundamentals", "Communication", "Consulting Mindset"], source: "Official Kinaxis registration sheet and resume folder", notes: "Academic eligibility was met, but registration was not completed." });

  upsert({ slug: "cargill-dtd", name: "Cargill", role: "DT&D Internship Program – Software Engineer pathway", applicationStatus: "Applied", currentStage: "Both mandatory registrations are complete. Official RVITM email dated 25-Aug-2026 confirms the in-person Cargill PPT on 26-Aug-2026: report by 10:00 AM sharp; session starts 10:30 AM onwards at RVITM Auditorium, JP Nagar.", nextAction: "Report to RVITM Auditorium by 10:00 AM on 26-Aug with college ID and updated resume. Attend the 10:30 AM onwards PPT and complete any pre-screening questionnaire accurately. Then prepare for the 31-Aug 2:00 PM online test if shortlisted.", timeline: [{ stage: "Both registrations completed", date: "18 August 2026" }, { stage: "Pre-Placement Talk", date: "26 August 2026; report 10:00 AM, session 10:30 AM onwards at RVITM Auditorium" }, { stage: "Online Test", date: "31 August 2026, 2:00 PM" }, { stage: "Interviews", date: "11 September 2026, 10:00 AM; conditional on progression" }], notes: "The 25-Aug official RVITM email supersedes the earlier 11:00 AM PPT marker. Carry college ID and updated resume. Pre-screening/eligibility finalisation remains part of the process.", source: "Official RVITM Placement email dated 25-Aug-2026 plus prior Cargill application/Drive evidence" });
  upsert({ slug: "outbox", name: "OutBox", role: "Software Development Engineer – Intern", industry: "Full Stack Development / Software Engineering", package: { stipend: "₹30,000–₹40,000 per month" }, ppo: "₹10–12 LPA", description: "SDE internship for the 2027 batch focused on full-stack development, with PPO and a mandatory take-home assignment.", requirements: ["2027 graduating batch", "Detailed branch/CGPA criteria not specified in the official RVITM notice", "Must be willing to complete the mandatory assignment within 48 hours", "Assignment must be the student's own work; AI-generated code/solutions may be rejected"], applicationUrl: "https://forms.gle/asSzP4Be6uWrz1vx6", jdUrl: "https://sumptuous-word-80f.notion.site/Software-Development-Engineer-Internship-2d21596f45e880bfab34c82421b7c132", applicationStatus: "Considering", currentStage: "Official RVITM Gmail and 25-Aug WhatsApp confirm registration closes today at 6:00 PM. The mandatory SDE assignment must be completed within 48 hours. RVITM explicitly warns that AI-generated code/solutions may be rejected and that submission access permissions must allow the OutBox team to view the work.", nextAction: "Use the latest registration form and register before 6:00 PM only if willing to complete the assignment personally within 48 hours. Submit only your own work and verify the assignment is shared/accessibly permissioned for the OutBox team.", deadline: "25 August 2026, 6:00 PM IST", timeline: [{ stage: "Registration deadline", date: "25 August 2026, 6:00 PM IST" }, { stage: "Mandatory SDE assignment", date: "Within 48 hours of receiving the opportunity" }], skills: ["Full Stack Development", "DSA", "JavaScript/TypeScript", "APIs", "Databases", "Debugging"], source: "Official RVITM Placement Gmail and WhatsApp dated 25-Aug-2026", notes: "Latest registration link supersedes the earlier Google Form URL. Assignment: https://sumptuous-word-80f.notion.site/Software-Development-Intern-Assignment-2bc1596f45e88080995cec1180a2bc60" });

  return companies;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];
  if (bySlug.get("outbox")?.applicationStatus === "Considering") announcements.push({ id: "outbox-registration-2026-08-25", title: "OutBox registration closes today", message: "OutBox SDE Intern closes at 6:00 PM on 25-Aug. The mandatory assignment is due within 48 hours, must be your own work, and must be shared so OutBox can access it.", date: "2026-08-25", type: "urgent" });
  if (bySlug.get("juspay")?.applicationStatus === "Applied") announcements.push({ id: "juspay-campus-hiring-2026-08-27", title: "Juspay campus hiring confirmed", message: "Mandatory Juspay Virtual PPT is 25-Aug at 3:45 PM. Campus hiring follows on 27-Aug at RVITM Auditorium with 9:30 AM reporting.", date: "2026-08-24", type: "info" });
  return [...announcements, ...(sourceData.announcements || []).filter((a) => !announcements.some((x) => x.id === a.id))];
}

export async function GET() {
  const companies = applyRuntimeCorrections(applyConfirmedState(sourceData.companies || [], overrideData));
  const meta = overrideData.meta || {};
  return Response.json({
    ...sourceData,
    meta: {
      ...sourceData.meta,
      lastUpdated: RUNTIME_LAST_UPDATED,
      rawDataThrough: rawSourceMeta.rawDataThrough || meta.rawDataThrough || sourceData.meta?.rawDataThrough,
      rawSourceLatestCommit: rawSourceMeta.rawSourceLatestCommit || meta.rawSourceLatestCommit,
      rawSourceLatestCommitAt: rawSourceMeta.rawSourceLatestCommitAt || meta.rawSourceLatestCommitAt,
      rawSourceFreshness: rawSourceMeta.rawSourceFreshness,
      notice: "Placement records combine the primary tracker with authoritative overrides and newer official updates. OutBox registration closes 25-Aug at 6:00 PM with a mandatory 48-hour own-work assignment. Cargill PPT reporting is 26-Aug at 10:00 AM, session 10:30 AM onwards. Qnance is Applied; Kinaxis is Not Applied; Juspay is Applied with campus hiring on 27-Aug. IDFC is Not Selected; InMobi is Not Applicable; Sama is Not Applied; ShareChat/Eurofins are Not Shortlisted; Sartorius is Not Selected; AMD/Dover are Not Applied. Google and Flipkart remain excluded unless a fresh official notice appears.",
    },
    announcements: buildAnnouncements(companies),
    companies,
  }, { headers: { "Cache-Control": "no-store" } });
}
