import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-24T21:02:00+05:30";

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

  upsert({
    slug: "idfc-first-bank",
    applicationStatus: "Not Selected",
    currentStage: "OA completed on 10-Aug-2026. IDFC FIRST Bank sent a direct update on 22-Aug-2026 confirming they will not move forward with Puneet's Application Engineer application.",
    nextAction: "No further action for this application unless a new IDFC role opens.",
    deadline: null,
    timeline: [
      { stage: "OA completed", date: "10 August 2026" },
      { stage: "Application closed by IDFC FIRST Bank", date: "22 August 2026" },
    ],
  });

  upsert({
    slug: "evertz-india",
    currentStage: "Evertz online assessment was held on 19-Aug-2026. The official 20-Aug absentee blacklist did not include Puneet; personal result/next-round status is still pending.",
    nextAction: "Wait for Evertz result / next-round communication.",
  });

  upsert({
    slug: "relyntis-software",
    applicationStatus: "Need Info",
    currentStage: "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence confirms whether Puneet submitted the RELYNTIS form.",
    nextAction: "No active deadline; treat personal application status as unconfirmed unless newer evidence appears.",
  });

  upsert({
    slug: "eurofins",
    applicationStatus: "Not Shortlisted",
    currentStage: "Official Eurofins final shortlist for the 9–10 Sep process was published on 21-Aug-2026; Puneet is not on it.",
    nextAction: "No Eurofins action unless a corrected/additional shortlist is published.",
    timeline: [{ stage: "Final shortlist published", date: "21 August 2026; Puneet not listed" }],
  });

  upsert({
    slug: "sartorius-india",
    package: { stipend: "₹20,000 per month" },
    applicationStatus: "Not Selected",
    currentStage: "Sartorius Stedim India published the final LCM & Quality Team internship result on 21-Aug-2026; Puneet is not among the final selects.",
    nextAction: "No Sartorius action unless a newer official correction/additional selection appears.",
    timeline: [{ stage: "Final selection published", date: "21 August 2026; Puneet not selected" }],
  });

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
    deadline: null,
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
    applicationStatus: "Not Applied",
    currentStage: "Dover registration deadline passed on 22-Aug-2026 at 9:00 AM with Puneet's Gender field still blank; resume entry was present but registration remained incomplete.",
    nextAction: "No current action unless RVITM/Dover reopens registration or accepts a correction.",
    deadline: null,
    timeline: [],
    source: "Official Dover registration sheet",
  });

  upsert({
    slug: "arctic-wolf-networks",
    name: "Arctic Wolf Networks",
    role: "Security / Software Intern (Internship + PPO)",
    industry: "Cybersecurity / Software Engineering",
    package: { stipend: "₹60,000 per month" },
    ppo: "₹22 LPA last-year CTC reference",
    applicationStatus: "Not Shortlisted",
    currentStage: "RVITM placement leadership confirmed on 21-Aug-2026 that no student from RVITM was shortlisted by Arctic Wolf.",
    nextAction: "No action unless a revised shortlist/reopening appears.",
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
    applicationStatus: "Applied",
    appliedDate: "2026-08-23",
    currentStage: "Registration is confirmed. Mandatory Virtual PPT is 25-Aug-2026 at 3:45 PM (join by 3:35 PM). Campus hiring is 27-Aug-2026 at RVITM Auditorium, reporting 9:30 AM; every round is eliminatory.",
    nextAction: "Attend the mandatory 25-Aug PPT, then report to RVITM Auditorium by 9:30 AM on 27-Aug with college ID, updated resume, fully charged laptop and black pen.",
    deadline: null,
    timeline: [
      { stage: "Registration confirmed", date: "23 August 2026" },
      { stage: "Virtual Pre-Placement Talk", date: "25 August 2026, 3:45 PM IST; join by 3:35 PM" },
      { stage: "Campus Hiring Process", date: "27 August 2026, report 9:30 AM at RVITM Auditorium" },
    ],
    source: "Official RVITM Placement email and WhatsApp dated 24-Aug-2026",
  });

  upsert({
    slug: "qnance-technologies",
    name: "Qnance Technologies LLP",
    role: "Software Developer Intern",
    industry: "Software Engineering / Product Development",
    package: { stipend: "₹70,000 per month" },
    ppo: "> ₹12 LPA FTE, performance-based conversion",
    description: "2027 RV placement drive for a Bangalore-based Software Developer Intern role with internship-to-FTE conversion based on performance.",
    requirements: ["BE CS & EC cluster", "8.0 CGPA & above", "No current backlogs"],
    applicationUrl: "https://docs.google.com/spreadsheets/d/1YDv76kXupmefO6V77VGUER_B06uYK1oY0pe8PRUYZAg/edit?usp=sharing",
    applicationStatus: "Applying",
    currentStage: "Official Qnance registration sheet already contains Puneet / 1RF23CS119 with 8.43 CGPA, but Gender and Resume Link are blank. Interested-student list is due before 8:00 AM on 25-Aug-2026.",
    nextAction: "Complete Gender and Resume Link in the Qnance sheet before 8:00 AM on 25-Aug. Treat later stages as conditional until registration is complete.",
    deadline: "25 August 2026, before 8:00 AM IST",
    timeline: [
      { stage: "Registration deadline", date: "25 August 2026, before 8:00 AM" },
      { stage: "PPT + Online Assessment", date: "4 September 2026; time TBD" },
      { stage: "Interviews", date: "5–7 September 2026; personal slot TBD" },
    ],
    skills: ["DSA", "Coding", "OOP", "DBMS/SQL", "Operating Systems", "Computer Networks", "Debugging"],
    source: "RVITM Placement WhatsApp dated 24-Aug-2026 plus official registration sheet",
    notes: "Puneet is academically eligible based on the official row showing CSE and 8.43 CGPA, but the registration is still incomplete as of the evening of 24-Aug.",
  });

  upsert({
    slug: "kinaxis",
    name: "Kinaxis",
    role: "Associate Consultant",
    industry: "Supply Chain Software / Enterprise SaaS / Consulting",
    package: { stipend: "₹35,000 per month" },
    ppo: "₹8 LPA base FTE; 6-month internship + FTE conversion LOI",
    description: "Associate Consultant campus opportunity in supply-chain software, with Chennai/Bangalore locations and a hybrid hiring process.",
    requirements: ["BE CS, DS, IS, AIML, CY, Mech & IEM", "7.5 CGPA & above", "No current backlogs"],
    applicationUrl: "https://docs.google.com/spreadsheets/d/1puYcMXWtwps4UbGe48pcouIfJR2p2jzFEK1pg4aaoDA/edit?usp=sharing",
    applicationStatus: "Applying",
    currentStage: "Official Kinaxis registration sheet contains Puneet / 1RF23CS119 with CSE and 8.43 CGPA, but several required-looking fields remain blank and the required Name-RVITM.pdf resume upload is not verified. Deadline is before 9:00 AM on 25-Aug-2026.",
    nextAction: "Complete all blank Kinaxis fields and upload the required resume before 9:00 AM on 25-Aug. If accepted, OA is 26-Aug at 10:00 AM.",
    deadline: "25 August 2026, before 9:00 AM IST",
    timeline: [
      { stage: "Registration deadline", date: "25 August 2026, before 9:00 AM" },
      { stage: "Online Assessment", date: "26 August 2026, 10:00 AM" },
      { stage: "PPT", date: "28 August 2026, 11:00 AM at RVCE" },
      { stage: "Interviews", date: "28 August 2026, 12:00 PM onwards at RVCE" },
    ],
    skills: ["Problem Solving", "Analytical Reasoning", "SQL", "DBMS", "OOP", "CS Fundamentals", "Communication", "Consulting Mindset"],
    source: "RVITM Placement WhatsApp dated 24-Aug-2026 plus official registration sheet",
    notes: "Puneet is academically eligible based on CSE and 8.43 CGPA. Registration remains incomplete/unverified until the blank fields and resume upload are completed.",
  });

  return companies;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];
  if (bySlug.get("qnance-technologies")?.applicationStatus === "Applying") announcements.push({
    id: "qnance-registration-2026-08-25",
    title: "Qnance registration incomplete",
    message: "Qnance closes before 8:00 AM on 25-Aug. Puneet's row exists, but Gender and Resume Link are still blank.",
    date: "2026-08-24",
    type: "urgent",
  });
  if (bySlug.get("kinaxis")?.applicationStatus === "Applying") announcements.push({
    id: "kinaxis-registration-2026-08-25",
    title: "Kinaxis registration incomplete",
    message: "Kinaxis closes before 9:00 AM on 25-Aug. Puneet's row exists, but required fields/resume upload still need completion.",
    date: "2026-08-24",
    type: "urgent",
  });
  if (bySlug.get("juspay")?.applicationStatus === "Applied") announcements.push({
    id: "juspay-campus-hiring-2026-08-27",
    title: "Juspay campus hiring confirmed",
    message: "Mandatory Juspay Virtual PPT is 25-Aug at 3:45 PM. Campus hiring follows on 27-Aug at RVITM Auditorium with 9:30 AM reporting.",
    date: "2026-08-24",
    type: "info",
  });
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
      notice: "Placement records combine the primary tracker with authoritative overrides and newer official updates. Qnance and Kinaxis are newly active but Puneet's registration rows remain incomplete as of 24-Aug evening. Juspay registration is confirmed with mandatory PPT on 25-Aug and campus hiring on 27-Aug. IDFC is closed Not Selected; InMobi is Not Applicable; Sama is Not Applied; ShareChat/Eurofins are Not Shortlisted; Sartorius is Not Selected; AMD/Dover are Not Applied. Google and Flipkart remain excluded unless a fresh official notice appears.",
    },
    announcements: buildAnnouncements(companies),
    companies,
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
