import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { token, login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (token) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await (isLogin ? login({ email: f.email, password: f.password }) : register(f));
      nav('/');
    } catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
        <div className="logo big">Trackr<i /></div>
        <h1>Every application, one clear pipeline.</h1>
        <p>Log where you applied, move each one from Applied to Offer, and see how your search is really going.</p>
        <div className="chips-demo">
          <span className="pill Applied">Applied</span><span className="pill Interview">Interview</span>
          <span className="pill Offer">Offer</span>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-top"><ThemeToggle /></div>
        <form onSubmit={submit} key={mode} className="slide-in">
          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">{isLogin ? 'Log in to see your applications.' : 'It takes less than a minute.'}</p>
          {!isLogin && <label>Full name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>}
          <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          <label>Password<input type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
          {err && <p className="error">{err}</p>}
          <button className="btn wide" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Log in' : 'Register'}</button>
          <p className="muted center">
            {isLogin ? 'New here? ' : 'Already registered? '}
            <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
