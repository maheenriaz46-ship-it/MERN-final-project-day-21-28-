import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import JobModal from '../components/JobModal.jsx';

const FILTERS = ['All', 'Applied', 'Interview', 'Rejected', 'Offer'];
const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Jobs() {
  const [jobs, setJobs] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [modal, setModal] = useState(null); // null | {} (new) | job (edit)

  const load = useCallback(() => {
    const qs = new URLSearchParams({ search, status, type });
    api('/jobs?' + qs).then(setJobs).catch(() => setJobs([]));
  }, [search, status, type]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const remove = async (j) => {
    if (!window.confirm(`Delete ${j.position} at ${j.company}?`)) return;
    await api(`/jobs/${j._id}`, { method: 'DELETE' });
    load();
  };
  const quickStatus = async (j, s) => { await api(`/jobs/${j._id}`, { method: 'PUT', body: { status: s } }); load(); };

  return (
    <div>
      <div className="head">
        <div><h1>My applications</h1><p className="muted">{jobs ? `${jobs.length} showing` : 'Loading...'}</p></div>
        <button className="btn" onClick={() => setModal({})}>+ Add application</button>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Search company, position or location" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All types</option><option>Internship</option><option>Job</option>
        </select>
      </div>
      <div className="chips">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${f} ${status === f ? 'on' : ''}`} onClick={() => setStatus(f)}>{f}</button>
        ))}
      </div>

      {!jobs ? <div className="loader" /> : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-art">🗂️</div>
          <h3>No applications found</h3>
          <p className="muted">Change your search or filters, or add a new application.</p>
        </div>
      ) : (
        <div className="cards">
          {jobs.map((j, i) => (
            <article className={`job ${j.status}`} key={j._id} style={{ '--d': `${Math.min(i, 8) * 50}ms` }}>
              <div className="job-top">
                <span className={`pill ${j.status}`}>{j.status}</span>
                <span className="muted small">{j.type}</span>
              </div>
              <h3>{j.position}</h3>
              <p className="company">{j.company}{j.location && <span className="muted"> - {j.location}</span>}</p>
              {j.notes && <p className="notes">{j.notes}</p>}
              <p className="muted small">Applied {fmt(j.appliedDate)}</p>
              <div className="job-actions">
                <select value={j.status} onChange={(e) => quickStatus(j, e.target.value)} aria-label="Change status">
                  {FILTERS.slice(1).map((s) => <option key={s}>{s}</option>)}
                </select>
                {j.link && <a className="btn ghost sm" href={j.link} target="_blank" rel="noreferrer">Open</a>}
                <button className="btn ghost sm" onClick={() => setModal(j)}>Edit</button>
                <button className="btn danger sm" onClick={() => remove(j)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {modal && <JobModal job={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}
    </div>
  );
}
