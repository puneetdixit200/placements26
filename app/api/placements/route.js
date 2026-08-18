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

  const pureStorage = companies.get("pure-storage-everpure");
  if (pureStorage) {
    companies.set("pure-storage-everpure", {
      ...pureStorage,
      applicationStatus: "Applied",
      appliedDate: "2026-08-17",
      currentStage:
        "Registration confirmed in the official RVITM Pure Storage / EverPure sheet. Online Assessment is scheduled for 20-Aug-2026; exact time is TBD.",
      nextAction:
        "Prepare for the 20-Aug online assessment and monitor RVITM/company communication for exact test time and instructions.",
      timeline: [
        { stage: "Registration confirmed", date: "17 August 2026" },
        { stage: "Online Assessment", date: "20 August 2026; time TBD" },
        { stage: "Interviews", date: "24 August 2026; conditional on OA progression" },
      ],
      source: "Official RVITM Pure Storage / EverPure registration sheet + placement WhatsApp",
      notes:
        "Puneet Dixit (1RF23CS119) appears in the official registration sheet at row 64. This supersedes the earlier Considering state.",
    });
  }

  const bitGo = companies.get("bitgo");
  if (bitGo) {
    companies.set("bitgo", {
      ...bitGo,
      applicationStatus: "Need Info",
      currentStage:
        "RVITM placement update on 17-Aug-2026 says BitGo will come to RVITM exclusively for RVITM students. Exact registration, OA/interview dates and process details are still TBD.",
      nextAction:
        "Watch for the official BitGo exclusive-drive registration link, eligibility and schedule. Do not assume the older 12-Aug application automatically registers you for the new drive.",
      timeline: [],
      source: "Private placement-raw-data WhatsApp archive / RVITM Placement",
      notes:
        "This supersedes the 14-Aug batch-level non-consideration. The earlier 12-Aug application list remains historical evidence. No newer BitGo email was found in connected Gmail on 18-Aug morning.",
    });
  }

  companies.set("cargill-dtd", {
    slug: "cargill-dtd",
    name: "Cargill",
    shortName: "CA",
    companyUrl: null,
    industry: "Digital Technology & Data / Software Engineering",
    package: { stipend: "₹42,000 per month" },
    ppo: "₹15–16 LPA + variables, performance based",
    description:
      "Six-month Digital Technology & Data internship in Bengaluru with potential conversion to a full-time Software Engineer role.",
    roles: ["DT&D Internship Program – Software Engineer pathway"],
    requirements: [
      "2027 B.Tech CSE/ISE and allied courses",
      "CGPA 8.0 and above",
      "No active backlogs",
      "Both RVITM T&P and Cargill career-site registrations are mandatory",
    ],
    eligibility: [],
    skills: ["DSA", "OOP", "DBMS/SQL", "Operating Systems", "Computer Networks", "APIs", "Software Engineering"],
    deadline: "19 August 2026, 9:00 AM for RVITM T&P registration; Cargill career-site deadline 19 August 2026",
    applicationUrl:
      "https://career2.successfactors.eu/sfcareer/jobreqcareerpvt?jobId=332332&company=cargill&st=BC43C540E2084C53E23AE11EAC4C6D70261765C4",
    jdUrl: null,
    jdLinks: [
      {
        label: "RVITM T&P registration",
        url: "https://docs.google.com/spreadsheets/d/1OGll8eEKk9ZU2Vb65EFJihvuz7Nco8mOc1Fg3T_7dmo/edit?usp=sharing",
      },
      {
        label: "Cargill career site",
        url: "https://career2.successfactors.eu/sfcareer/jobreqcareerpvt?jobId=332332&company=cargill&st=BC43C540E2084C53E23AE11EAC4C6D70261765C4",
      },
    ],
    timeline: [
      { stage: "Both registrations due", date: "19 August 2026; RVITM deadline 9:00 AM" },
      { stage: "Pre-Placement Talk", date: "26 August 2026, 11:00 AM" },
      { stage: "Online Test", date: "31 August 2026, 2:00 PM" },
      { stage: "Interviews", date: "11 September 2026, 10:00 AM" },
      { stage: "Internship start", date: "4 January 2027" },
    ],
    source: "Official RVITM Placement email + official RVITM Cargill registration sheet",
    role: "DT&D Internship Program – Software Engineer pathway",
    applicationStatus: "Applying",
    currentStage:
      "RVITM registration sheet contains Puneet Dixit / 1RF23CS119, but the mandatory 'Applied on Cargill Career Portal? (Yes/No)' field is blank as of 18-Aug-2026 afternoon. Both registrations are mandatory, so the application is incomplete.",
    nextAction:
      "Complete the Cargill career-site application and ensure the RVITM sheet reflects portal completion before 19-Aug-2026 at 9:00 AM, then prepare for the 31-Aug online test.",
    notes:
      "Location: Cessna Business Park, Kadubeesanahalli, Bengaluru. Internship duration: 6 months. Open positions: 3. Official email states Cargill converted 100% of students from the last two internship cohorts into full-time offers. RVITM sheet row for 1RF23CS119 currently has the Cargill career-portal confirmation blank.",
  });

  const exclusions = new Set((overrides.exclusions || []).map((name) => name.toLowerCase()));
  return Array.from(companies.values()).filter((company) => {
    const name = (company.name || "").toLowerCase();
    const slug = (company.slug || "").toLowerCase();
    return !Array.from(exclusions).some((excluded) => name.includes(excluded) || slug.includes(excluded));
  });
}

export async function GET() {
  const companies = applyConfirmedState(sourceData.companies || [], overrideData);
  const overrideUpdated = "2026-08-18T14:58:00+05:30";
  const rawDataThrough = "2026-08-18";

  return Response.json(
    {
      ...sourceData,
      meta: {
        ...sourceData.meta,
        lastUpdated: overrideUpdated,
        rawDataThrough,
        rawSourceLatestCommit: "d1577db1f4bc7122befca254d0bcbcf962806eaa",
        rawSourceLatestCommitAt: "2026-08-18T04:47:24+05:30",
        rawSourceFreshness:
          "aging: collector last synced at 04:47 IST on 18-Aug; official Gmail has newer placement activity at 10:57 IST, so Gmail is the fresher source for this run",
        notice:
          "Placement records combine the primary tracker with authoritative confirmed overrides and official email updates. IDFC OA remains completed on 10-Aug-2026; InMobi is not applicable to RVITM; Sama is Not Applied; ShareChat current drive is closed; Pure Storage / EverPure registration is confirmed; BitGo has reopened as an upcoming exclusive RVITM drive with details TBD; Cargill DT&D registration is in progress but the mandatory Cargill career-portal confirmation is still missing. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: [
        {
          id: "cargill-dtd-2026-08-18",
          title: "Cargill registration incomplete",
          message:
            "Your RVITM Cargill row exists, but the mandatory 'Applied on Cargill Career Portal?' field is still blank. Complete the Cargill career-site application and ensure the sheet reflects completion before the RVITM deadline of 19-Aug-2026 at 9:00 AM.",
          date: "2026-08-18",
          type: "urgent",
        },
        {
          id: "bitgo-exclusive-rvitm-2026-08-17",
          title: "BitGo exclusive RVITM drive announced",
          message:
            "A newer RVITM placement update says BitGo will come to RVITM exclusively for RVITM students. Registration, eligibility and schedule are still TBD, so the status is Need Info rather than Not Applicable.",
          date: "2026-08-17",
          type: "info",
        },
        {
          id: "pure-storage-registration-2026-08-17",
          title: "Pure Storage / EverPure registration confirmed",
          message:
            "The official RVITM registration sheet contains Puneet Dixit (1RF23CS119). The online assessment is scheduled for 20-Aug-2026; exact time is TBD. Interviews are scheduled for 24-Aug subject to OA progression.",
          date: "2026-08-17",
          type: "info",
        },
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
            "Authoritative corrections are active: IDFC OA completed; InMobi is not applicable to RVITM; Sama not applied. Tekion remains unresolved, Red Hat remains awaiting next-stage communication, and BitGo now has an exclusive RVITM drive announced with details TBD.",
          date: "2026-08-15",
          type: "info",
        },
        ...(sourceData.announcements || []).filter(
          (announcement) =>
            announcement.id !== "confirmed-state-sync-2026-08-13" &&
            announcement.id !== "confirmed-state-sync-2026-08-15" &&
            announcement.id !== "sharechat-result-2026-08-17" &&
            announcement.id !== "pure-storage-registration-2026-08-17" &&
            announcement.id !== "bitgo-exclusive-rvitm-2026-08-17" &&
            announcement.id !== "cargill-dtd-2026-08-18",
        ),
      ],
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
