import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-24T13:22:00+05:30";

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
  const corrected = sourceCompanies.map((company) => {
    if (company.slug === "idfc-first-bank") return {
      ...company,
      applicationStatus: "Not Selected",
      currentStage: "OA completed on 10-Aug-2026. IDFC FIRST Bank sent a direct application update on 22-Aug-2026 confirming they will not move forward with Puneet's Application Engineer application.",
      nextAction: "No further action for this application. Keep IDFC open only for a new future role or a fresh official application opportunity.",
      deadline: null,
      timeline: [
        { stage: "OA completed", date: "10 August 2026" },
        { stage: "Application closed by IDFC FIRST Bank", date: "22 August 2026" },
      ],
      notes: "OA completion on 10-Aug-2026 remains historical fact. Direct IDFC FIRST Bank email dated 22-Aug-2026 says the bank will not be moving forward with Puneet's Application Engineer application.",
    };
    if (company.slug === "evertz-india") return {
      ...company,
      currentStage: "Evertz online assessment was held on 19-Aug-2026. Official RVITM email on 20-Aug published the absentee blacklist; Puneet Dixit is not among the listed absentees. Personal result/next-round status is not yet announced.",
      nextAction: "Wait for Evertz result / next-round communication.",
      timeline: [
        ...(company.timeline || []).filter((item) => item.stage !== "Online Test"),
        { stage: "Online Test held", date: "19 August 2026, 1:30 PM IST at RVITM campus" },
        { stage: "Absentee blacklist published", date: "20 August 2026; Puneet not listed" },
      ],
    };
    if (company.slug === "relyntis-software") return {
      ...company,
      applicationStatus: "Need Info",
      currentStage: "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence confirms whether Puneet submitted the RELYNTIS form.",
      nextAction: "No active deadline; treat personal application status as unconfirmed unless newer evidence appears.",
    };
    if (company.slug === "eurofins") return {
      ...company,
      applicationStatus: "Not Shortlisted",
      currentStage: "Official Eurofins final company shortlist was published by RVITM on 21-Aug-2026 for the 9–10 Sep campus process. Puneet Dixit / 1RF23CS119 is not on the final shortlist.",
      nextAction: "No Eurofins action unless a corrected or additional shortlist is published.",
      timeline: [{ stage: "Final shortlist published", date: "21 August 2026; Puneet not listed" }],
    };
    if (company.slug === "sartorius-india") return {
      ...company,
      package: { stipend: "₹20,000 per month" },
      applicationStatus: "Not Selected",
      currentStage: "Sartorius Stedim India published the final LCM & Quality Team internship result on 21-Aug-2026. Puneet is not among the three final selects.",
      nextAction: "No Sartorius action unless a newer official correction or additional selection is published.",
      timeline: [{ stage: "Final selection published", date: "21 August 2026; Puneet not selected" }],
    };
    return company;
  });

  const upsert = (addition) => {
    const i = corrected.findIndex((c) => c.slug === addition.slug);
    if (i >= 0) corrected[i] = { ...corrected[i], ...addition };
    else corrected.push(normalizeAddition(addition));
  };

  upsert({
    slug: "amd-india",
    name: "AMD India Pvt Ltd",
    role: "Co-Op / Internship (with PPO) — Software/Hardware domain allocation",
    industry: "Semiconductors / Software / Hardware / Systems",
    package: { stipend: "₹40,000 per month for B.Tech" },
    ppo: "BE FTE Year-1 earning potential ₹19.45 LPA",
    applicationStatus: "Not Applied",
    currentStage: "AMD registration deadline passed on 21-Aug-2026 at 7:00 AM without a completed registration/resume upload.",
    nextAction: "No current action unless RVITM/AMD reopens registration.",
    timeline: [],
    source: "RVITM Placement WhatsApp archive plus deadline verification",
  });

  upsert({
    slug: "dover-india",
    name: "Dover India",
    role: "Associate Software Engineer",
    industry: "Software Engineering / Industrial Technology",
    package: { stipend: "₹25,000 per month" },
    ppo: "₹12 LPA FTE + ₹2 lakh joining bonus",
    description: "2027 Graduate Engineer Trainee drive. Internship runs February–June 2027, followed by full-time joining on 1 July 2027 in Bengaluru.",
    requirements: ["B.E. CS/IS/IT/EEE/ECE", "All academics 80% or 8.0 CGPA and above", "No active backlogs", "Indian nationality"],
    applicationUrl: "https://docs.google.com/spreadsheets/d/1taTsQbOJP4AofvTMbE25ytkDSEfNaPLFy4qerfa98D0/edit",
    applicationStatus: "Not Applied",
    currentStage: "Dover registration deadline passed on 22-Aug-2026 at 9:00 AM. Final recheck of the official sheet still showed Gender blank for Puneet's row; resume entry was present, but registration remained incomplete.",
    nextAction: "No current action unless RVITM/Dover reopens registration or accepts a correction.",
    deadline: null,
    timeline: [],
    source: "Official Dover registration sheet rechecked at the 22-Aug-2026 9:00 AM deadline",
  });

  upsert({
    slug: "arctic-wolf-networks",
    name: "Arctic Wolf Networks",
    role: "Security / Software Intern (Internship + PPO)",
    industry: "Cybersecurity / Software Engineering",
    package: { stipend: "₹60,000 per month" },
    ppo: "₹22 LPA last-year CTC reference",
    description: "Jan–Jun 2027 internship in Bengaluru with possible full-time conversion based on performance and business requirements.",
    requirements: ["B.E. CSE/ISE/AIML/DS/CY/ECE/EEE/EIE/ETCE", "8.5+ CGPA", "No active backlogs", "7th semester"],
    applicationUrl: "https://docs.google.com/spreadsheets/d/1QDHZ0QB8zvpl5hq0r68cz7HF_4XNXjfPbTaGkLJ0OcQ/edit?usp=sharing",
    applicationStatus: "Not Shortlisted",
    currentStage: "RVITM placement leadership confirmed on 21-Aug-2026 that no student from RVITM was shortlisted by Arctic Wolf.",
    nextAction: "No action unless Arctic Wolf/RVITM publishes a revised shortlist or reopening.",
    timeline: [{ stage: "RVITM no-shortlist confirmation", date: "21 August 2026" }],
    source: "RVITM Placement WhatsApp dated 21-Aug-2026",
  });

  upsert({
    slug: "juspay",
    name: "Juspay Technologies",
    role: "Software Development Engineer (SDE)",
    industry: "Payments Technology / Backend / Distributed Systems / Infrastructure",
    package: { stipend: "₹40,000 per month" },
    ppo: "₹27 LPA CTC",
    description: "Juspay SDE campus opportunity spanning SDK/UI engineering, payment backend, data science and highly reliable distributed infrastructure.",
    requirements: ["RVITM eligible/registered students"],
    applicationUrl: "https://forms.gle/s1z8C3X2iuuNwQGe6",
    applicationStatus: "Applied",
    appliedDate: "2026-08-23",
    currentStage: "Registration is confirmed. Official RVITM email on 24-Aug-2026 confirms a mandatory Virtual Pre-Placement Talk on 25-Aug-2026 at 3:45 PM via Google Meet.",
    nextAction: "Join the Juspay Virtual PPT by 3:35 PM on 25-Aug-2026 at https://meet.google.com/zup-jrux-kvm. Attendance is mandatory for eligible/registered students. Keep stable internet, laptop/desktop and a quiet environment ready; monitor for subsequent assessment/hiring instructions.",
    deadline: null,
    timeline: [
      { stage: "Registration confirmed", date: "23 August 2026, 03:54:58; official registered-student list published 24 August" },
      { stage: "Registration extension/reopening", date: "24 August 2026 until 10:00 AM" },
      { stage: "Virtual Pre-Placement Talk", date: "25 August 2026, 3:45 PM IST; join by 3:35 PM; Google Meet zup-jrux-kvm" },
    ],
    skills: ["DSA", "Algorithms", "OOP", "DBMS/SQL", "Operating Systems", "Computer Networks", "System Design basics", "Backend Engineering", "Distributed Systems", "Reliability", "Performance"],
    source: "Official RVITM Placement email dated 24-Aug-2026, attached JusPay RV Group Students List Data.xlsx, RVITM placement WhatsApp and official Juspay Drive folder",
    notes: "Official RVITM email says the 25-Aug PPT is mandatory for all eligible/registered students and students should join at least 10 minutes early. Meet: https://meet.google.com/zup-jrux-kvm.",
  });

  return corrected;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];
  if (bySlug.get("idfc-first-bank")?.applicationStatus === "Not Selected") announcements.push({
    id: "idfc-application-closed-2026-08-22",
    title: "IDFC FIRST Bank application closed",
    message: "IDFC FIRST Bank directly confirmed on 22-Aug that it will not move forward with Puneet's Application Engineer application. The 10-Aug OA remains recorded as completed.",
    date: "2026-08-22",
    type: "info",
  });
  if (bySlug.get("juspay")?.applicationStatus === "Applied") announcements.push({
    id: "juspay-ppt-2026-08-25",
    title: "Juspay Virtual PPT confirmed",
    message: "Mandatory Juspay Virtual PPT is confirmed for 25-Aug at 3:45 PM. Registered students should join by 3:35 PM at meet.google.com/zup-jrux-kvm.",
    date: "2026-08-24",
    type: "info",
  });
  if (bySlug.get("dover-india")?.applicationStatus === "Not Applied") announcements.push({
    id: "dover-registration-closed-2026-08-22",
    title: "Dover registration closed incomplete",
    message: "Dover's 9:00 AM deadline passed with Puneet's Gender field still blank in the official registration sheet.",
    date: "2026-08-22",
    type: "info",
  });
  if (bySlug.get("arctic-wolf-networks")?.applicationStatus === "Not Shortlisted") announcements.push({
    id: "arctic-wolf-no-shortlist-2026-08-21",
    title: "Arctic Wolf: no RVITM shortlist",
    message: "RVITM placement leadership confirmed that no RVITM student was shortlisted by Arctic Wolf.",
    date: "2026-08-21",
    type: "info",
  });
  if (bySlug.get("eurofins")?.applicationStatus === "Not Shortlisted") announcements.push({ id: "eurofins-final-shortlist-2026-08-21", title: "Eurofins final shortlist published", message: "The final company shortlist for 9–10 Sep does not contain Puneet.", date: "2026-08-21", type: "info" });
  if (bySlug.get("sartorius-india")?.applicationStatus === "Not Selected") announcements.push({ id: "sartorius-final-result-2026-08-21", title: "Sartorius final result published", message: "Puneet is not among the final selects.", date: "2026-08-21", type: "info" });
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
      rawSourceFreshness: "Raw WhatsApp mirror is current through 24-Aug-2026 (latest commit 3b2ab78e… at 10:34 AM IST). Official Gmail is fresher for the Juspay PPT schedule: RVITM email at 1:03 PM confirms the 25-Aug 3:45 PM virtual PPT.",
      notice: "Placement records combine the primary tracker with authoritative overrides and newer official updates. IDFC OA was completed on 10-Aug and the Application Engineer application was closed by IDFC FIRST Bank on 22-Aug. Juspay registration is confirmed and a mandatory Virtual PPT is scheduled for 25-Aug at 3:45 PM via Google Meet. Dover closed incomplete at its 22-Aug deadline. InMobi is not applicable; Sama is Not Applied; ShareChat and Eurofins are Not Shortlisted; Sartorius is Not Selected; AMD is Not Applied; Pure Storage/EverPure and Cargill remain confirmed; BitGo remains an upcoming exclusive RVITM drive with details TBD. Google and Flipkart remain excluded unless a fresh official notice appears.",
    },
    announcements: buildAnnouncements(companies),
    companies,
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
