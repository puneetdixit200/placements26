import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-20T12:58:00+05:30";

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
  return sourceCompanies.map((company) => {
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

    return company;
  });
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];

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
        "The official RVITM Cargill sheet now shows your career-portal confirmation as Yes. Both mandatory registrations are complete; next confirmed stage is the 26-Aug PPT, followed by the 31-Aug online test.",
      date: "2026-08-18",
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
        "The official RVITM registration sheet contains Puneet Dixit (1RF23CS119). The online assessment is scheduled for 20-Aug; exact time is TBD.",
      date: "2026-08-17",
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
          "Placement records combine the primary tracker with authoritative confirmed overrides and official placement updates. IDFC OA remains completed; InMobi is not applicable to RVITM; Sama is Not Applied; ShareChat current drive is closed; Pure Storage / EverPure and Cargill registrations are confirmed; BitGo has reopened as an upcoming exclusive RVITM drive with details TBD. Evertz OA has concluded and Puneet is not on the published absentee blacklist. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: buildAnnouncements(companies),
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
