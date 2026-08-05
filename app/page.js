"use client";

import { useEffect, useMemo, useState } from "react";

const COMPANY_URLS = {
  aereo: "https://aereo.io/",
  "breville-india": "https://www.breville.com/",
  "evertz-india": "https://evertz.com/",
  flipkart: "https://www.flipkartcareers.com/",
  "google-india-apprenticeships": "https://www.google.com/about/careers/applications/",
  greenlight: "https://greenlight.com/",
  "inmobi-groups": "https://www.inmobi.com/",
  infosys: "https://www.infosys.com/",
  lseg: "https://www.lseg.com/",
  "mu-sigma": "https://www.mu-sigma.com/",
  opentext: "https://www.opentext.com/",
  rayvector: "https://rayvector.com/",
  sama: "https://www.sama.live/",
  "sartorius-india": "https://www.sartorius.com/",
  stonex: "https://www.stonex.com/",
  surewaves: "https://www.surewaves.com/",
  "teal-india": "https://www.tealindia.in/",
};

const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5h5v5" />
      <path d="m10 14 9-9" />
      <path d="M19 13v6H5V5h6" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h11" />
      <path d="M8 12h8" />
      <path d="M8 18h5" />
      <path d="m3 5 2-2 2 2" />
      <path d="M5 3v16" />
    </svg>
  );
}

function formatUpdated(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function stipendText(company) {
  return company.package?.stipend || "Not mentioned";
}

function ppoText(company) {
  const ppo = company.ppo;

  if (!ppo) return "Not mentioned";
  if (typeof ppo === "string") return ppo;
  if (ppo.available === false) return "No";

  return ppo.package || ppo.ctc || ppo.label || (ppo.available ? "Yes" : "Not mentioned");
}

function descriptionText(company) {
  return company.description || company.summary || "Not provided";
}

function extractNumbers(value) {
  return String(value || "")
    .match(/\d+(?:,\d{3})*(?:\.\d+)?/g)
    ?.map((number) => Number(number.replaceAll(",", ""))) || [];
}

function stipendValue(company) {
  return Math.max(0, ...extractNumbers(stipendText(company)));
}

function ppoValue(company) {
  return Math.max(0, ...extractNumbers(ppoText(company)));
}

function parseDateText(value) {
  const text = String(value || "").toLowerCase().replaceAll(",", " ");
  const dates = [];
  const rangePattern = /(\d{1,2})\s*[–-]\s*(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/g;
  const dayPattern = /(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/g;
  const monthPattern = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/g;

  for (const match of text.matchAll(rangePattern)) {
    dates.push(new Date(Number(match[4]), MONTHS[match[3]], Number(match[2]), 12).getTime());
  }

  for (const match of text.matchAll(dayPattern)) {
    dates.push(new Date(Number(match[3]), MONTHS[match[2]], Number(match[1]), 12).getTime());
  }

  if (!dates.length) {
    for (const match of text.matchAll(monthPattern)) {
      dates.push(new Date(Number(match[2]), MONTHS[match[1]], 1, 12).getTime());
    }
  }

  return dates.filter(Number.isFinite);
}

function companyDates(company) {
  return [company.deadline, ...(company.timeline || []).map((item) => item.date)]
    .flatMap(parseDateText)
    .sort((a, b) => a - b);
}

function latestSortValue(company, referenceTime) {
  const dates = companyDates(company);
  const upcoming = dates.find((date) => date >= referenceTime - 12 * 60 * 60 * 1000);
  const recent = dates.length ? dates[dates.length - 1] : 0;

  return { upcoming: upcoming || 0, recent };
}

function compareLatest(a, b, referenceTime) {
  const left = latestSortValue(a, referenceTime);
  const right = latestSortValue(b, referenceTime);

  if (left.upcoming && right.upcoming) return left.upcoming - right.upcoming;
  if (left.upcoming) return -1;
  if (right.upcoming) return 1;
  if (left.recent !== right.recent) return right.recent - left.recent;
  return a.name.localeCompare(b.name);
}

function hasPpo(company) {
  return ppoText(company) !== "Not mentioned" && ppoText(company) !== "No";
}

function RequirementCell({ company }) {
  const eligibility = (company.eligibility || []).filter((item) => !/^to be confirmed$/i.test(item));
  const roles = company.roles || [];
  const skills = company.skills || [];
  const explicitRequirements = company.requirements || [];
  const hasInformation = roles.length || eligibility.length || skills.length || explicitRequirements.length;

  if (!hasInformation) return <span className="empty-value">Not provided</span>;

  return (
    <div className="requirements-cell">
      {roles.length > 0 && <div><strong>Roles</strong><span>{roles.join(", ")}</span></div>}
      {explicitRequirements.length > 0 && <div><strong>Requirements</strong><span>{explicitRequirements.join(", ")}</span></div>}
      {eligibility.length > 0 && <div><strong>Eligibility</strong><span>{eligibility.join(", ")}</span></div>}
      {skills.length > 0 && <div><strong>Skills</strong><span>{skills.join(", ")}</span></div>}
    </div>
  );
}

function JdCell({ company }) {
  const links = company.jdLinks?.length
    ? company.jdLinks
    : company.jdUrl
      ? [{ label: "Open JD", url: company.jdUrl }]
      : [];

  if (!links.length) return <span className="empty-value">Not available</span>;

  return (
    <div className="jd-links">
      {links.map((link) => (
        <a className="jd-link" href={link.url} target="_blank" rel="noreferrer" key={`${company.slug}-${link.label}`}>
          {link.label || "Open JD"} <ExternalIcon />
        </a>
      ))}
    </div>
  );
}

function RelatedDates({ company }) {
  const entries = [];

  if (company.deadline) entries.push({ label: "Application deadline", date: company.deadline });

  for (const item of company.timeline || []) {
    const date = String(item.date || "").trim();
    if (!date || /^(tba|to be announced|not announced)$/i.test(date)) continue;
    if (!entries.some((entry) => entry.label === item.stage && entry.date === date)) {
      entries.push({ label: item.stage, date });
    }
  }

  if (!entries.length) return <span className="empty-value">Not announced</span>;

  return (
    <div className="dates-cell">
      {entries.map((entry) => (
        <div key={`${entry.label}-${entry.date}`}>
          <strong>{entry.label}</strong>
          <span>{entry.date}</span>
        </div>
      ))}
    </div>
  );
}

function CompanyCell({ company }) {
  const website = company.companyUrl || COMPANY_URLS[company.slug];

  return (
    <div className="company-cell">
      <span className="company-mark">{company.shortName}</span>
      <div className="company-identity">
        {website ? (
          <a className="company-name-link" href={website} target="_blank" rel="noreferrer">
            {company.name} <ExternalIcon />
          </a>
        ) : (
          <strong>{company.name}</strong>
        )}
        <div className="company-actions">
          {company.applicationUrl && (
            <a className="form-link" href={company.applicationUrl} target="_blank" rel="noreferrer">
              Apply / Form <ExternalIcon />
            </a>
          )}
          <span className={`link-status ${company.applicationUrl ? "available" : ""}`}>
            {company.applicationUrl ? "Registration link available" : "No form shared"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [linkFilter, setLinkFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetch("/api/placements")
      .then((response) => {
        if (!response.ok) throw new Error(`Placement API returned ${response.status}`);
        return response.json();
      })
      .then(setData)
      .catch((error) => setLoadError(error.message));
  }, []);

  const sourceCompanies = data?.companies || [];
  const referenceTime = data ? new Date(data.meta.lastUpdated).getTime() : 0;

  const domains = useMemo(
    () => ["all", ...Array.from(new Set(sourceCompanies.map((company) => company.industry).filter(Boolean))).sort()],
    [data],
  );

  const companies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = sourceCompanies.filter((company) => {
      const searchable = [
        company.name,
        company.industry,
        company.description,
        company.summary,
        ...(company.roles || []),
        ...(company.requirements || []),
        ...(company.eligibility || []),
        ...(company.skills || []),
      ].filter(Boolean).join(" ").toLowerCase();

      const matchesDomain = domain === "all" || company.industry === domain;
      const matchesQuery = searchable.includes(normalizedQuery);
      const matchesLinks =
        linkFilter === "all"
        || (linkFilter === "form" && Boolean(company.applicationUrl))
        || (linkFilter === "jd" && Boolean(company.jdUrl || company.jdLinks?.length))
        || (linkFilter === "ppo" && hasPpo(company))
        || (linkFilter === "dated" && companyDates(company).length > 0);

      return matchesDomain && matchesQuery && matchesLinks;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "stipend") return stipendValue(b) - stipendValue(a) || a.name.localeCompare(b.name);
      if (sortBy === "ppo") return ppoValue(b) - ppoValue(a) || a.name.localeCompare(b.name);
      return compareLatest(a, b, referenceTime);
    });
  }, [data, domain, linkFilter, query, referenceTime, sortBy]);

  const stats = useMemo(() => ({
    forms: sourceCompanies.filter((company) => company.applicationUrl).length,
    jds: sourceCompanies.filter((company) => company.jdUrl || company.jdLinks?.length).length,
    ppos: sourceCompanies.filter(hasPpo).length,
  }), [data]);

  if (!data) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <span className="logo-box">P26</span>
          <div>
            <strong>{loadError ? "Unable to load placement data" : "Loading placement tracker"}</strong>
            <p>{loadError || "Fetching the latest company records…"}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="app-header">
        <div className="brand-block">
          <span className="logo-box">P26</span>
          <div>
            <h1>Placements 26</h1>
            <p>{data.meta.college}</p>
          </div>
        </div>
        <div className="header-meta">
          <strong>{data.meta.season}</strong>
          <span>Updated {formatUpdated(data.meta.lastUpdated)}</span>
        </div>
      </header>

      <section className="workspace">
        <section className="summary-strip" aria-label="Placement tracker summary">
          <div><span>Total companies</span><strong>{data.companies.length}</strong></div>
          <div><span>Application links</span><strong>{stats.forms}</strong></div>
          <div><span>JD links</span><strong>{stats.jds}</strong></div>
          <div><span>PPO / full-time</span><strong>{stats.ppos}</strong></div>
          <div className="announcement-cell">
            <span>Latest sync</span>
            <strong>{data.announcements[0]?.title || "Placement updates"}</strong>
            <small>{data.announcements[0]?.message || data.meta.notice}</small>
          </div>
        </section>

        <div className="toolbar">
          <label className="search-box">
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, role, domain or skill" />
          </label>

          <label className="control-box">
            <span>Domain</span>
            <select value={domain} onChange={(event) => setDomain(event.target.value)}>
              {domains.map((item) => (
                <option value={item} key={item}>{item === "all" ? "All domains" : item}</option>
              ))}
            </select>
          </label>

          <label className="control-box">
            <span>Filter</span>
            <select value={linkFilter} onChange={(event) => setLinkFilter(event.target.value)}>
              <option value="all">All companies</option>
              <option value="form">Form available</option>
              <option value="jd">JD available</option>
              <option value="ppo">PPO / full-time</option>
              <option value="dated">Dates available</option>
            </select>
          </label>

          <label className="control-box sort-control">
            <SortIcon />
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="latest">Latest / upcoming first</option>
              <option value="name-asc">Company A–Z</option>
              <option value="name-desc">Company Z–A</option>
              <option value="stipend">Highest stipend</option>
              <option value="ppo">Highest PPO / package</option>
            </select>
          </label>
        </div>

        <section className="table-card" aria-label="Placement company information">
          <div className="table-titlebar">
            <div>
              <strong>Company Information</strong>
              <span>{companies.length} of {data.companies.length} companies shown</span>
            </div>
            <small>Company names open official websites. Apply / Form opens the supplied registration link.</small>
          </div>

          <div className="table-scroll">
            <table className="placement-table">
              <thead>
                <tr>
                  <th className="number-column">#</th>
                  <th className="company-column">Company Name</th>
                  <th>Domain</th>
                  <th>Stipend</th>
                  <th>PPO</th>
                  <th>Company Description</th>
                  <th>Requirements</th>
                  <th>JD</th>
                  <th>Related Dates</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={company.slug}>
                    <td className="number-column">{index + 1}</td>
                    <td className="company-column"><CompanyCell company={company} /></td>
                    <td><span className="domain-pill">{company.industry || "Not provided"}</span></td>
                    <td className="money-cell">{stipendText(company)}</td>
                    <td className="money-cell">{ppoText(company)}</td>
                    <td className="description-cell">{descriptionText(company)}</td>
                    <td><RequirementCell company={company} /></td>
                    <td><JdCell company={company} /></td>
                    <td><RelatedDates company={company} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!companies.length && (
            <div className="empty-state">
              <strong>No matching company</strong>
              <span>Clear the search or reset the filters.</span>
            </div>
          )}
        </section>

        <p className="verification-note">{data.meta.notice}</p>
      </section>
    </main>
  );
}
