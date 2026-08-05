"use client";

import { Fragment, useMemo, useState } from "react";
import data from "../data/placements.json";

const statusNames = {
  draft: "Awaiting update",
  upcoming: "Upcoming",
  active: "Open now",
  closed: "Registration closed",
  completed: "Completed",
};

const statusFilters = [
  ["all", "All"],
  ["active", "Open now"],
  ["upcoming", "Upcoming"],
  ["draft", "Awaiting update"],
  ["closed", "Closed"],
  ["completed", "Completed"],
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function Chevron({ open = false }) {
  return (
    <svg className={open ? "chevron open" : "chevron"} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 10 4 4 4-4" />
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

function StatusCell({ value }) {
  return <span className={`status status-${value}`}><i />{statusNames[value] || value}</span>;
}

function packageText(company) {
  return company.package.ctc || company.package.stipend || company.package.label || "TBA";
}

function currentStage(company) {
  return company.timeline.find((item) => item.state === "current") || company.timeline[0] || { stage: "TBA", date: "TBA" };
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

function DetailRow({ company }) {
  return (
    <tr className="detail-row">
      <td colSpan="11">
        <div className="detail-panel">
          <div className="detail-summary">
            <span className="company-mark large">{company.shortName}</span>
            <div>
              <span className="cell-label">Company brief</span>
              <h2>{company.name}</h2>
              <p>{company.summary}</p>
            </div>
          </div>

          <div className="detail-grid">
            <section>
              <span className="cell-label">Industry</span>
              <strong>{company.industry}</strong>
            </section>
            <section>
              <span className="cell-label">Work mode</span>
              <strong>{company.workMode}</strong>
            </section>
            <section>
              <span className="cell-label">Priority</span>
              <strong className={`priority priority-${company.priority}`}>{company.priority}</strong>
            </section>
            <section>
              <span className="cell-label">Eligibility</span>
              <strong>{company.eligibility.join(", ")}</strong>
            </section>
          </div>

          <div className="detail-columns">
            <section>
              <h3>Skills to prepare</h3>
              <div className="tags">{company.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </section>
            <section>
              <h3>Selection process</h3>
              <ol>{company.selectionProcess.map((step) => <li key={step}>{step}</li>)}</ol>
            </section>
            <section className="timeline-block">
              <h3>Timeline</h3>
              <div className="timeline-list">
                {company.timeline.map((item, index) => (
                  <div className={`timeline-item ${item.state}`} key={`${item.stage}-${index}`}>
                    <i>{index + 1}</i>
                    <div><strong>{item.stage}</strong><span>{item.date}</span></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="detail-footer">
            <p><strong>Note:</strong> {company.notes.join(" ")}</p>
            <div className="detail-links">
              {company.applicationUrl ? (
                <a href={company.applicationUrl} target="_blank" rel="noreferrer">Application <ExternalIcon /></a>
              ) : <span>Application link pending</span>}
              {company.jdUrl ? (
                <a href={company.jdUrl} target="_blank" rel="noreferrer">Official JD <ExternalIcon /></a>
              ) : <span>Official JD pending</span>}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function CompaniesSheet({ companies, expanded, onToggle }) {
  return (
    <div className="sheet-scroll">
      <table className="placement-table">
        <thead>
          <tr>
            <th className="row-number">#</th>
            <th className="company-column">Company</th>
            <th>Role(s)</th>
            <th>Status</th>
            <th>Package / Stipend</th>
            <th>Deadline</th>
            <th>Location</th>
            <th>Eligibility</th>
            <th>Current stage</th>
            <th>Documents</th>
            <th aria-label="Expand details" />
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => {
            const stage = currentStage(company);
            const isOpen = expanded === company.slug;
            return (
              <Fragment key={company.slug}>
                <tr className={isOpen ? "data-row expanded" : "data-row"}>
                  <td className="row-number">{String(index + 1).padStart(2, "0")}</td>
                  <td className="company-column">
                    <div className="company-cell">
                      <span className="company-mark">{company.shortName}</span>
                      <div><strong>{company.name}</strong><small>{company.industry}</small></div>
                    </div>
                  </td>
                  <td><div className="role-list">{company.roles.map((role) => <span key={role}>{role}</span>)}</div></td>
                  <td><StatusCell value={company.status} /></td>
                  <td className="strong-cell">{packageText(company)}</td>
                  <td><span className={company.deadline ? "date-cell" : "muted-cell"}>{company.deadline || "TBA"}</span></td>
                  <td>{company.location}</td>
                  <td><span className="truncate-cell" title={company.eligibility.join(", ")}>{company.eligibility.join(", ")}</span></td>
                  <td><div className="stage-cell"><strong>{stage.stage}</strong><small>{stage.date}</small></div></td>
                  <td>
                    <div className="document-cell">
                      {company.jdUrl ? <a href={company.jdUrl} target="_blank" rel="noreferrer">JD</a> : <span>JD</span>}
                      {company.applicationUrl ? <a href={company.applicationUrl} target="_blank" rel="noreferrer">Apply</a> : <span>Apply</span>}
                    </div>
                  </td>
                  <td className="expand-cell">
                    <button onClick={() => onToggle(company.slug)} aria-expanded={isOpen} aria-label={`${isOpen ? "Close" : "Open"} ${company.name} details`}>
                      <Chevron open={isOpen} />
                    </button>
                  </td>
                </tr>
                {isOpen && <DetailRow company={company} />}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SelectedSheet() {
  const students = data.selectedStudents.filter((student) => student.verified);

  if (!students.length) {
    return (
      <div className="empty-sheet">
        <span>0</span>
        <div><strong>No verified selections published yet</strong><p>Student details and resumes appear only after the result and sharing permission are confirmed.</p></div>
      </div>
    );
  }

  return (
    <div className="sheet-scroll">
      <table className="placement-table student-table">
        <thead><tr><th className="row-number">#</th><th>Student</th><th>Company</th><th>Role</th><th>Resume</th></tr></thead>
        <tbody>
          {students.map((student, index) => (
            <tr className="data-row" key={`${student.name}-${student.company}`}>
              <td className="row-number">{String(index + 1).padStart(2, "0")}</td>
              <td className="strong-cell">{student.name}</td>
              <td>{student.company}</td>
              <td>{student.role}</td>
              <td>{student.resumeUrl ? <a className="table-link" href={student.resumeUrl} target="_blank" rel="noreferrer">View resume <ExternalIcon /></a> : "Not shared"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("priority");
  const [sheet, setSheet] = useState("companies");
  const [expanded, setExpanded] = useState(null);

  const companies = useMemo(() => {
    const filtered = data.companies.filter((company) => {
      const haystack = [
        company.name,
        company.industry,
        company.location,
        company.workMode,
        ...company.roles,
        ...company.skills,
        ...company.eligibility,
      ].join(" ").toLowerCase();

      return (filter === "all" || company.status === filter) && haystack.includes(query.trim().toLowerCase());
    });

    const priorityRank = { high: 0, medium: 1, low: 2 };
    return [...filtered].sort((a, b) => {
      if (sort === "company") return a.name.localeCompare(b.name);
      if (sort === "status") return statusNames[a.status].localeCompare(statusNames[b.status]);
      if (sort === "deadline") return (a.deadline || "9999").localeCompare(b.deadline || "9999");
      return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) || a.name.localeCompare(b.name);
    });
  }, [filter, query, sort]);

  const counts = {
    total: data.companies.length,
    active: data.companies.filter((company) => company.status === "active").length,
    upcoming: data.companies.filter((company) => company.status === "upcoming").length,
    selected: data.selectedStudents.filter((student) => student.verified).length,
  };

  function switchSheet(nextSheet) {
    setSheet(nextSheet);
    setExpanded(null);
  }

  return (
    <main>
      <header className="app-header">
        <div className="brand-block">
          <span className="logo-box">P26</span>
          <div><h1>Placements 26</h1><p>{data.meta.college}</p></div>
        </div>
        <div className="header-meta">
          <span>{data.meta.season}</span>
          <small>Updated {formatUpdated(data.meta.lastUpdated)}</small>
        </div>
      </header>

      <section className="workspace">
        <div className="summary-strip">
          <div><span>Total companies</span><strong>{counts.total}</strong></div>
          <div><span>Open now</span><strong>{counts.active}</strong></div>
          <div><span>Upcoming</span><strong>{counts.upcoming}</strong></div>
          <div><span>Verified selections</span><strong>{counts.selected}</strong></div>
          <div className="announcement-cell"><span>Latest update</span><strong>{data.announcements[0].title}</strong><small>{data.announcements[0].date}</small></div>
        </div>

        <div className="formula-bar">
          <span className="name-box">P26</span>
          <span className="fx">fx</span>
          <p>{data.meta.notice}</p>
        </div>

        <div className="sheet-toolbar">
          <label className="search-box"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, role, skill, location..." /></label>
          <div className="filter-buttons">
            {statusFilters.map(([value, label]) => (
              <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>
            ))}
          </div>
          <label className="sort-box"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="priority">Priority</option><option value="company">Company A–Z</option><option value="status">Status</option><option value="deadline">Deadline</option></select></label>
        </div>

        <section className="sheet-frame" aria-label="Placement workbook">
          <div className="sheet-titlebar">
            <div><strong>{sheet === "companies" ? "Master Placement Tracker" : "Selected Students"}</strong><span>{sheet === "companies" ? `${companies.length} visible rows` : `${counts.selected} verified rows`}</span></div>
            <small>Scroll sideways to view every column</small>
          </div>

          {sheet === "companies" ? (
            companies.length ? <CompaniesSheet companies={companies} expanded={expanded} onToggle={(slug) => setExpanded(expanded === slug ? null : slug)} /> : (
              <div className="empty-sheet"><span>0</span><div><strong>No rows match the current filters</strong><p>Clear the search or select another status.</p></div></div>
            )
          ) : <SelectedSheet />}

          <div className="sheet-tabs">
            <button className={sheet === "companies" ? "active" : ""} onClick={() => switchSheet("companies")}>Companies</button>
            <button className={sheet === "selected" ? "active" : ""} onClick={() => switchSheet("selected")}>Selected students</button>
            <span>Official placement information only</span>
          </div>
        </section>
      </section>

      <footer>
        <p>Verify deadlines and eligibility against the official placement-cell notice before applying.</p>
        <a href="/api/placements" target="_blank" rel="noreferrer">Placement data API <ExternalIcon /></a>
      </footer>
    </main>
  );
}
