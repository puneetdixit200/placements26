const SOURCE_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/placements.json";

const LATEST_COMPANIES = [
  {
    slug: "eurofins",
    name: "Eurofins",
    shortName: "EU",
    companyUrl: "https://www.eurofins.com/",
    industry: "Software engineering and enterprise applications",
    package: { stipend: "₹15,000 per month" },
    ppo: "₹8 LPA full-time + ₹50,000 retention bonus",
    description: "Eurofins is recruiting 2027 graduates for an Associate Software Engineer role through a six-month internship followed by full-time employment. The development team primarily works on .NET.",
    roles: ["Associate Software Engineer"],
    requirements: [
      "Register in the official RVITM campus sheet before 10 August 2026 at 5:00 PM IST",
      "Strong programming fundamentals and object-oriented programming",
      "Basic SQL/database knowledge and understanding of frontend frameworks",
      "REST API and SDLC knowledge are preferred; Git/version-control familiarity is preferred",
    ],
    eligibility: [
      "2027 graduating batch",
      "Bachelor's degree in Computer Science, Information Technology, Engineering or a related field",
      "Campus notice distributed to CSE, ISE and ECE students",
    ],
    skills: ["Programming", "OOP", "SQL", "Databases", "REST APIs", "Git", "SDLC", ".NET", "Debugging", "Problem Solving"],
    deadline: "10 August 2026, 5:00 PM",
    applicationUrl: "https://docs.google.com/spreadsheets/d/1vS64HK2FYnJ2JzBhEz32MxMTkLRBFFjINraM4uaRZPs/edit?usp=sharing",
    jdUrl: null,
    jdLinks: [],
    timeline: [
      { stage: "Campus registration deadline", date: "10 August 2026, 5:00 PM" },
      { stage: "Selection process", date: "Not yet stated in the official campus notice" },
    ],
    source: "Official RVITM placement email received 10 August 2026 at 10:20 AM",
  },
  {
    slug: "evertz-india",
    name: "Evertz India Private Limited",
    shortName: "EV",
    companyUrl: "https://www.evertz.com/",
    industry: "Broadcast technology, software engineering and digital media",
    package: { stipend: null },
    ppo: null,
    description: "Evertz India is conducting its 2027 campus recruitment process for software and broadcast-technology roles. Registered students have a virtual pre-placement session on 10 August and the campus assessment is confirmed for 19 August at RVITM.",
    roles: ["Campus Recruitment – 2027 Batch (role not specified)"],
    requirements: [
      "Attend the 10 August pre-placement session with camera ON and join 5–10 minutes early",
      "Microsoft Teams meeting ID: 220 192 779 369 800; passcode: NU9B9582",
      "Non-registered students may attend the session and register for the 19 August assessment",
      "No active backlogs and no break in education",
    ],
    eligibility: [
      "CSE/ISE/IT",
      "ECE/EEE with programming knowledge",
      "Minimum 70% aggregate through 6th semester",
      "Minimum 60% in Class 12",
      "Non-placed students only",
    ],
    skills: ["C", "C++", "Java", "Python", "DSA", "OOP", "Linux", "Operating Systems", "Computer Networks", "DBMS", "SQL", "Debugging"],
    deadline: "4 August 2026, 9:00 AM",
    applicationUrl: "https://forms.gle/EWBAb4LYuepuF9dSA",
    jdUrl: null,
    jdLinks: [],
    timeline: [
      { stage: "Virtual pre-placement session", date: "10 August 2026, 6:00–7:00 PM via Microsoft Teams" },
      { stage: "Campus assessment", date: "19 August 2026 at RVITM; exact time TBD" },
      { stage: "Selection process", date: "Technical Test → Technical Interview Rounds → Final Managerial Interview" },
    ],
    source: "Official RVITM placement email updated 10 August 2026 with Teams details and 19 August assessment date",
  },
  {
    slug: "idfc-first-bank",
    name: "IDFC FIRST Bank",
    shortName: "ID",
    companyUrl: "https://www.idfcfirstbank.com/",
    industry: "Banking technology and application engineering",
    package: { stipend: "₹40,000 per month" },
    ppo: "₹18 LPA CTC (₹14 LPA fixed + ₹2 lakh joining bonus + 15% variable)",
    description: "IDFC FIRST Bank is conducting a 2027 campus recruitment drive at RVCE for the Application Engineer role. Puneet Dixit is on the official OA shortlist, and the 10 August 5:00 PM assessment has been changed from remote to on-campus at the RVCE/RVU campus; exact lab/venue is TBD.",
    roles: ["Application Engineer"],
    requirements: [
      "Complete both event registration and the job application with the same email ID",
      "Answer the pre-screening questions sent after applying",
      "Students without PAN may complete the event registration and skip the application link as instructed by the placement team",
      "Officially shortlisted candidates must report to the RVCE/RVU campus for the 10 August 2026, 5:00 PM OA with a fully charged laptop; exact lab/venue is still to be announced",
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
      { stage: "On-campus assessment", date: "10 August 2026, 5:00 PM at RVCE/RVU; exact lab/venue TBD" },
      { stage: "Campus interviews", date: "21 August 2026; shortlist/time TBD" },
    ],
    source: "Official IDFC / RVCE placement emails and shortlist received 10 August 2026; Puneet Dixit is shortlisted and the OA was changed to on-campus at RVCE/RVU",
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
    description: "ShareChat is recruiting for a Software Development Intern opportunity with potential full-time employment. The campus registration deadline has passed, and Puneet's registration acceptance is currently unconfirmed because the campus sheet still shows an incomplete row.",
    roles: ["Software Development Intern", "Full-Time Software Engineer conversion opportunity"],
    requirements: [
      "Campus registration deadline passed on 9 August 2026 at 7:00 PM",
      "Puneet's campus row still shows Gender blank and Resume link as 'PUNEET'; acceptance must be confirmed with the placement cell or ShareChat campus coordinator",
      "Remote assessment covers DSA with emphasis on graphs, trees and linked lists, subject to confirmed registration/shortlist",
      "Technical interviews are in person at the ShareChat office in Bengaluru",
    ],
    eligibility: ["B.E. CSE, ISE, AIML, DS or CY", "Minimum 8.0 CGPA", "No active backlogs"],
    skills: ["DSA", "Graphs", "Trees", "Linked Lists", "Problem Solving", "OOP", "Low-Level Design", "Testing", "Debugging"],
    deadline: "9 August 2026, 7:00 PM",
    applicationUrl: "https://docs.google.com/spreadsheets/d/1FYqq6iJgymOJwNFjuXS1nn1UcUDbB4FQ8jXCVk8yKKE",
    jdUrl: null,
    jdLinks: [],
    timeline: [
      { stage: "Campus registration deadline", date: "9 August 2026, 7:00 PM — passed; registration acceptance unconfirmed" },
      { stage: "Urgent follow-up", date: "Contact placement cell / ShareChat campus coordinator as soon as possible" },
      { stage: "Remote assessment", date: "18 August 2026; exact time TBD; subject to confirmed registration/shortlist" },
      { stage: "In-person technical and HM rounds", date: "19 August 2026 at ShareChat office, Bengaluru; exact time TBD" },
    ],
    source: "Placement Tracker 2026 and live ShareChat campus registration sheet checked after the 9 August 2026 7:00 PM deadline",
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
      lastUpdated: "2026-08-10T13:55:00+05:30",
      rawDataThrough: "2026-08-10",
      notice: "Placement records are synced through 10 August 2026 from official placement communications and the primary placement tracker. Google and Flipkart remain hidden until a fresh official notice appears. Always verify the latest placement-cell message before acting.",
    },
    announcements: [
      {
        id: "placement-sync-2026-08-10-idfc-onsite-shortlist",
        title: "IDFC OA moved on-campus — shortlisted candidates report at 5:00 PM",
        message: `${companies.length} active company records are shown. Puneet Dixit is on IDFC FIRST Bank's official OA shortlist. Today's 5:00 PM assessment has changed from remote to on-campus at RVCE/RVU; carry a fully charged laptop and watch for the exact lab/venue. Eurofins registration also closes at 5:00 PM, and the Evertz pre-placement session is at 6:00 PM.`,
        date: "2026-08-10",
        type: "warning",
      },
      ...olderAnnouncements,
    ],
    companies,
  };

  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
