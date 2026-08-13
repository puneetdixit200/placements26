const SOURCE_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/placements.json";
const OVERRIDES_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/confirmed-overrides.json";

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

function applyConfirmedState(sourceCompanies, overrideData) {
  const companies = new Map(
    (sourceCompanies || []).map((company) => [company.slug, supplementSartorius(company)]),
  );

  for (const override of overrideData.overrides || []) {
    const existing = companies.get(override.slug) || { slug: override.slug };
    const merged = { ...existing, ...override };

    // These states are explicitly non-actionable for Puneet. Keep historical role/company
    // information, but do not expose superseded personal deadlines or interview timelines.
    if (override.applicationStatus === "Not Applicable" || override.applicationStatus === "Not Applied") {
      merged.deadline = null;
      merged.timeline = [];
    }

    companies.set(override.slug, merged);
  }

  for (const addition of overrideData.additions || []) {
    const existing = companies.get(addition.slug);
    companies.set(
      addition.slug,
      existing ? { ...existing, ...addition } : normalizeAddition(addition),
    );
  }

  const exclusions = new Set((overrideData.exclusions || []).map((name) => name.toLowerCase()));
  return Array.from(companies.values()).filter((company) => {
    const name = (company.name || "").toLowerCase();
    const slug = (company.slug || "").toLowerCase();
    return !Array.from(exclusions).some((excluded) => name.includes(excluded) || slug.includes(excluded));
  });
}

export async function GET() {
  const [sourceResponse, overrideResponse] = await Promise.all([
    fetch(SOURCE_URL, { next: { revalidate: 60 }, headers: { Accept: "application/json" } }),
    fetch(OVERRIDES_URL, { next: { revalidate: 60 }, headers: { Accept: "application/json" } }),
  ]);

  if (!sourceResponse.ok) {
    return Response.json(
      { error: "Unable to load placement data", status: sourceResponse.status },
      { status: 502 },
    );
  }

  const sourceData = await sourceResponse.json();
  const overrideData = overrideResponse.ok
    ? await overrideResponse.json()
    : { overrides: [], additions: [], exclusions: ["Google", "Flipkart"] };

  const companies = applyConfirmedState(sourceData.companies || [], overrideData);
  const overrideUpdated = overrideData.meta?.lastUpdated || sourceData.meta?.lastUpdated;
  const rawDataThrough = overrideUpdated?.slice(0, 10) || sourceData.meta?.rawDataThrough;

  return Response.json(
    {
      ...sourceData,
      meta: {
        ...sourceData.meta,
        lastUpdated: overrideUpdated,
        rawDataThrough,
        notice:
          "Placement records combine the primary tracker with authoritative confirmed overrides. IDFC OA remains completed on 10-Aug-2026; InMobi is not applicable because RVITM was not considered; Sama is Not Applied. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: [
        {
          id: "confirmed-state-sync-2026-08-13",
          title: "Confirmed placement state synced",
          message:
            "Authoritative corrections are active: IDFC OA completed; InMobi not applicable to RVITM; Sama not applied. Tekion, Red Hat and BitGo are recorded as applied and awaiting next-stage communication.",
          date: "2026-08-13",
          type: "info",
        },
        ...(sourceData.announcements || []).filter(
          (announcement) => announcement.id !== "confirmed-state-sync-2026-08-13",
        ),
      ],
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
