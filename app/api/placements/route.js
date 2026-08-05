const SOURCE_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/placements.json";

function isStaleRemovedRecord(company) {
  if (company.slug === "flipkart") {
    return company.source === "Existing placement tracker" && !company.deadline;
  }

  if (company.slug === "google-india-apprenticeships") {
    return company.deadline === "3 August 2026"
      && company.timeline?.some((item) => item.stage === "Program start" && item.date === "March 2027");
  }

  return false;
}

export async function GET() {
  const response = await fetch(SOURCE_URL, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return Response.json(
      { error: "Unable to load placement data", status: response.status },
      { status: 502 },
    );
  }

  const sourceData = await response.json();
  const companies = (sourceData.companies || []).filter((company) => !isStaleRemovedRecord(company));
  const [latestAnnouncement, ...olderAnnouncements] = sourceData.announcements || [];

  const data = {
    ...sourceData,
    meta: {
      ...sourceData.meta,
      lastUpdated: "2026-08-05T23:01:00+05:30",
      notice: "Google and Flipkart have been removed because their current records are stale. A new official notice with fresh dates will make them eligible to appear again. Always verify the latest placement-cell communication before acting.",
    },
    announcements: [
      {
        ...(latestAnnouncement || {}),
        id: "current-records-2026-08-05",
        title: "Current placement records only",
        message: `${companies.length} active company records are shown. Google and Flipkart will return only after a fresh official placement notice is received.`,
        date: "2026-08-05",
        type: "info",
      },
      ...olderAnnouncements,
    ],
    companies,
  };

  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
