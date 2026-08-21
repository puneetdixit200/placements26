import sourceData from "../../../data/placements.json";
import overrideData from "../../../data/confirmed-overrides.json";
import rawSourceMeta from "../../../data/raw-source-meta.json";

const RUNTIME_LAST_UPDATED = "2026-08-21T17:00:00+05:30";

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
    if (company.slug === "evertz-india") {
      return {
        ...company,
        currentStage: "Evertz online assessment was held on 19-Aug-2026. Official RVITM email on 20-Aug published the absentee blacklist; Puneet Dixit is not among the listed absentees. Personal result/next-round status is not yet announced.",
        nextAction: "Wait for Evertz result / next-round communication. No blacklisting action is indicated for Puneet based on the published absentee list.",
        timeline: [
          ...(company.timeline || []).filter((item) => item.stage !== "Online Test"),
          { stage: "Online Test held", date: "19 August 2026, 1:30 PM IST at RVITM campus" },
          { stage: "Absentee blacklist published", date: "20 August 2026; Puneet not listed" },
        ],
        notes: "Official RVITM Placement email dated 20-Aug-2026 blacklists students absent from the 19-Aug Evertz OA. Puneet Dixit is not in the published blacklist. This supports a non-absent post-test state, but does not by itself confirm test score, shortlist, or next round.",
      };
    }

    if (company.slug === "relyntis-software") {
      return {
        ...company,
        applicationStatus: "Need Info",
        currentStage: "Registration deadline passed on 19-Aug-2026 at 5:00 PM. No connected-source evidence currently confirms whether Puneet submitted the RELYNTIS form.",
        nextAction: "No active deadline. Treat personal application status as unconfirmed unless a submission confirmation, shortlist, or newer placement update appears.",
        notes: "Official RVITM RELYNTIS opportunity closed 19-Aug-2026 at 5:00 PM. No application confirmation was found in connected Gmail/Drive evidence, so the prior Considering state is replaced by Need Info rather than assumed Applied or Not Applied.",
      };
    }

    if (company.slug === "eurofins") {
      return {
        ...company,
        applicationStatus: "Not Shortlisted",
        appliedDate: "2026-08-10",
        currentStage: "Official Eurofins final company shortlist was published by RVITM on 21-Aug-2026 for the 9–10 Sep campus process. The attached final shortlist does not contain Puneet Dixit / 1RF23CS119.",
        nextAction: "No Eurofins action unless RVITM/Eurofins publishes a corrected or additional shortlist.",
        timeline: [
          { stage: "Registration confirmed", date: "10 August 2026" },
          { stage: "Final shortlist published", date: "21 August 2026; Puneet not listed" },
          { stage: "Campus recruitment", date: "9–10 September 2026; not actionable for Puneet unless shortlist changes" },
        ],
        notes: "Official RVITM Placement email dated 21-Aug-2026 says Eurofins will visit RVITM on 9–10 Sep and attaches the final company shortlist after eligibility verification, including the 70%+ requirement. The attachment contains no Puneet Dixit / 1RF23CS119, superseding the prior Applied/registered state.",
      };
    }

    if (company.slug === "sartorius-india") {
      return {
        ...company,
        industry: "Biopharma technology internship",
        package: { stipend: "₹20,000 per month" },
        ppo: "Full-time opportunity based on individual performance and business requirements",
        applicationStatus: "Not Selected",
        currentStage: "Sartorius Stedim India published the final LCM & Quality Team internship result on 21-Aug-2026. Three RVITM students were selected; Puneet Dixit / 1RF23CS119 is not among them.",
        nextAction: "No Sartorius action unless a newer official correction or additional selection is published.",
        timeline: [
          { stage: "Technical interview process", date: "Completed before 21 August 2026" },
          { stage: "Final selection published", date: "21 August 2026; Puneet not selected" },
          { stage: "Internship joining", date: "Joining date/procedure to be communicated by Sartorius to selected students" },
        ],
        source: "Official RVITM Placement email dated 21-Aug-2026",
        notes: "Final selected students: Amruta Bhargav Krishnakumar (1RF23IS012), Nettem Nithya Sree (1RF23IS061), and Samanyu Manohar (1RF23CS144). Stipend ₹20,000/month plus cab facility; full-time opportunity is performance/business-requirement based.",
      };
    }

    if (company.slug === "cargill-dtd") {
      return {
        ...company,
        notes: "Both mandatory Cargill registrations are complete and Cargill directly acknowledged the Software Engineer Intern application. RVITM extended registration to 25-Aug; no further application action is needed for Puneet. Confirmed schedule remains PPT 26-Aug 11:00 AM, Online Test 31-Aug 2:00 PM, and Interviews 11-Sep 10:00 AM if progressed.",
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
        description: "Six-month Jan–Jun 2027 fully offline co-op, five days per week in office. Multiple domain roles are grouped under the drive and candidates are evaluated/allocated based on fitment.",
        requirements: ["2027 BE CS/EC clusters including CSE", "10th and 12th: 70% and above", "UG: 7.5 CGPA and above", "No active backlogs", "Eligible to work in India; no visa sponsorship"],
        applicationStatus: "Not Applied",
        currentStage: "AMD registration deadline passed on 21-Aug-2026 at 7:00 AM. The final verification found no Puneet / 1RF23CS119 row in the current official sheet and no Puneet-named resume in the required upload folder.",
        nextAction: "No current action unless RVITM/AMD reopens registration or sends a direct shortlist/exception notice.",
        deadline: null,
        timeline: [],
        source: "RVITM Placement WhatsApp archive plus deadline verification against official AMD registration sources",
      }),
    );
  }

  return corrected;
}

function buildAnnouncements(companies) {
  const bySlug = new Map(companies.map((company) => [company.slug, company]));
  const announcements = [];

  if (bySlug.get("eurofins")?.applicationStatus === "Not Shortlisted") {
    announcements.push({
      id: "eurofins-final-shortlist-2026-08-21",
      title: "Eurofins final shortlist published",
      message: "The final company shortlist for the 9–10 Sep RVITM process does not contain Puneet Dixit / 1RF23CS119, so Eurofins is now marked Not Shortlisted.",
      date: "2026-08-21",
      type: "info",
    });
  }

  if (bySlug.get("sartorius-india")?.applicationStatus === "Not Selected") {
    announcements.push({
      id: "sartorius-final-result-2026-08-21",
      title: "Sartorius final result published",
      message: "Sartorius selected three RVITM students for the LCM & Quality Team internship. Puneet is not among the final selects.",
      date: "2026-08-21",
      type: "info",
    });
  }

  if (bySlug.get("amd-india")?.applicationStatus === "Not Applied") {
    announcements.push({
      id: "amd-deadline-closed-2026-08-21",
      title: "AMD registration closed incomplete",
      message: "The AMD deadline passed at 7:00 AM on 21-Aug. Final verification found no completed Puneet/1RF23CS119 registration and no required resume upload, so the drive is marked Not Applied.",
      date: "2026-08-21",
      type: "warning",
    });
  }

  if (bySlug.get("evertz-india")) {
    announcements.push({
      id: "evertz-post-oa-2026-08-20",
      title: "Evertz OA absentee notice published",
      message: "RVITM published the students blacklisted for absence from the 19-Aug Evertz OA. Puneet is not on the absentee list; result/next-round status is still pending.",
      date: "2026-08-20",
      type: "info",
    });
  }

  if (bySlug.get("cargill-dtd")?.applicationStatus === "Applied") {
    announcements.push({
      id: "cargill-complete-2026-08-18",
      title: "Cargill registration complete",
      message: "Both mandatory Cargill registrations are complete. No further application action is needed; next stage is the 26-Aug PPT.",
      date: "2026-08-20",
      type: "info",
    });
  }

  if (bySlug.get("bitgo")?.applicationStatus === "Need Info") {
    announcements.push({
      id: "bitgo-exclusive-rvitm-2026-08-17",
      title: "BitGo exclusive RVITM drive announced",
      message: "A newer RVITM placement update says BitGo will come to RVITM exclusively for RVITM students. Registration, eligibility and schedule are still TBD.",
      date: "2026-08-17",
      type: "info",
    });
  }

  if (bySlug.get("pure-storage-everpure")?.applicationStatus === "Applied") {
    announcements.push({
      id: "pure-storage-registration-2026-08-17",
      title: "Pure Storage / EverPure registration confirmed",
      message: "The official RVITM registration sheet contains Puneet Dixit (1RF23CS119). The OA was scheduled for 20-Aug; personal progression is still awaiting confirmed follow-up.",
      date: "2026-08-20",
      type: "info",
    });
  }

  if (bySlug.get("sharechat")?.applicationStatus === "Not Shortlisted") {
    announcements.push({
      id: "sharechat-result-2026-08-17",
      title: "ShareChat OA result updated",
      message: "RVITM published the students who cleared the ShareChat OA. Puneet is not on the published list, so the current process is closed for now.",
      date: "2026-08-17",
      type: "info",
    });
  }

  return [
    ...announcements,
    ...(sourceData.announcements || []).filter((announcement) => !announcements.some((item) => item.id === announcement.id)),
  ];
}

export async function GET() {
  const companies = applyRuntimeCorrections(applyConfirmedState(sourceData.companies || [], overrideData));
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
        notice: "Placement records combine the primary tracker with authoritative overrides and newer official placement updates. IDFC OA remains completed; InMobi is not applicable to RVITM; Sama is Not Applied; ShareChat is Not Shortlisted; AMD is Not Applied; Eurofins final shortlist is now closed for Puneet; Sartorius final selection is also closed for Puneet; Pure Storage/EverPure and Cargill registrations remain confirmed; BitGo remains an upcoming exclusive RVITM drive with details TBD. Google and Flipkart remain excluded unless a fresh official notice appears.",
      },
      announcements: buildAnnouncements(companies),
      companies,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
