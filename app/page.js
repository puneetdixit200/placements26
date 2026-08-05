"use client";

import { useEffect, useMemo, useState } from "react";

const COMPANY_URLS = {
  aereo: "https://aereo.io/",
  "breville-india": "https://www.breville.com/",
  "evertz-india": "https://evertz.com/",
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
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function Icon({ name }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    external: <><path d="M14 5h5v5" /><path d="m10 14 9-9" /><path d="M19 13v6H5V5h6" /></>,
    sort: <><path d="M8 6h11M8 12h8M8 18h5" /><path d="m3 5 2-2 2 2M5 3v16" /></>,
    calendar: <><path d="M5 3v4M19 3v4" /><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18M8 14h2M14 14h2M8 18h2M14 18h2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    table: <><path d="M4 5h16v14H4zM4 10h16M10 5v14" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function formatUpdated(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
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
  return String(value || "").match(/\d+(?:,\d{3})*(?:\.\d+)?/g)?.map((item) => Number(item.replaceAll(",", ""))) || [];
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
    dates.push(new Date(Number(match[4]), MONTHS[match[3]], Number(match[1]), 12).getTime());
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
  return Array.from(new Set(dates.filter(Number.isFinite))).sort((a, b) => a - b);
}

function companyDateEntries(company) {
  const entries = [];
  if (company.deadline) entries.push({ stage: "Application deadline", date: company.deadline });
  for (const item of company.timeline || []) {
    const date = String(item.date || "").trim();
    if (!date || /^(tba|to be announced|not announced)$/i.test(date)) continue;
    if (!entries.some((entry) => entry.stage === item.stage && entry.date === date)) {
      entries.push({ stage: item.stage, date });
    }
  }
  return entries;
}

function companyDates(company) {
  return companyDateEntries(company).flatMap((entry) => parseDateText(entry.date)).sort((a, b) => a - b);
}

function latestSortValue(company, referenceTime) {
  const dates = companyDates(company);
  const upcoming = dates.find((date) => date >= referenceTime - 12 * 60 * 60 * 1000);
  return { upcoming: upcoming || 0, recent: dates.at(-1) || 0 };
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
  return !["Not mentioned", "No"].includes(ppoText(company));
}

function eventStatus(timestamps, referenceTime) {
  if (!timestamps.length) return "unscheduled";
  const reference = new Date(referenceTime);
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()).getTime();
  const end = start + 24 * 60 * 60 * 1000 - 1;
  if (timestamps[0] <= end && timestamps.at(-1) >= start) return "today";
  if (timestamps[0] > end) return "upcoming";
  return "past";
}

function buildCalendarEvents(companies, referenceTime) {
  const events = companies.flatMap((company) => companyDateEntries(company).map((entry, index) => {
    const timestamps = parseDateText(entry.date);
    return {
      id: `${company.slug}-${entry.stage}-${index}`,
      company,
      stage: entry.stage,
      date: entry.date,
      timestamps,
      firstTimestamp: timestamps[0] || 0,
      lastTimestamp: timestamps.at(-1) || 0,
      status: eventStatus(timestamps, referenceTime),
    };
  }));
  const rank = { today: 0, upcoming: 1, past: 2, unscheduled: 3 };
  return events.sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    if (a.status === "past") return b.lastTimestamp - a.lastTimestamp || a.company.name.localeCompare(b.company.name);
    if (a.status === "unscheduled") return a.company.name.localeCompare(b.company.name);
    return a.firstTimestamp - b.firstTimestamp || a.company.name.localeCompare(b.company.name);
  });
}

function formatEventDate(event) {
  if (!event.firstTimestamp) return { day: "?", month: "DATE", year: "TBD" };
  const date = new Date(event.firstTimestamp);
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" }),
    month: date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase(),
    year: date.toLocaleDateString("en-IN", { year: "numeric", timeZone: "Asia/Kolkata" }),
  };
}

function nextCompanyEvent(company, referenceTime) {
  return companyDateEntries(company)
    .map((entry) => ({ ...entry, timestamp: parseDateText(entry.date)[0] || 0 }))
    .filter((entry) => entry.timestamp >= referenceTime - 12 * 60 * 60 * 1000)
    .sort((a, b) => a.timestamp - b.timestamp)[0] || null;
}

function companyState(company, referenceTime) {
  const dates = companyDates(company);
  if (!dates.length) return "No date";
  const next = dates.find((date) => date >= referenceTime - 12 * 60 * 60 * 1000);
  if (!next) return "Completed";
  const reference = new Date(referenceTime);
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()).getTime();
  const end = start + 24 * 60 * 60 * 1000 - 1;
  return next <= end ? "Today" : "Upcoming";
}

function ExternalLink({ href, className = "secondary-action", children }) {
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<Icon name="external" /></a>;
}

function CompanyCard({ company, index, referenceTime }) {
  const website = company.companyUrl || COMPANY_URLS[company.slug];
  const nextEvent = nextCompanyEvent(company, referenceTime);
  const status = companyState(company, referenceTime);
  const jdLinks = company.jdLinks?.length ? company.jdLinks : company.jdUrl ? [{ label: "Open JD", url: company.jdUrl }] : [];
  const roles = company.roles || [];
  const requirements = company.requirements || [];
  const eligibility = company.eligibility || [];
  const skills = company.skills || [];
  const dates = companyDateEntries(company);

  return (
    <article className="company-card">
      <div className="company-card-topline">
        <span className="company-index">{String(index + 1).padStart(2, "0")}</span>
        <span className={`status-chip status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>
      </div>

      <div className="company-card-heading">
        <span className="company-mark">{company.shortName}</span>
        <div>
          {website ? (
            <a className="company-name-link" href={website} target="_blank" rel="noreferrer">{company.name}<Icon name="external" /></a>
          ) : <h3>{company.name}</h3>}
          <p>{company.industry || "Domain not provided"}</p>
        </div>
      </div>

      <p className="company-summary">{descriptionText(company)}</p>

      <div className="compensation-grid">
        <div><span>Stipend</span><strong>{stipendText(company)}</strong></div>
        <div><span>PPO / Full-time</span><strong>{ppoText(company)}</strong></div>
      </div>

      <div className={`next-event ${nextEvent ? "has-date" : ""}`}>
        <span>{nextEvent ? nextEvent.stage : "Next date"}</span>
        <strong>{nextEvent?.date || "Not announced"}</strong>
      </div>

      {roles.length > 0 && (
        <div className="role-chips">
          {roles.slice(0, 3).map((role) => <span key={role}>{role}</span>)}
          {roles.length > 3 && <span>+{roles.length - 3} more</span>}
        </div>
      )}

      <div className="company-card-actions">
        <ExternalLink href={company.applicationUrl} className="primary-action">Apply</ExternalLink>
        {jdLinks[0] && <ExternalLink href={jdLinks[0].url}>JD</ExternalLink>}
        <ExternalLink href={website}>Website</ExternalLink>
      </div>

      <details className="company-details">
        <summary>View all details <Icon name="arrow" /></summary>
        <div className="details-content">
          {requirements.length > 0 && <DetailGroup label="Requirements" items={requirements} />}
          {eligibility.length > 0 && <DetailGroup label="Eligibility" items={eligibility} />}
          {skills.length > 0 && <DetailGroup label="Skills" items={skills} chips />}
          {dates.length > 0 && (
            <div className="detail-group">
              <h4>Timeline</h4>
              <div className="mini-timeline">
                {dates.map((entry) => <div key={`${entry.stage}-${entry.date}`}><span>{entry.stage}</span><strong>{entry.date}</strong></div>)}
              </div>
            </div>
          )}
          {jdLinks.length > 1 && (
            <div className="detail-group">
              <h4>Job descriptions</h4>
              <div className="detail-links">{jdLinks.map((link) => <ExternalLink href={link.url} key={link.url}>{link.label}</ExternalLink>)}</div>
            </div>
          )}
        </div>
      </details>
    </article>
  );
}

function DetailGroup({ label, items, chips = false }) {
  return (
    <div className="detail-group">
      <h4>{label}</h4>
      {chips ? <div className="skill-chips">{items.map((item) => <span key={item}>{item}</span>)}</div> : <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}
    </div>
  );
}

function RequirementCell({ company }) {
  const groups = [
    ["Roles", company.roles || []],
    ["Requirements", company.requirements || []],
    ["Eligibility", company.eligibility || []],
    ["Skills", company.skills || []],
  ].filter(([, items]) => items.length);
  if (!groups.length) return <span className="empty-value">Not provided</span>;
  return <div className="requirements-cell">{groups.map(([label, items]) => <div key={label}><strong>{label}</strong><span>{items.join(", ")}</span></div>)}</div>;
}

function JdCell({ company }) {
  const links = company.jdLinks?.length ? company.jdLinks : company.jdUrl ? [{ label: "Open JD", url: company.jdUrl }] : [];
  if (!links.length) return <span className="empty-value">Not available</span>;
  return <div className="jd-links">{links.map((link) => <ExternalLink href={link.url} className="jd-link" key={link.url}>{link.label || "Open JD"}</ExternalLink>)}</div>;
}

function RelatedDates({ company }) {
  const entries = companyDateEntries(company);
  if (!entries.length) return <span className="empty-value">Not announced</span>;
  return <div className="dates-cell">{entries.map((entry) => <div key={`${entry.stage}-${entry.date}`}><strong>{entry.stage}</strong><span>{entry.date}</span></div>)}</div>;
}

function CompanyCell({ company }) {
  const website = company.companyUrl || COMPANY_URLS[company.slug];
  return (
    <div className="company-cell">
      <span className="company-mark">{company.shortName}</span>
      <div className="company-identity">
        {website ? <a className="company-name-link" href={website} target="_blank" rel="noreferrer">{company.name}<Icon name="external" /></a> : <strong>{company.name}</strong>}
        <div className="company-actions">
          <ExternalLink href={company.applicationUrl} className="form-link">Apply / Form</ExternalLink>
          <span className={`link-status ${company.applicationUrl ? "available" : ""}`}>{company.applicationUrl ? "Registration link available" : "No form shared"}</span>
        </div>
      </div>
    </div>
  );
}

function CalendarModal({ events, filter, onFilterChange, onClose }) {
  const visibleEvents = events.filter((event) => filter === "all" || (filter === "upcoming" ? ["today", "upcoming"].includes(event.status) : event.status === filter));
  const datedCompanies = new Set(events.map((event) => event.company.slug)).size;

  return (
    <div className="calendar-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="calendar-panel" role="dialog" aria-modal="true" aria-labelledby="calendar-title">
        <header className="calendar-header">
          <div><span className="calendar-kicker">Placement calendar</span><h2 id="calendar-title">Every important date.</h2><p>{events.length} schedule items across {datedCompanies} companies.</p></div>
          <button className="calendar-close" type="button" onClick={onClose} aria-label="Close calendar"><Icon name="close" /></button>
        </header>
        <nav className="calendar-filters" aria-label="Calendar filters">
          {["all", "upcoming", "past", "unscheduled"].map((value) => <button type="button" className={filter === value ? "active" : ""} onClick={() => onFilterChange(value)} key={value}>{value === "unscheduled" ? "Date pending" : value[0].toUpperCase() + value.slice(1)}</button>)}
        </nav>
        <div className="calendar-list">
          {visibleEvents.map((event) => {
            const date = formatEventDate(event);
            const website = event.company.companyUrl || COMPANY_URLS[event.company.slug];
            return (
              <article className={`calendar-event status-${event.status}`} key={event.id}>
                <div className="calendar-date-block" aria-hidden="true"><strong>{date.day}</strong><span>{date.month}</span><small>{date.year}</small></div>
                <div className="calendar-event-body">
                  <div className="calendar-event-topline"><span className="calendar-status">{event.status === "unscheduled" ? "DATE PENDING" : event.status}</span><span className="calendar-company-code">{event.company.shortName}</span></div>
                  <h3>{event.company.name}</h3><strong className="calendar-stage">{event.stage}</strong><p>{event.date}</p>
                  <div className="calendar-event-actions"><ExternalLink href={website}>Company</ExternalLink><ExternalLink href={event.company.applicationUrl} className="calendar-apply">Apply / Form</ExternalLink></div>
                </div>
              </article>
            );
          })}
          {!visibleEvents.length && <div className="calendar-empty"><strong>No dates in this group.</strong><span>Apparently the calendar has been granted a brief holiday.</span></div>}
        </div>
      </section>
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
  const [viewMode, setViewMode] = useState("cards");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState("all");

  useEffect(() => {
    fetch("/api/placements").then((response) => {
      if (!response.ok) throw new Error(`Placement API returned ${response.status}`);
      return response.json();
    }).then(setData).catch((error) => setLoadError(error.message));
  }, []);

  useEffect(() => {
    if (!calendarOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === "Escape" && setCalendarOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [calendarOpen]);

  const sourceCompanies = data?.companies || [];
  const referenceTime = data ? new Date(data.meta.lastUpdated).getTime() : Date.now();
  const domains = useMemo(() => ["all", ...Array.from(new Set(sourceCompanies.map((company) => company.industry).filter(Boolean))).sort()], [sourceCompanies]);

  const companies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = sourceCompanies.filter((company) => {
      const searchable = [company.name, company.industry, descriptionText(company), ...(company.roles || []), ...(company.requirements || []), ...(company.eligibility || []), ...(company.skills || [])].filter(Boolean).join(" ").toLowerCase();
      const matchesLinks = linkFilter === "all"
        || (linkFilter === "form" && Boolean(company.applicationUrl))
        || (linkFilter === "jd" && Boolean(company.jdUrl || company.jdLinks?.length))
        || (linkFilter === "ppo" && hasPpo(company))
        || (linkFilter === "dated" && companyDates(company).length > 0);
      return (domain === "all" || company.industry === domain) && searchable.includes(normalizedQuery) && matchesLinks;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "stipend") return stipendValue(b) - stipendValue(a) || a.name.localeCompare(b.name);
      if (sortBy === "ppo") return ppoValue(b) - ppoValue(a) || a.name.localeCompare(b.name);
      return compareLatest(a, b, referenceTime);
    });
  }, [domain, linkFilter, query, referenceTime, sortBy, sourceCompanies]);

  const calendarEvents = useMemo(() => buildCalendarEvents(sourceCompanies, referenceTime), [referenceTime, sourceCompanies]);
  const upcomingEvents = calendarEvents.filter((event) => ["today", "upcoming"].includes(event.status)).slice(0, 3);
  const stats = useMemo(() => ({
    forms: sourceCompanies.filter((company) => company.applicationUrl).length,
    ppos: sourceCompanies.filter(hasPpo).length,
    upcoming: calendarEvents.filter((event) => ["today", "upcoming"].includes(event.status)).length,
  }), [calendarEvents, sourceCompanies]);

  if (!data) {
    return <main className="loading-screen"><div className="loading-card"><span className="logo-box">P26</span><div><strong>{loadError ? "Unable to load placement data" : "Loading placement tracker"}</strong><p>{loadError || "Fetching the latest company records…"}</p></div></div></main>;
  }

  return (
    <main>
      <header className="app-header">
        <div className="brand-block"><span className="logo-box">P26</span><div><h1>Placements 26</h1><p>{data.meta.college}</p></div></div>
        <div className="header-meta"><strong>{data.meta.season}</strong><span>Updated {formatUpdated(data.meta.lastUpdated)}</span></div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">RVITM placement tracker</span>
          <h2>Find the opportunity.<br />Catch the deadline.</h2>
          <p>Search every active company, compare compensation, open official links, and see the next placement event without excavating a spreadsheet.</p>
          <div className="hero-actions">
            <button className="calendar-button" type="button" onClick={() => setCalendarOpen(true)}><Icon name="calendar" /><span>Open calendar</span><strong>{calendarEvents.length}</strong></button>
            <a className="hero-link" href="#companies">Browse companies <Icon name="arrow" /></a>
          </div>
        </div>
        <aside className="next-up-panel">
          <div className="next-up-heading"><span>Next up</span><strong>{stats.upcoming} upcoming</strong></div>
          {upcomingEvents.length ? upcomingEvents.map((event) => {
            const date = formatEventDate(event);
            return <div className="next-up-item" key={event.id}><div className="compact-date"><strong>{date.day}</strong><span>{date.month}</span></div><div><strong>{event.company.name}</strong><span>{event.stage}</span><small>{event.date}</small></div></div>;
          }) : <p className="no-upcoming">No upcoming dated events are currently listed.</p>}
        </aside>
      </section>

      <section className="workspace" id="companies">
        <section className="summary-strip" aria-label="Placement tracker summary">
          <div><span>Active companies</span><strong>{sourceCompanies.length}</strong></div>
          <div><span>Application links</span><strong>{stats.forms}</strong></div>
          <div><span>PPO / full-time</span><strong>{stats.ppos}</strong></div>
          <div><span>Upcoming events</span><strong>{stats.upcoming}</strong></div>
          <div className="announcement-cell"><span>Latest update</span><strong>{data.announcements[0]?.title || "Placement updates"}</strong><small>{data.announcements[0]?.message || data.meta.notice}</small></div>
        </section>

        <div className="toolbar">
          <label className="search-box"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, role, domain or skill" /></label>
          <label className="control-box"><span>Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)}>{domains.map((item) => <option value={item} key={item}>{item === "all" ? "All domains" : item}</option>)}</select></label>
          <label className="control-box"><span>Filter</span><select value={linkFilter} onChange={(event) => setLinkFilter(event.target.value)}><option value="all">All companies</option><option value="form">Form available</option><option value="jd">JD available</option><option value="ppo">PPO / full-time</option><option value="dated">Dates available</option></select></label>
          <label className="control-box sort-control"><Icon name="sort" /><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="latest">Latest / upcoming</option><option value="name-asc">Company A–Z</option><option value="name-desc">Company Z–A</option><option value="stipend">Highest stipend</option><option value="ppo">Highest PPO / package</option></select></label>
          <div className="view-toggle" aria-label="View mode"><button type="button" className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")} aria-label="Card view"><Icon name="grid" /></button><button type="button" className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} aria-label="Table view"><Icon name="table" /></button></div>
        </div>

        <div className="results-heading"><div><span>Opportunities</span><h3>{companies.length} companies</h3></div><p>Sorted by {sortBy === "latest" ? "nearest upcoming activity" : "your selected order"}.</p></div>

        {viewMode === "cards" ? (
          <section className="company-grid" aria-label="Placement companies">
            {companies.map((company, index) => <CompanyCard company={company} index={index} referenceTime={referenceTime} key={company.slug} />)}
          </section>
        ) : (
          <section className="table-card" aria-label="Placement company information">
            <div className="table-titlebar"><div><strong>Complete company data</strong><span>{companies.length} of {sourceCompanies.length} shown</span></div><small>Horizontal scrolling is available for the full dataset.</small></div>
            <div className="table-scroll"><table className="placement-table"><thead><tr><th className="number-column">#</th><th className="company-column">Company</th><th>Domain</th><th>Stipend</th><th>PPO</th><th>Description</th><th>Requirements</th><th>JD</th><th>Related dates</th></tr></thead><tbody>{companies.map((company, index) => <tr key={company.slug}><td className="number-column">{index + 1}</td><td className="company-column"><CompanyCell company={company} /></td><td><span className="domain-pill">{company.industry || "Not provided"}</span></td><td className="money-cell">{stipendText(company)}</td><td className="money-cell">{ppoText(company)}</td><td className="description-cell">{descriptionText(company)}</td><td><RequirementCell company={company} /></td><td><JdCell company={company} /></td><td><RelatedDates company={company} /></td></tr>)}</tbody></table></div>
          </section>
        )}

        {!companies.length && <div className="empty-state"><strong>No matching company</strong><span>Clear the search or reset the filters.</span></div>}
        <p className="verification-note">{data.meta.notice}</p>
      </section>

      {calendarOpen && <CalendarModal events={calendarEvents} filter={calendarFilter} onFilterChange={setCalendarFilter} onClose={() => setCalendarOpen(false)} />}
    </main>
  );
}
