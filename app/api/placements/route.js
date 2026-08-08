const SOURCE_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/placements.json";

const LATEST_COMPANIES = [
  {
    slug: "idfc-first-bank",
    name: "IDFC FIRST Bank",
    shortName: "ID",
    companyUrl: "https://www.idfcfirstbank.com/",
    industry: "Banking technology and application engineering",
    package: { stipend: "₹40,000 per month" },
    ppo: "₹18 LPA CTC (₹14 LPA fixed + ₹2 lakh joining bonus + 15% variable)",
    description: "IDFC FIRST Bank is conducting a 2027 campus recruitment drive at RVCE for the Application Engineer role. Candidates must complete both the event registration and job application using the same email ID.",
    roles: ["Application Engineer"],
    requirements: [
      "Complete both event registration and the job application with the same email ID",
      "Answer the pre-screening questions sent after applying",
      "Students without PAN may complete the event registration and skip the application link as instructed by the placement team",
    ],
    eligibility: ["2027 batch", "B.E. CSE/ISE", "Minimum 6.0 CGPA", "No current backlogs"],
    skills: ["Java", "Spring Boot", "Python", "C++", "REST APIs", "SQL", "DSA", "OOP", "Testing", "Debugging", "Secure coding"],
    deadline: "9 August 2026, 3:30 PM",
    applicationUrl: "https://careers.idfcfirst.bank.in/in/en/event/6a75a7672a51052e8937a58d/Campus-Drive-RVCE",
    jdUrl: "https://careers.idfcfirst.bank.in/in/en/job/IFBAINP224654ENIN/Application-Engineer",
    jdLinks: [
      { label: "Application Engineer", url: "https://careers.idfcfirst.bank.in/in/en/job/IFBAINP224654ENIN/Application-Engineer" },
    ],
    timeline: [
      { stage: "Registration window", date: "7 August 2026, 3:30 PM – 9 August 2026, 3:30 PM" },
      { stage: "Assessment test", date: "10 August 2026, 5:00 PM" },
      { stage: "Campus interviews", date: "21 August 2026" },
    ],
    source: "Official RVCE placement email updated 8 August 2026; compensation and eligibility confirmed in Placement Tracker 2026",
  },
  {
    slug: "gocomet",
    name: "GoComet",
    shortName: "GC",
    companyUrl: "https://www.gocomet.com/",
    industry: "Full-stack development and software testing",
    package: { stipend: "₹30,000–₹35,000 per month" },
    ppo: "₹6–₹12 LPA depending on role after PPO",
    description: "GoComet, through AccioJob, is offering 12-month internships for Full Stack Developer and AI-First SDET roles with work from office in Bengaluru.",
    roles: ["Full Stack Developer Intern", "AI-First SDET Intern"],
    requirements: [
      "Able to join within 15 days if selected",
      "Work from office in Bengaluru",
      "Bring your own laptop for the offline assessment at The Oxford College of Engineering",
      "Selection includes an offline assessment, coding assignment and three virtual technical interview rounds",
    ],
    eligibility: ["BE/B.Tech", "CSE, ISE, ECE, AI, ML and other circuital branches", "Graduation years 2025, 2026 and 2027"],
    skills: ["DSA", "SQL", "Aptitude", "React", "REST API", "STLC", "Manual Testing", "Selenium", "CI/CD", "Java", "JavaScript", "Docker"],
    deadline: null,
    applicationUrl: "https://go.acciojob.com/c9wcB3",
    jdUrl: null,
    jdLinks: [],
    timeline: [
      { stage: "Opportunity announced", date: "7 August 2026" },
      { stage: "Selection process", date: "Offline assessment, coding assignment and three virtual technical interview rounds" },
    ],
    source: "Official RVITM placement email received 7 August 2026; second role application: https://go.acciojob.com/27c3yn",
  },
  {
    slug: "cognizant",
    name: "Cognizant",
    shortName: "CO",
    companyUrl: "https://www.cognizant.com/",
    industry: "Software engineering",
    package: { stipend: null },
    ppo: "Associate – Ace Frontier Engineer: ₹12 LPA; Senior Associate – Ace Frontier Engineer: ₹18 LPA",
    description: "Cognizant campus recruitment includes Ace Frontier Engineer roles. The latest placement communication announced the pre-placement talk and confirmed the two compensation levels.",
    roles: ["Associate – Ace Frontier Engineer", "Senior Associate – Ace Frontier Engineer"],
    requirements: ["Students in the notified programs/branches were strongly advised to attend the pre-placement talk and participate seriously in the recruitment process"],
    eligibility: [],
    skills: [],
    deadline: null,
    applicationUrl: null,
    jdUrl: null,
    jdLinks: [],
    timeline: [{ stage: "Pre-placement talk", date: "7 August 2026, 9:00 AM at ECE Seminar Hall" }],
    source: "Official RVCE placement email received 6 August 2026",
  },
  {
    slug: "gnani-ai",
    name: "Gnani.ai",
    shortName: "GN",
    companyUrl: "https://www.gnani.ai/",
    industry: "Enterprise AI and forward deployed engineering",
    package: { stipend: "₹30,000 per month" },
    ppo: "₹6.9–₹8.8 LPA on conversion",
    description: "Gnani.ai is offering a 12-month Forward Deployed Engineer internship focused on enterprise Voice AI and Generative AI solutions.",
    roles: ["Forward Deployed Engineer (Intern)"],
    requirements: [],
    eligibility: ["2027 batch", "B.E/MCA students as notified by the placement department"],
    skills: ["Python", "Flask", "FastAPI", "Django", "MongoDB", "Redis", "REST APIs", "Generative AI", "LLMs", "Prompt Engineering"],
    deadline: "7 August 2026, 9:00 AM",
    applicationUrl: "https://forms.gle/i8ZQiXT9vhadsswaA",
    jdUrl: null,
    jdLinks: [],
    timeline: [{ stage: "Application deadline", date: "7 August 2026, 9:00 AM" }],
    source: "Official RVITM placement email received 6 August 2026",
  },
  {
    slug: "recruit-crm",
    name: "Recruit CRM",
    shortName: "RC",
    companyUrl: "https://recruitcrm.io/",
    industry: "Remote SaaS software engineering",
    package: { stipend: "₹7,500/month internship; ₹20,000/month traineeship" },
    ppo: "Up to ₹9 LPA for Associate Software Engineer after successful traineeship",
    description: "Recruit CRM is hiring 2027 graduates for a remote Trainee Software Engineer journey consisting of a part-time internship, full-time traineeship and potential Associate Software Engineer conversion.",
    roles: ["Trainee Software Engineer", "Associate Software Engineer (conversion opportunity)"],
    requirements: ["Internship: 3 months, 21 hours per week", "Traineeship: 6 months, full-time", "High-performing trainees may receive a full-time offer"],
    eligibility: ["2027 BE/B.Tech/BCA/B.Sc./M.Tech/MCA/M.Sc.", "Computer Science, IT or related technical disciplines"],
    skills: ["Java", "Python", "AI", "Machine Learning", "Software development"],
    deadline: null,
    applicationUrl: "https://careers.recruitcrm.io/17841115307470061803BaU?utm_source=Internal+Hiring+&utm_medium=Candidates+&utm_campaign=Hiring",
    jdUrl: "https://drive.google.com/file/d/1n8BmY0BSidExPwogTsZ-807dWaxX2edY/view?usp=sharing",
    jdLinks: [{ label: "Trainee Software Engineer JD", url: "https://drive.google.com/file/d/1n8BmY0BSidExPwogTsZ-807dWaxX2edY/view?usp=sharing" }],
    timeline: [{ stage: "Opportunity announced", date: "6 August 2026" }],
    source: "Official RVITM placement email received 6 August 2026",
  },
  {
    slug: "sharechat",
    name: "ShareChat",
    shortName: "SC",
    companyUrl: "https://sharechat.com/",
    industry: "Consumer internet and software engineering",
    package: { stipend: "₹75,000 per month" },
    ppo: "₹50 LPA full-time CTC",
    description: "ShareChat is recruiting for a Software Development Intern opportunity with potential full-time employment. The process emphasizes DSA, problem solving, low-level design, projects and system/culture fit.",
    roles: ["Software Development Intern", "Full-Time Software Engineer conversion opportunity"],
    requirements: [
      "Complete the campus registration sheet including gender and resume before the deadline",
      "Remote assessment covers DSA with emphasis on graphs, trees and linked lists",
      "Technical interviews are in person at the ShareChat office in Bengaluru",
    ],
    eligibility: ["B.E. CSE, ISE, AIML, DS or CY", "Minimum 8.0 CGPA", "No active backlogs"],
    skills: ["DSA", "Graphs", "Trees", "Linked Lists", "Problem Solving", "OOP", "Low-Level Design", "Testing", "Debugging"],
    deadline: "9 August 2026, 7:00 PM",
    applicationUrl: "https://docs.google.com/spreadsheets/d/1FYqq6iJgymOJwNFjuXS1nn1UcUDbB4FQ8jXCVk8yKKE",
    jdUrl: null,
    jdLinks: [],
    timeline: [
      { stage: "Campus registration deadline", date: "9 August 2026, 7:00 PM" },
      { stage: "Remote assessment", date: "18 August 2026; exact time TBD" },
      { stage: "In-person technical and HM rounds", date: "19 August 2026 at ShareChat office, Bengaluru; exact time TBD" },
    ],
    source: "Placement Tracker 2026 and ShareChat campus registration sheet, updated 8 August 2026",
  },
];

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

function supplementSartorius(company) {
  if (company.slug !== "sartorius-india" || company.package?.stipend) return company;

  return {
    ...company,
    industry: "Biopharma technology internship",
    package: { stipend: "₹20,000 per month" },
    ppo: "Full-time opportunity based on individual performance and business requirements",
    description: "Sartorius India offered a 6–9 month technology internship with a ₹20,000 monthly stipend and cab facility. The latest update announced the technical-interview shortlist; interview dates and timings are still pending.",
    roles: ["6–9 Month Internship"],
    requirements: [
      "Carry college ID and an updated resume for campus recruitment stages",
      "Formal attire and professional conduct required",
      "Prepare core technical subjects, projects and programming concepts for the technical interview",
    ],
    eligibility: ["B.Tech AI & ML", "B.Tech IT", "B.E CSE", "B.E ECE"],
    deadline: "1 July 2026, 8:00 PM",
    applicationUrl: "https://forms.gle/zuSAKuMyAyH48ocx9",
    timeline: [
      { stage: "Application deadline", date: "1 July 2026, 8:00 PM" },
      { stage: "Campus recruitment drive", date: "30 July 2026, report 9:00 AM at RVITM" },
      { stage: "Technical interview shortlist announced", date: "7 August 2026" },
      { stage: "Technical interview", date: "Date and time to be shared based on panel availability" },
      { stage: "Internship start", date: "February 2027" },
    ],
    source: "Official RVITM placement email thread updated 7 August 2026",
  };
}

function mergeLatestCompanies(sourceCompanies) {
  const merged = new Map(
    sourceCompanies.map((company) => [company.slug, supplementSartorius(company)]),
  );

  for (const company of LATEST_COMPANIES) {
    merged.set(company.slug, company);
  }

  return Array.from(merged.values());
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
  const companies = mergeLatestCompanies(sourceData.companies || [])
    .filter((company) => !isStaleRemovedRecord(company));
  const [, ...olderAnnouncements] = sourceData.announcements || [];

  const data = {
    ...sourceData,
    meta: {
      ...sourceData.meta,
      lastUpdated: "2026-08-08T20:30:00+05:30",
      rawDataThrough: "2026-08-08",
      notice: "Placement records are synced through 8 August 2026 from official placement communications and the primary placement tracker. Google and Flipkart remain hidden until a fresh official notice appears. Always verify the latest placement-cell message before acting.",
    },
    announcements: [
      {
        id: "placement-sync-2026-08-08-sharechat",
        title: "ShareChat added to current placement records",
        message: `${companies.length} active company records are shown. ShareChat has been added with the 9 August registration deadline and 18–19 August selection schedule; IDFC compensation and eligibility were also enriched without replacing the newer official assessment timeline.`,
        date: "2026-08-08",
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
