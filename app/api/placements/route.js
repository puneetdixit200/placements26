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

const runtimeCorrections = [
  { slug: "idfc-first-bank", applicationStatus: "Not Selected", currentStage: "OA completed on 10-Aug-2026. IDFC FIRST Bank sent a direct update on 22-Aug-2026 confirming they will not move forward with Puneet's Application Engineer application.", nextAction: "No further action for this application unless a new IDFC role opens.", deadline: null, timeline: [{ stage: "OA completed", date: "10 August 2026" }, { stage: "Application closed by IDFC FIRST Bank", date: "22 August 2026" }] },
  { slug: "inmobi-group", applicationStatus: "Not Applicable", currentStage: "RVITM was not considered by InMobi; this is not a personal rejection.", nextAction: "No action unless a fresh official RVITM placement notice appears.", deadline: null, timeline: [] },
  { slug: "sama", applicationStatus: "Not Applied", currentStage: "Registration form was not filled; preserve Not Applied.", nextAction: "No action unless a newer explicit placement-cell opportunity reopens registration.", deadline: null, timeline: [] },
  { slug: "bitgo", name: "BitGo", role: "Software Engineer Intern", applicationStatus: "Not Applicable", currentStage: "Authoritative user-confirmed state: RVITM was not being considered for the current BitGo process as of the 14-Aug-2026 placement update. No newer official BitGo/company communication has been promoted in this sync to reopen the opportunity.", nextAction: "No action unless a fresh official BitGo or placement-cell communication explicitly reopens the opportunity for RVITM.", deadline: null, timeline: [], source: "Explicit user-confirmed state", notes: "Preserve the earlier 12-Aug application-list entry only as historical evidence; do not show this as Applied/awaiting shortlist." },
  { slug: "evertz-india", currentStage: "Evertz online assessment was held on 19-Aug-2026. The official 20-Aug absentee blacklist did not include Puneet; personal result/next-round status is still pending.", nextAction: "Wait for Evertz result / next-round communication." },
  { slug: "relyntis-software", applicationStatus: "Need Info", currentStage: "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence confirms whether Puneet submitted the RELYNTIS form.", nextAction: "No active deadline; treat personal application status as unconfirmed unless newer evidence appears." },
  { slug: "eurofins", applicationStatus: "Not Shortlisted", currentStage: "Official Eurofins final shortlist for the 9–10 Sep process was published on 21-Aug-2026; Puneet is not on it.", nextAction: "No Eurofins action unless a corrected/additional shortlist is published.", timeline: [{ stage: "Final shortlist published", date: "21 August 2026; Puneet not listed" }] },
  { slug: "sartorius-india", package: { stipend: "₹20,000 per month" }, applicationStatus: "Not Selected", currentStage: "Sartorius Stedim India published the final LCM & Quality Team internship result on 21-Aug-2026; Puneet is not among the final selects.", nextAction: "No Sartorius action unless a newer official correction/additional selection appears.", timeline: [{ stage: "Final selection published", date: "21 August 2026; Puneet not selected" }] },
  { slug: "amd-india", name: "AMD India Pvt Ltd", role: "Co-Op / Internship (with PPO) — Software/Hardware domain allocation", industry: "Semiconductors / Software / Hardware / Systems", package: { stipend: "₹40,000 per month for B.Tech" }, ppo: "BE FTE Year-1 earning potential ₹19.45 LPA", applicationStatus: "Not Applied", currentStage: "AMD registration deadline passed on 21-Aug-2026 at 7:00 AM without a completed registration/resume upload. A newer 27-Aug RVITM update says AMD considered only RVCE students this time.", nextAction: "No current action unless RVITM/AMD opens a separate RVITM opportunity.", deadline: null, timeline: [], source: "RVITM Placement WhatsApp archive plus deadline verification" },
  { slug: "dover-india", name: "Dover India", role: "Associate Software Engineer", industry: "Software Engineering / Industrial Technology", package: { stipend: "₹25,000 per month" }, ppo: "₹12 LPA FTE + ₹2 lakh joining bonus", applicationStatus: "Applied", currentStage: "Official RVITM/Dover update on 29-Aug-2026 confirms the 31-Aug process is fully virtual from home: PPT 12:00–1:00 PM, followed by the Online Assessment 2:00–3:30 PM. Dover says both PPT and test links have already been sent to shortlisted students. Puneet remains confirmed shortlisted from the direct Dover communication received 28-Aug.", nextAction: "Join the Dover virtual PPT on 31-Aug from 12:00–1:00 PM, then take the DoSelect OA from 2:00–3:30 PM. Check registered email/Spam for both links and verify DoSelect Secure Browser plus webcam beforehand.", deadline: null, timeline: [{ stage: "Virtual PPT", date: "31 August 2026, 12:00–1:00 PM IST" }, { stage: "Online Test", date: "31 August 2026, 2:00–3:30 PM IST" }], source: "Official RVITM/Dover email dated 29-Aug-2026 plus direct Dover company email dated 28-Aug-2026", notes: "The 29-Aug official update supersedes any in-person assumption: the full 31-Aug process is virtual from home. Webcam must remain active throughout the DoSelect OA." },
  { slug: "arctic-wolf-networks", name: "Arctic Wolf Networks", role: "Security / Software Intern (Internship + PPO)", industry: "Cybersecurity / Software Engineering", package: { stipend: "₹60,000 per month" }, ppo: "₹22 LPA last-year CTC reference", applicationStatus: "Not Shortlisted", currentStage: "RVITM placement leadership confirmed on 21-Aug-2026 that no student from RVITM was shortlisted by Arctic Wolf.", nextAction: "No action unless a revised shortlist/reopening appears.", timeline: [{ stage: "RVITM no-shortlist confirmation", date: "21 August 2026" }], source: "RVITM Placement WhatsApp dated 21-Aug-2026" },
  { slug: "juspay", name: "Juspay Technologies", role: "Software Development Engineer (SDE)", industry: "Payments Technology / Backend / Distributed Systems / Infrastructure", package: { stipend: "₹40,000 per month" }, ppo: "₹27 LPA CTC", applicationStatus: "Not Shortlisted", appliedDate: "2026-08-23", currentStage: "First-round Juspay OA was held on 28-Aug-2026. RVITM published the OA-cleared shortlist and Puneet is not on it.", nextAction: "No further Juspay action unless RVITM/Juspay publishes a correction or additional shortlist.", deadline: null, timeline: [{ stage: "Registration confirmed", date: "23 August 2026" }, { stage: "First-round Online Assessment", date: "28 August 2026" }, { stage: "OA-cleared shortlist published", date: "28 August 2026; Puneet not listed" }], source: "Official RVITM Placement Gmail and attached OA result sheet dated 28-Aug-2026" },
  { slug: "qnance-technologies", name: "Qnance Technologies LLP", role: "Software Developer Intern", industry: "Software Engineering / Product Development", package: { stipend: "₹70,000 per month" }, ppo: "> ₹12 LPA FTE, performance-based conversion", requirements: ["BE CS & EC cluster", "8.0 CGPA & above", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/1YDv76kXupmefO6V77VGUER_B06uYK1oY0pe8PRUYZAg/edit?usp=sharing", applicationStatus: "Applied", appliedDate: "2026-08-25", currentStage: "Official Qnance registration sheet confirms Puneet / 1RF23CS119 with Gender and resume populated.", nextAction: "Prepare for the Qnance PPT + Online Assessment on 4-Sep-2026 and monitor for exact time/venue.", deadline: null, timeline: [{ stage: "Registration completed", date: "25 August 2026" }, { stage: "PPT + Online Assessment", date: "4 September 2026; time TBD" }, { stage: "Interviews", date: "5–7 September 2026; personal slot TBD" }], source: "RVITM Placement WhatsApp plus official registration sheet" },
  { slug: "kinaxis", name: "Kinaxis", role: "Associate Consultant", industry: "Supply Chain Software / Enterprise SaaS / Consulting", package: { stipend: "₹35,000 per month" }, ppo: "₹8 LPA base FTE; 6-month internship + FTE conversion LOI", applicationStatus: "Not Applied", currentStage: "Kinaxis registration closed before 9:00 AM on 25-Aug-2026. Final recheck found no Puneet / 1RF23CS119 registration row and no required Puneet-named resume upload. A newer 27-Aug shortlist names four students and does not include Puneet.", nextAction: "No active Kinaxis action unless RVITM/Kinaxis explicitly publishes a corrected/additional shortlist involving Puneet.", deadline: null, timeline: [], source: "Official Kinaxis registration sheet plus RVITM Placement WhatsApp" },
  { slug: "cargill-dtd", name: "Cargill", role: "DT&D Internship Program – Software Engineer pathway", applicationStatus: "Applied", currentStage: "Personal participation is confirmed. Cargill/Codility sent a direct assessment invitation to Puneet on 31-Aug-2026. This supersedes the earlier raw-source caveat that Puneet's inclusion in the revised Cargill list was unverified. The campus assessment schedule remains 10:00 AM at RVITM Computer Labs unless newer official communication changes it.", nextAction: "Complete the Cargill Codility assessment on 31-Aug. After submission, monitor Cargill/RVITM communication for results and the conditional 11-Sep interview stage.", timeline: [{ stage: "Both registrations completed", date: "18 August 2026" }, { stage: "Pre-Placement Talk", date: "26 August 2026 at RVITM Auditorium" }, { stage: "Codility Online Assessment", date: "31 August 2026, 10:00–11:30 AM at RVITM Computer Labs; personal participation confirmed by direct Cargill/Codility invite" }, { stage: "Interviews", date: "11 September 2026, 10:00 AM; conditional on progression" }], source: "Direct Cargill/Codility assessment invitation dated 31-Aug-2026 plus official Cargill registration evidence and 29-Aug RVITM placement update", notes: "Direct Codility invitation to mr.puneetdixit@gmail.com confirms personal assessment participation. The 29-Aug placement update supplies the campus logistics: own fully charged laptop with working webcam, report early, mobile phones not allowed." },
  { slug: "outbox", name: "OutBox", role: "Software Development Engineer – Intern", industry: "Full Stack Development / Software Engineering", package: { stipend: "₹30,000–₹40,000 per month" }, ppo: "₹10–12 LPA", applicationStatus: "Applied", appliedDate: "2026-08-25", currentStage: "Registration is confirmed. The final OutBox SDE assignment deadline was the end of 29-Aug-2026 with no extension. The latest captured submitted-student list did not include Puneet, and no later submission confirmation was found through 30-Aug 6:57 AM IST, so assignment submission remains unconfirmed.", nextAction: "Deadline has passed. Monitor for any OutBox/placement-cell acknowledgement or exception; do not assume the assignment was accepted without confirmation.", deadline: "End of Saturday, 29 August 2026; deadline passed", timeline: [{ stage: "Registration confirmed", date: "27 August 2026" }, { stage: "Final mandatory SDE assignment deadline", date: "End of 29 August 2026; no extension" }], applicationUrl: "https://sumptuous-word-80f.notion.site/Software-Development-Intern-Assignment-2bc1596f45e88080995cec1180a2bc60", source: "Official RVITM registration evidence plus 29-Aug placement-cell final reminder", notes: "The 29-Aug raw archive includes a submission-status list of students whose assignments were received; Puneet is not on that captured list. No overnight confirmation was found." },
  { slug: "nhai-internship-program", name: "NHAI (National Highways Authority of India)", role: "Winter Internship Programme 2026-27 / Term Internship Programme 2027", industry: "Government Infrastructure / Highway Projects / Technology", package: { stipend: "₹20,000 per month" }, applicationStatus: "Considering", currentStage: "Official AICTE notice forwarded by RVITM; NHAI student application deadline is 20-Oct-2026.", nextAction: "Verify institute eligibility and submit the NHAI portal application before 20-Oct-2026.", deadline: "20 October 2026; exact clock cutoff not stated", timeline: [{ stage: "Student application deadline", date: "20 October 2026; time TBD" }, { stage: "Institute verification/recommendation deadline", date: "10 November 2026" }], applicationUrl: "https://internshipsatnhai.digitalindiacorporation.in/" },
  { slug: "walmart-global-tech", name: "Walmart Global Tech", role: "Full-Time + Internship — 2027 Campus Drive", industry: "Software Engineering / Global Technology / Enterprise Systems", ppo: "BE total compensation ₹26.09 LPA", applicationStatus: "Applied", appliedDate: "2026-08-26", currentStage: "Official Walmart registration sheet confirms Puneet / 1RF23CS119 with Gender = Male and Resume Link populated. Newer RVITM scheduling on 26-Aug postponed Walmart to Friday, 28-Aug-2026. No newer personal result was found in this sync.", nextAction: "Monitor for Walmart OA result or revised next-stage communication.", deadline: null, source: "RVITM Placement WhatsApp plus official Walmart registration sheet" },
  { slug: "qualcomm-hw-2027", name: "Qualcomm", role: "INFRA SW Waitlist — 2027 Campus Drive", industry: "Semiconductors / Infrastructure Software / Embedded Systems", applicationStatus: "Waitlisted", appliedDate: "2026-08-26", currentStage: "Official revised Qualcomm shortlist/waitlist received 29-Aug-2026 confirms Puneet Dixit is specifically INFRA SW Waitlist for the 31-Aug-2026 face-to-face interview process.", nextAction: "Assemble at RVU D Block, 5th Floor, Computer Lab 1 before 9:00 AM on 31-Aug-2026 with a laptop and working webcam. Remain available for the face-to-face process, but treat participation as waitlist status unless Qualcomm/placement staff promotes Puneet into the primary shortlist.", deadline: null, timeline: [{ stage: "Registered candidate / test credentials issued", date: "27 August 2026" }, { stage: "Remote proctored Online Assessment", date: "27 August 2026, 3:00 PM" }, { stage: "Revised shortlist/waitlist published", date: "29 August 2026; Puneet = INFRA SW Waitlist" }, { stage: "Face-to-face interviews", date: "31 August 2026; assemble 9:00 AM at RVU D Block, 5th Floor, Computer Lab 1" }], source: "Official Placement RVCE Gmail dated 29-Aug-2026, corroborated by the late-29-Aug placement-raw-data Qualcomm revised-list archive", notes: "The 7:58 PM revised official email resolves the earlier shortlist/waitlist ambiguity. Puneet is INFRA SW Waitlist, not primary shortlist." },
  { slug: "baker-hughes", name: "Baker Hughes", role: "Digital Technology Intern", industry: "Digital Technology / Software / Engineering", package: { stipend: "₹50,000 per month" }, ppo: "₹12 LPA CTC/PBC", requirements: ["Minimum CGPA 7.5/10", "No current backlogs"], applicationUrl: "https://docs.google.com/spreadsheets/d/14Wu04_8bztxZWVofUWrGDqTTA75C_D4_8JryWayMNt8/edit?usp=sharing", applicationStatus: "Applied", appliedDate: "2026-08-28", currentStage: "Official Baker Hughes registration sheet confirms Puneet / 1RF23CS119 with Gender = Male and the Baker Hughes resume populated.", nextAction: "Prepare for the full-day Baker Hughes campus drive on 2-Sep-2026 and monitor for exact reporting time, venue and round instructions.", deadline: null, timeline: [{ stage: "Registration completed", date: "28 August 2026" }, { stage: "Campus placement drive", date: "2 September 2026; full day" }], source: "Official Baker Hughes registration sheet plus RVITM Placement WhatsApp" },
  { slug: "cloudera", name: "Cloudera", role: "Software Engineering Intern", industry: "Cloud Data / Distributed Systems / Software Engineering", package: { stipend: "₹45,000 per month" }, ppo: "~₹20 LPA full-time CTC (₹18 LPA base), conversion based on internship performance", requirements: ["BE CS Cluster", "7.5 CGPA & above", "No active backlogs"], applicationStatus: "Applied", appliedDate: "2026-08-28", currentStage: "Official registration sheet confirms Puneet / 1RF23CS119 with Gender = Male and Resume Link populated.", nextAction: "Prepare for the Cloudera on-campus drive at RVCE on 2–3 Sep 2026 and monitor for exact daily reporting time, venue and round sequence.", deadline: null, timeline: [{ stage: "Registration completed", date: "28 August 2026" }, { stage: "On-campus drive at RVCE", date: "2–3 September 2026; exact daily time TBD" }], source: "RVITM Placement WhatsApp plus official Cloudera registration sheet" },
  { slug: "gyansys", name: "GyanSys", role: "Internship + PPO", industry: "Software / Enterprise Technology / Consulting", package: { stipend: "₹25,000 per month" }, ppo: "₹8 LPA full-time CTC including 10% variable pay", applicationStatus: "Not Eligible", currentStage: "Puneet does not meet the published 85%-throughout cutoff because his official 12th score is 83.", nextAction: "No action unless RVITM/GyanSys revises the eligibility cutoff or publishes an exception.", deadline: null, timeline: [] },
  { slug: "coupa", name: "Coupa", role: "Software Engineer – Intern", applicationStatus: "Not Applied", currentStage: "Final post-deadline recheck found neither Puneet nor USN 1RF23CS119 in the official Coupa registration sheet.", nextAction: "No active Coupa action unless RVITM/Coupa reopens registration or publishes a correction/additional list.", deadline: null, timeline: [] },
  { slug: "tekoraai", name: "TekoraAI", role: "Software / AI Internship Programme", package: { stipend: "Unpaid" }, ppo: null, applicationStatus: "Need Info", currentStage: "RVITM asks for four candidates for free internships; no personal nomination or actionable deadline is confirmed.", nextAction: "Monitor RVITM for the nomination/selection process and deadline.", deadline: null }
];

function applyRuntimeCorrections(sourceCompanies) {
  const companies = [...sourceCompanies];
  for (const addition of runtimeCorrections) {
    const i = companies.findIndex((c) => c.slug === addition.slug);
    if (i >= 0) companies[i] = { ...companies[i], ...addition };
    else companies.push(normalizeAddition(addition));
  }
  return companies;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];
  if (bySlug.get("outbox")?.applicationStatus === "Applied") announcements.push({ id: "outbox-deadline-passed-2026-08-30", title: "OutBox assignment deadline passed — submission unconfirmed", message: "The final OutBox deadline was end of 29-Aug with no extension. The latest captured submitted-student list did not include Puneet, and no overnight confirmation was found.", date: "2026-08-30", type: "warning" });
  if (bySlug.get("qualcomm-hw-2027")?.applicationStatus === "Waitlisted") announcements.push({ id: "qualcomm-waitlist-2026-08-31", title: "Qualcomm INFRA SW Waitlist — assemble 9:00 AM", message: "Official revised Qualcomm communication confirms Puneet is INFRA SW Waitlist. Assemble at RVU D Block, 5th Floor, Computer Lab 1 before 9:00 AM on 31-Aug with a laptop and webcam.", date: "2026-08-29", type: "warning" });
  if (bySlug.get("cargill-dtd")?.applicationStatus === "Applied") announcements.push({ id: "cargill-oa-2026-08-31", title: "Cargill Codility assessment confirmed", message: "Cargill/Codility directly invited Puneet to the 31-Aug assessment, confirming personal participation. Campus logistics remain 10:00–11:30 AM at RVITM Computer Labs unless newer official communication changes them.", date: "2026-08-31", type: "warning" });
  if (bySlug.get("dover-india")?.applicationStatus === "Applied") announcements.push({ id: "dover-virtual-process-2026-08-31", title: "Dover virtual process — PPT 12:00 PM, OA 2:00 PM", message: "Official 29-Aug Dover/RVITM update confirms the 31-Aug process is virtual from home: PPT 12:00–1:00 PM, then DoSelect OA 2:00–3:30 PM. Links were sent to shortlisted students.", date: "2026-08-29", type: "warning" });
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
      notice: "Placement records combine the primary tracker with authoritative overrides and newer official updates. Qualcomm's revised 29-Aug communication confirms Puneet as INFRA SW Waitlist for the 31-Aug face-to-face process; assemble before 9:00 AM at RVU D Block, 5th Floor, Computer Lab 1 with a laptop and webcam. Dover's 31-Aug process is fully virtual from home: PPT 12:00–1:00 PM and DoSelect OA 2:00–3:30 PM. Cargill personal assessment participation is now confirmed by a direct Cargill/Codility invitation received 31-Aug; the campus schedule remains 10:00–11:30 AM at RVITM Computer Labs unless newer official communication changes it. OutBox's assignment deadline passed at the end of 29-Aug; submission remains unconfirmed because no later acknowledgement was found. BitGo remains Not Applicable under explicit user-confirmed state unless a fresh official communication reopens it. The raw placement mirror is current through late 29-Aug commit a0e4682dbdae288096633a7fbe11455faf7bce19 and is stale relative to 31-Aug official Gmail activity. IDFC preserves its 10-Aug OA completion and is Not Selected based on the newer direct 22-Aug company update. InMobi is Not Applicable; Sama is Not Applied. Google and Flipkart remain excluded unless a fresh official notice appears."
    },
    announcements: buildAnnouncements(companies),
    companies,
  }, { headers: { "Cache-Control": "no-store" } });
}