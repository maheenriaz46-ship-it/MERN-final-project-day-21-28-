import { useState } from 'react';
import { api } from '../api.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function JobModal({ job, onClose, onSaved }) {
  const editing = !!job?._id;
  const [f, setF] = useState({
    company: job?.company || '', position: job?.position || '', location: job?.location || '',
    type: job?.type || 'Internship', status: job?.status || 'Applied',
    appliedDate: (job?.appliedDate || today()).slice(0, 10), link: job?.link || '', notes: job?.notes || '',
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await api(editing ? `/jobs/${job._id}` : '/jobs', { method: editing ? 'PUT' : 'POST', body: f });
      onSaved();
    } catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="modal" onMouseDown={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{editing ? 'Edit application' : 'Add application'}</h2>
        <div className="grid2">
          <label>Company<input required value={f.company} onChange={set('company')} placeholder="e.g. Systems Ltd" /></label>
          <label>Position<input required value={f.position} onChange={set('position')} placeholder="e.g. MERN Intern" /></label>
          <label>Location<input value={f.location} onChange={set('location')} placeholder="Remote / Islamabad" /></label>
          <label>Applied on<input type="date" value={f.appliedDate} onChange={set('appliedDate')} /></label>
          <label>Type
            <select value={f.type} onChange={set('type')}><option>Internship</option><option>Job</option></select>
          </label>
          <label>Status
            <select value={f.status} onChange={set('status')}>
              {['Applied', 'Interview', 'Rejected', 'Offer'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label>Job link<input value={f.link} onChange={set('link')} placeholder="https://..." /></label>
        <label>Notes<textarea rows="3" value={f.notes} onChange={set('notes')} placeholder="Contact person, interview date, salary..." /></label>
        {err && <p className="error">{err}</p>}
        <div className="row end">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add application'}</button>
        </div>
      </form>
    </div>
  );
}
