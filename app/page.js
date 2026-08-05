"use client";

import { useMemo, useState } from "react";
import data from "../data/placements.json";

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

function formatUpdated(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

function RequirementCell({ company }) {
  const eligibility = (company.eligibility || []).filter((item) => !/^to be confirmed$/i.test(item));
  const roles = company.roles || [];
  const skills = company.skills || [];
  const explicitRequirements = company.requirements || [];
  const hasInformation = roles.length || eligibility.length || skills.length || explicitRequirements.length;

  if (!hasInformation) return <span className="empty-value">Not provided</span>;

  return (
    <div className="requirements-cell">
      {roles.length > 0 && (
        <div><strong>Roles</strong><span>{roles.join(", ")}</span></div>
      )}
      {explicitRequirements.length > 0 && (
        <div><strong>Requirements</strong><span>{explicitRequirements.join(", ")}</span></div>
      )}
      {eligibility.length > 0 && (
        <div><strong>Eligibility</strong><span>{eligibility.join(", ")}</span></div>
      )}
      {skills.length > 0 && (
        <div><strong>Skills</strong><span>{skills.join(", ")}</span></div>
      )}
    </div>
  );
}

function RelatedDates({ company }) {
  const entries = [];

  if (company.deadline) {
    entries.push({ label: "Application deadline", date: company.deadline });
  }

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");

  const domains = useMemo(
    () => ["all", ...Array.from(new Set(data.companies.map((company) => company.industry).filter(Boolean))).sort()],
    [],
  );

  const companies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.companies
      .filter((company) => {
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

        return (domain === "all" || company.industry === domain) && searchable.includes(normalizedQuery);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [domain, query]);

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
        <div className="notice-bar">
          <strong>{data.announcements[0]?.title || "Placement updates"}</strong>
          <span>{data.announcements[0]?.message || data.meta.notice}</span>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, domain or requirement"
            />
          </label>

          <label className="domain-filter">
            <span>Domain</span>
            <select value={domain} onChange={(event) => setDomain(event.target.value)}>
              {domains.map((item) => (
                <option value={item} key={item}>{item === "all" ? "All domains" : item}</option>
              ))}
            </select>
          </label>

          <span className="result-count">{companies.length} compan{companies.length === 1 ? "y" : "ies"}</span>
        </div>

        <section className="table-card" aria-label="Placement company information">
          <div className="table-titlebar">
            <div>
              <strong>Company Information</strong>
              <span>Only the essential placement fields</span>
            </div>
            <small>Scroll horizontally on smaller screens</small>
          </div>

          <div className="table-scroll">
            <table className="placement-table">
              <thead>
                <tr>
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
                {companies.map((company) => (
                  <tr key={company.slug}>
                    <td className="company-column">
                      <div className="company-cell">
                        <span className="company-mark">{company.shortName}</span>
                        <strong>{company.name}</strong>
                      </div>
                    </td>
                    <td><span className="domain-pill">{company.industry || "Not provided"}</span></td>
                    <td className="money-cell">{stipendText(company)}</td>
                    <td className="money-cell">{ppoText(company)}</td>
                    <td className="description-cell">{descriptionText(company)}</td>
                    <td><RequirementCell company={company} /></td>
                    <td>
                      {company.jdUrl ? (
                        <a className="jd-link" href={company.jdUrl} target="_blank" rel="noreferrer">
                          Open JD <ExternalIcon />
                        </a>
                      ) : <span className="empty-value">Not available</span>}
                    </td>
                    <td><RelatedDates company={company} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!companies.length && (
            <div className="empty-state">
              <strong>No matching company</strong>
              <span>Clear the search or choose another domain.</span>
            </div>
          )}
        </section>

        <p className="verification-note">{data.meta.notice}</p>
      </section>
    </main>
  );
}
