import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";

function supplementSartorius(company) {
  if (company.slug !== "sartorius-india" || company.package?.stipend) return company;
  return {
    ...company,
    industry: "Biopharma technology internship",
    package: { stipend: "₹20,000 per month" },
    ppo: "Full-time opportunity based on individual performance and business requirements",
    description: "Sartorius India offered a 6–9 month technology internship. The latest update announced the technical-interview shortlist; interview dates and timings are pending.",
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

  // Newer RVITM placement communication on 17-Aug-2026 published the students
  // who cleared the ShareChat OA. Puneet Dixit is not on the published list,
  // so older conditional ShareChat placeholders are superseded for this drive.
  const shareChat = companies.get("sharechat");
  if (shareChat) {
    companies.set("sharechat", {
      ...shareChat,
      applicationStatus: "Not Shortlisted",
      currentStage:
        "RVITM published the ShareChat OA-cleared list on 17-Aug-2026. Puneet Dixit is not on the published cleared list.",
      nextAction:
        "No further ShareChat action for the current drive unless a newer official correction or additional shortlist is published.",
      timeline: [],
      notes:
        "RVITM Placement WhatsApp on 17-Aug-2026 published 16 students who cleared the ShareChat online assessment; Puneet Dixit is not among them. This supersedes the earlier unconfirmed shortlist state.",
    });
  }

  const exclusions = new Set((overrides.exclusions || []).map((name) => name.toLowerCase()));
  return Array.from(companies.values()).filter((company) => {
    const name = (company.name || "").toLowerCase();
    const slug = (company.slug || "").toLowerCase();
    return !Array.from(exclusions).some((excluded) => name.includes(excluded) || slug.includes(excluded));
  });
}

export async function GET() {
  const companies = applyConfirmedState(sourceData.companies || [], overrideData);
  const overrideUpdated = "2026-08-17T19:08:00+05:30";
  const rawDataThrough = overrideData.meta?.rawDataThrough || sourceData.meta?.rawDataThrough || null;

  return Response.json(
    {
      ...sourceData,
      meta: {
        ...sourceData.meta,
        lastUpdated: overrideUpdated,
        rawDataThrough,
        rawSourceLatestCommit: overrideData.meta?.rawSourceLatestCommit || null,
        rawSourceLatestCommitAt: overrideData.meta?.rawSourceLatestCommitAt || null,
        rawSourceFreshness: overrideData.meta?.rawSourceFreshness || null,
        notice:
          "Placement records combine the primary tracker with authoritative confirmed overrides. IDFC OA remains completed on 10-Aug-2026; InMobi and BitGo's current drives are not applicable to RVITM; Sama is Not Applied; ShareChat current drive is closed after the 17-Aug OA-cleared list. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: [
        {
          id: "sharechat-result-2026-08-17",
          title: "ShareChat OA result updated",
          message:
            "RVITM published the students who cleared the ShareChat online assessment on 17-Aug-2026. Puneet Dixit is not on the published list, so the conditional 18-Aug OA and 19-Aug interview placeholders are no longer active.",
          date: "2026-08-17",
          type: "info",
        },
        {
          id: "confirmed-state-sync-2026-08-15",
          title: "Confirmed placement state synced",
          message:
            "Authoritative corrections are active: IDFC OA completed; InMobi and BitGo current drives are not applicable to RVITM; Sama not applied. Tekion and Red Hat remain awaiting next-stage communication.",
          date: "2026-08-15",
          type: "info",
        },
        ...(sourceData.announcements || []).filter(
          (announcement) =>
            announcement.id !== "confirmed-state-sync-2026-08-13" &&
            announcement.id !== "confirmed-state-sync-2026-08-15" &&
            announcement.id !== "sharechat-result-2026-08-17",
        ),
      ],
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
