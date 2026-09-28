import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

function Count({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      start ??= t;
      const p = Math.min((t - start) / 1000, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => { api('/jobs/stats').then(setS).catch(() => {}); }, []);
  if (!s) return <div className="loader" />;

  const pct = (n) => (s.total ? Math.round((n / s.total) * 100) : 0);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const cards = [
    ['Total applications', s.total, 'total'],
    ['Interviews', s.Interview, 'Interview'],
    ['Rejections', s.Rejected, 'Rejected'],
    ['Offers', s.Offer, 'Offer'],
  ];

  return (
    <div className="dash">
      <div className="head">
        <div>
          <h1>{greet}, {user.name.split(' ')[0]}</h1>
          <p className="muted">
            {s.total ? `${pct(s.Interview + s.Offer)}% of your applications reached the interview stage or beyond.` : 'Add your first application to start tracking.'}
          </p>
        </div>
        <Link to="/jobs" className="btn">Manage applications</Link>
      </div>

      <div className="stats">
        {cards.map(([label, val, key], i) => (
          <div className={`stat ${key}`} key={label} style={{ '--d': `${i * 90}ms` }}>
            <span className="stat-label">{label}</span>
            <strong><Count to={val} /></strong>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head"><h3>Your pipeline</h3><span className="muted">{s.total} in total</span></div>
        <div className="pipeline">
          {s.total === 0 && <span className="seg empty" style={{ width: '100%' }} />}
          {STATUSES.map((k) => s[k] > 0 && (
            <span key={k} className={`seg ${k}`} style={{ '--w': `${pct(s[k])}%` }} title={`${k}: ${s[k]}`} />
          ))}
        </div>
        <div className="legend">
          {STATUSES.map((k) => <span key={k}><i className={`dot ${k}`} />{k} <b>{s[k]}</b></span>)}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h3>Latest applications</h3><Link to="/jobs" className="link">See all</Link></div>
        {s.recent.length === 0 ? (
          <p className="muted">Nothing here yet. Head to My applications and add one.</p>
        ) : (
          <ul className="recent">
            {s.recent.map((j) => (
              <li key={j._id}>
                <div><b>{j.position}</b><span className="muted"> at {j.company}</span></div>
                <span className={`pill ${j.status}`}>{j.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
