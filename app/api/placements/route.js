import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-21T07:05:00+05:30";

function supplementSartorius(company) {
  if (company.slug !== "sartorius-india" || company.package?.stipend) return company;
  return {
    ...company,
    industry: "Biopharma technology internship",
    package: { stipend: "₹20,000 per month" },
    ppo: "Full-time opportunity based on individual performance and business requirements",
    description:
      "Sartorius India offered a 6–9 month technology internship. The latest update announced the technical-interview shortlist; interview dates and timings are pending.",
    roles: ["6–9 Month Internship"],
    eligibility: ["B.Tech AI & ML", "B.Tech IT", "B.E CSE", "B.E ECE"],
    timeline: [
      { stage: "Technical interview shortlist announced", date: "7 August 2026" },
      { stage: "Technical interview", date: "Date/time TBD based on panel availability" },
      { stage: "Internship start", date: "February 2027" },
    ],
    source: "Official RVITM placement email thread updated 7 August 2026",
  };
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
  const companies = new Map(
    (sourceCompanies || []).map((company) => [company.slug, supplementSartorius(company)]),
  );

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
    companies.set(
      addition.slug,
      existing ? { ...existing, ...addition } : normalizeAddition(addition),
    );
  }

  const exclusions = new Set((overrides.exclusions || []).map((name) => name.toLowerCase()));
  return Array.from(companies.values()).filter((company) => {
    const name = (company.name || "").toLowerCase();
    const slug = (company.slug || "").toLowerCase();
    return !Array.from(exclusions).some(
      (excluded) => name.includes(excluded) || slug.includes(excluded),
    );
  });
}

function applyRuntimeCorrections(sourceCompanies) {
  const corrected = sourceCompanies.map((company) => {
    if (company.slug === "evertz-india") {
      return {
        ...company,
        currentStage:
          "Evertz online assessment was held on 19-Aug-2026. Official RVITM email on 20-Aug published the absentee blacklist; Puneet Dixit is not among the listed absentees. Personal result/next-round status is not yet announced.",
        nextAction:
          "Wait for Evertz result / next-round communication. No blacklisting action is indicated for Puneet based on the published absentee list.",
        timeline: [
          ...(company.timeline || []).filter((item) => item.stage !== "Online Test"),
          { stage: "Online Test held", date: "19 August 2026, 1:30 PM IST at RVITM campus" },
          { stage: "Absentee blacklist published", date: "20 August 2026; Puneet not listed" },
        ],
        notes:
          "Official RVITM Placement email dated 20-Aug-2026 blacklists students absent from the 19-Aug Evertz OA. Puneet Dixit is not in the published blacklist. This supports a non-absent post-test state, but does not by itself confirm test score, shortlist, or next round.",
      };
    }

    if (company.slug === "relyntis-software") {
      return {
        ...company,
        applicationStatus: "Need Info",
        currentStage:
          "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence currently confirms whether Puneet submitted the RELYNTIS form.",
        nextAction:
          "No active deadline. Treat personal application status as unconfirmed unless a submission confirmation, shortlist, or newer placement update appears.",
        notes:
          "Official RVITM RELYNTIS opportunity closed 19-Aug-2026 at 5:00 PM. No application confirmation was found in connected Gmail/Drive evidence, so the prior Considering state is now replaced by Need Info rather than assumed Applied or Not Applied.",
      };
    }

    if (company.slug === "eurofins") {
      return {
        ...company,
        applicationStatus: "Applied",
        appliedDate: "2026-08-10",
        currentStage:
          "Official Eurofins registration sheet confirms Puneet Dixit / 1RF23CS119 is already registered. Eurofins will conduct a 2-day on-campus Associate Software Engineer recruitment process during 9–11 Sep 2026; exact two days/reporting schedule are still TBD.",
        nextAction:
          "No re-registration needed. Prepare programming/OOP, SQL/DBMS, REST APIs, debugging, SDLC and .NET/C# basics; monitor RVITM for exact reporting dates/times within the 9–11 Sep window.",
        timeline: [
          { stage: "Registration confirmed", date: "Already registered before the reopened 20-Aug deadline" },
          { stage: "On-campus recruitment window", date: "9–11 September 2026; 2-day process, exact days/times TBD" },
        ],
        notes:
          "Newer RVITM Placement WhatsApp update dated 20-Aug-2026 says Eurofins will visit RVITM during 9–11 Sep for a 2-day on-campus process and reopened registration until EOD 20-Aug for students who missed the earlier window. The official Eurofins registration sheet already contains Puneet Dixit / 1RF23CS119, so no re-registration is needed.",
      };
    }

    if (company.slug === "cargill-dtd") {
      return {
        ...company,
        notes:
          "Both mandatory Cargill registrations are complete and Cargill directly acknowledged the Software Engineer Intern application. A newer RVITM Placement WhatsApp update on 20-Aug-2026 extended the registration deadline to 25-Aug; this does not require action because Puneet is already Applied. Confirmed schedule remains PPT 26-Aug 11:00 AM, Online Test 31-Aug 2:00 PM, and Interviews 11-Sep 10:00 AM if progressed.",
      };
    }

    return company;
  });

  if (!corrected.some((company) => company.slug === "amd-india")) {
    corrected.push(
      normalizeAddition({
        slug: "amd-india",
        name: "AMD India Pvt Ltd",
        role: "Co-Op / Internship (with PPO) — Software/Hardware domain allocation",
        industry: "Semiconductors / Software / Hardware / Systems",
        package: { stipend: "₹40,000 per month for B.Tech" },
        ppo: "BE FTE Year-1 earning potential ₹19.45 LPA",
        description:
          "Six-month Jan–Jun 2027 fully offline co-op, five days per week in office. Multiple domain roles are grouped under the drive and candidates are evaluated/allocated based on fitment.",
        requirements: [
          "2027 BE CS/EC clusters including CSE",
          "10th and 12th: 70% and above",
          "UG: 7.5 CGPA and above",
          "No active backlogs",
          "Eligible to work in India; no visa sponsorship",
        ],
        applicationUrl:
          "https://docs.google.com/spreadsheets/d/1Ffvn1TI6f6Z_o8QFyqUFA4h5vFAldff_5V_653TX59I/edit?usp=sharing",
        documentsFolderUrl:
          "https://drive.google.com/drive/folders/1JQ-NOvPjVnHdHf5nVi41s-nwke0aM01Z?usp=sharing",
        applicationStatus: "Not Applied",
        currentStage:
          "AMD registration deadline passed on 21-Aug-2026 at 7:00 AM. The current official AMD sheet no longer returns Puneet / 1RF23CS119, and no Puneet-named resume is present in the required AMD upload folder. The earlier row was incomplete before the deadline.",
        nextAction:
          "No current action unless RVITM/AMD reopens registration or sends a direct shortlist/exception notice.",
        deadline: null,
        timeline: [],
        skills: [
          "DSA",
          "C/C++",
          "Python",
          "OOP",
          "Operating Systems",
          "Computer Architecture",
          "Systems fundamentals",
          "Role-specific software/hardware skills",
        ],
        source:
          "RVITM Placement WhatsApp archive plus deadline verification against the official AMD registration sheet and resume-upload folder",
        notes:
          "Deadline verification on 21-Aug-2026: the earlier AMD row had mandatory fields blank. After the 7:00 AM deadline, the official AMD sheet no longer contains Puneet / 1RF23CS119, and the required resume folder still has no Puneet-named upload. Treat the current drive as Not Applied/incomplete unless a newer official exception or shortlist appears. B.Tech stipend ₹40,000/month; BE FTE Year-1 earning potential ₹19.45 LPA; interviews are scheduled for 28-Aug for shortlisted candidates.",
      }),
    );
  }

  return corrected;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];

  const amd = bySlug.get("amd-india");
  if (amd?.applicationStatus === "Not Applied") {
    announcements.push({
      id: "amd-deadline-closed-2026-08-21",
      title: "AMD registration closed incomplete",
      message:
        "The AMD deadline passed at 7:00 AM on 21-Aug. The final verification found no Puneet/1RF23CS119 row in the current sheet and no Puneet-named resume in the required upload folder, so this drive is marked Not Applied unless an official exception appears.",
      date: "2026-08-21",
      type: "warning",
    });
  }

  const eurofins = bySlug.get("eurofins");
  if (eurofins?.applicationStatus === "Applied") {
    announcements.push({
      id: "eurofins-campus-window-2026-08-20",
      title: "Eurofins registration confirmed",
      message:
        "Your name is already present in the official Eurofins registration sheet. The 2-day on-campus process will happen within 9–11 Sep; exact reporting schedule is TBD.",
      date: "2026-08-20",
      type: "info",
    });
  }

  const evertz = bySlug.get("evertz-india");
  if (evertz) {
    announcements.push({
      id: "evertz-post-oa-2026-08-20",
      title: "Evertz OA absentee notice published",
      message:
        "RVITM published the students blacklisted for absence from the 19-Aug Evertz OA. Puneet Dixit is not on the published absentee list; result and next-round status are still pending.",
      date: "2026-08-20",
      type: "info",
    });
  }

  const cargill = bySlug.get("cargill-dtd");
  if (cargill?.applicationStatus === "Applied") {
    announcements.push({
      id: "cargill-complete-2026-08-18",
      title: "Cargill registration complete",
      message:
        "Both mandatory Cargill registrations are complete. The reopened registration deadline was extended to 25-Aug, but no further application action is needed for you; next stage is the 26-Aug PPT.",
      date: "2026-08-20",
      type: "info",
    });
  }

  const bitgo = bySlug.get("bitgo");
  if (bitgo?.applicationStatus === "Need Info") {
    announcements.push({
      id: "bitgo-exclusive-rvitm-2026-08-17",
      title: "BitGo exclusive RVITM drive announced",
      message:
        "A newer RVITM placement update says BitGo will come to RVITM exclusively for RVITM students. Registration, eligibility and schedule are still TBD.",
      date: "2026-08-17",
      type: "info",
    });
  }

  const pure = bySlug.get("pure-storage-everpure");
  if (pure?.applicationStatus === "Applied") {
    announcements.push({
      id: "pure-storage-registration-2026-08-17",
      title: "Pure Storage / EverPure registration confirmed",
      message:
        "The official RVITM registration sheet contains Puneet Dixit (1RF23CS119). The online assessment is scheduled for 20-Aug; exact time is still TBD.",
      date: "2026-08-20",
      type: "info",
    });
  }

  const sharechat = bySlug.get("sharechat");
  if (sharechat?.applicationStatus === "Not Shortlisted") {
    announcements.push({
      id: "sharechat-result-2026-08-17",
      title: "ShareChat OA result updated",
      message:
        "RVITM published the students who cleared the ShareChat online assessment. Puneet Dixit is not on the published list, so the current ShareChat process is closed for now.",
      date: "2026-08-17",
      type: "info",
    });
  }

  return [
    ...announcements,
    ...(sourceData.announcements || []).filter(
      (announcement) => !announcements.some((item) => item.id === announcement.id),
    ),
  ];
}

export async function GET() {
  const companies = applyRuntimeCorrections(
    applyConfirmedState(sourceData.companies || [], overrideData),
  );
  const meta = overrideData.meta || {};

  return Response.json(
    {
      ...sourceData,
      meta: {
        ...sourceData.meta,
        lastUpdated: RUNTIME_LAST_UPDATED,
        rawDataThrough: rawSourceMeta.rawDataThrough || meta.rawDataThrough || sourceData.meta?.rawDataThrough,
        rawSourceLatestCommit: rawSourceMeta.rawSourceLatestCommit || meta.rawSourceLatestCommit,
        rawSourceLatestCommitAt: rawSourceMeta.rawSourceLatestCommitAt || meta.rawSourceLatestCommitAt,
        rawSourceFreshness: rawSourceMeta.rawSourceFreshness || meta.rawSourceFreshness,
        notice:
          "Placement records combine the primary tracker with authoritative confirmed overrides and official placement updates. IDFC OA remains completed; InMobi is not applicable to RVITM; Sama is Not Applied; ShareChat current drive is closed; Pure Storage / EverPure and Cargill registrations are confirmed; BitGo has reopened as an upcoming exclusive RVITM drive with details TBD. Evertz OA has concluded and Puneet is not on the published absentee blacklist. AMD current drive is marked Not Applied after the 21-Aug 7:00 AM deadline verification found the earlier incomplete registration no longer present and no required resume upload. Eurofins registration is confirmed with a 9–11 Sep campus window. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: buildAnnouncements(companies),
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}