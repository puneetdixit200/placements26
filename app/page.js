"use client";

import { useMemo, useState } from "react";
import data from "../data/placements.json";

const statusNames = {
  draft: "Awaiting verification",
  upcoming: "Upcoming",
  active: "Open now",
  closed: "Registration closed",
  completed: "Process complete",
};

const filters = [
  ["all", "All companies"],
  ["active", "Open now"],
  ["upcoming", "Upcoming"],
  ["draft", "Awaiting update"],
  ["completed", "Completed"],
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);

const Search = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
);

function Status({ value }) {
  return <span className={`status status-${value}`}><i />{statusNames[value]}</span>;
}

function CompanyCard({ company }) {
  return (
    <article className="company-card">
      <div className="company-head">
        <div className="identity">
          <span className="logo">{company.shortName}</span>
          <div><h3>{company.name}</h3><p>{company.industry}</p></div>
        </div>
        <Status value={company.status} />
      </div>

      <p className="summary">{company.summary}</p>
      <div className="tags">{company.roles.map((role) => <span key={role}>{role}</span>)}</div>

      <div className="facts">
        <div><small>Package</small><strong>{company.package.ctc || company.package.stipend || company.package.label}</strong></div>
        <div><small>Deadline</small><strong>{company.deadline || "To be announced"}</strong></div>
      </div>

      <div className="mini-timeline">
        {company.timeline.map((item) => (
          <div className={`mini-step ${item.state}`} key={item.stage}>
            <i /><div><strong>{item.stage}</strong><small>{item.date}</small></div>
          </div>
        ))}
      </div>

      <details>
        <summary>Open full company brief <Arrow /></summary>
        <div className="brief">
          <div className="brief-grid">
            <section><small>Location</small><strong>{company.location}</strong></section>
            <section><small>Work mode</small><strong>{company.workMode}</strong></section>
            <section><small>Eligibility</small><strong>{company.eligibility.join(", ")}</strong></section>
            <section><small>Priority</small><strong>{company.priority}</strong></section>
          </div>
          <div className="brief-columns">
            <section><h4>Skills to prepare</h4><div className="tags green">{company.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
            <section><h4>Selection process</h4><ol>{company.selectionProcess.map((step) => <li key={step}>{step}</li>)}</ol></section>
          </div>
          <div className="brief-note"><strong>Official note</strong><p>{company.notes.join(" ")}</p></div>
          <div className="links">
            {company.applicationUrl ? <a href={company.applicationUrl} target="_blank" rel="noreferrer">Apply now <Arrow /></a> : <span>Application link pending</span>}
            {company.jdUrl ? <a href={company.jdUrl} target="_blank" rel="noreferrer">Official JD <Arrow /></a> : <span>Official JD pending</span>}
          </div>
        </div>
      </details>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const companies = useMemo(() => data.companies.filter((company) => {
    const text = [company.name, company.industry, ...company.roles, ...company.skills].join(" ").toLowerCase();
    return (filter === "all" || company.status === filter) && text.includes(query.trim().toLowerCase());
  }), [filter, query]);

  const active = data.companies.filter((company) => company.status === "active").length;
  const upcoming = data.companies.filter((company) => company.status === "upcoming").length;
  const selected = data.selectedStudents.filter((student) => student.verified).length;
  const featured = data.companies.find((company) => company.status === "active") || data.companies[0];

  return (
    <>
      <header className="nav">
        <div className="shell nav-inner">
          <a className="brand" href="#top"><span>P26</span><div><strong>Placements 26</strong><small>RVITM opportunity desk</small></div></a>
          <nav><a href="#companies">Companies</a><a href="#timeline">Timeline</a><a href="#selected">Selected students</a></nav>
          <a className="nav-button" href="#updates">Latest updates</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="grid-overlay" />
          <div className="shell hero-layout">
            <div className="hero-copy">
              <span className="eyebrow light">{data.meta.season}</span>
              <h1>Placement information,<em> finally in one place.</em></h1>
              <p>Track every company from announcement to final result. Find roles, packages, deadlines, JDs, eligibility, preparation signals and verified selected-student resumes without excavating old chat messages.</p>
              <div className="hero-actions"><a className="primary" href="#companies">Explore companies <Arrow /></a><a className="secondary" href="#selected">View selected students</a></div>
              <small className="updated"><i />Last updated {new Date(data.meta.lastUpdated).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</small>
            </div>

            <div className="radar">
              <div className="radar-title"><span>Opportunity radar</span><small>Live content structure</small></div>
              <div className="featured"><span className="featured-logo">{featured.shortName}</span><div><Status value={featured.status} /><h2>{featured.name}</h2><p>{featured.roles.join(" · ")}</p></div></div>
              <div className="radar-facts"><div><small>Compensation</small><strong>{featured.package.ctc || featured.package.label}</strong></div><div><small>Registration</small><strong>{featured.deadline || "TBA"}</strong></div></div>
              <div className="radar-steps">{featured.timeline.map((item, index) => <div className={`radar-step ${item.state}`} key={item.stage}><i>{index + 1}</i><div><strong>{item.stage}</strong><small>{item.date}</small></div></div>)}</div>
            </div>
          </div>
        </section>

        <section className="stats"><div className="shell stat-grid"><div><strong>{data.companies.length}</strong><span>Companies tracked</span></div><div><strong>{active}</strong><span>Open applications</span></div><div><strong>{upcoming}</strong><span>Upcoming processes</span></div><div><strong>{selected}</strong><span>Verified selections</span></div></div></section>

        <section className="shell update-wrap" id="updates">
          <div className="update"><span className="update-icon">↗</span><div><span className="eyebrow">Latest update</span><h2>{data.announcements[0].title}</h2><p>{data.announcements[0].message}</p></div><small>{data.announcements[0].date}</small></div>
          <p className="warning">{data.meta.notice}</p>
        </section>

        <section className="shell section" id="companies">
          <div className="heading"><div><span className="eyebrow">Company intelligence</span><h2>Every opportunity, one reliable timeline.</h2></div><p>Search by company, role or skill. Each record keeps the JD, package, eligibility and round-by-round status together instead of scattering it across six groups and one heroic screenshot.</p></div>
          <div className="toolbar">
            <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, role or skill" /></label>
            <div className="filters">{filters.map(([value, label]) => <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
          </div>
          <div className="company-grid">{companies.map((company) => <CompanyCard company={company} key={company.slug} />)}</div>
          {!companies.length && <div className="empty"><strong>No company matches that filter.</strong><p>Try another role, technology or status.</p></div>}
        </section>

        <section className="process" id="timeline">
          <div className="shell process-grid">
            <div><span className="eyebrow light">One process language</span><h2>Know what happened, what is next, and what needs action.</h2><p>Every company follows the same readable structure, so students can compare stages quickly while the placement team updates only the facts that changed.</p></div>
            <div className="master-steps">{[["01","Announcement","JD, roles, package and eligibility published"],["02","Registration","Deadline, form and resume instructions"],["03","Assessment","Pattern, timing, shortlist and preparation notes"],["04","Interviews","Round updates, venue and reporting instructions"],["05","Results","Verified selections and permission-approved resumes"]].map(([n,t,c]) => <div key={n}><span>{n}</span><section><strong>{t}</strong><p>{c}</p></section></div>)}</div>
          </div>
        </section>

        <section className="shell section" id="selected">
          <div className="heading"><div><span className="eyebrow">Verified outcomes</span><h2>Learn from students who converted.</h2></div><p>Official selections, role outcomes and student-approved resume links will appear here. Personal data does not become public merely because someone found a Drive link.</p></div>
          {data.selectedStudents.length ? <div className="student-grid">{data.selectedStudents.filter((student) => student.verified).map((student) => <article key={`${student.name}-${student.company}`}><span className="avatar">{student.name.slice(0,2).toUpperCase()}</span><small>{student.company}</small><h3>{student.name}</h3><p>{student.role}</p>{student.resumeUrl && <a href={student.resumeUrl}>View resume <Arrow /></a>}</article>)}</div> : <div className="selected-empty"><span>✓</span><div><strong>No verified selections published yet.</strong><p>Profiles appear after the result and resume-sharing permission are confirmed.</p></div></div>}
        </section>
      </main>

      <footer><div className="shell"><a className="brand" href="#top"><span>P26</span><div><strong>Placements 26</strong><small>Built for clear, verified communication.</small></div></a><p>Always verify dates and eligibility with the official placement-cell notice.</p></div></footer>
    </>
  );
}
