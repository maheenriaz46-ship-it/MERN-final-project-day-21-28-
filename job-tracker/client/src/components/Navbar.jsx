import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <div className="logo">Trackr<i /></div>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/jobs">My applications</NavLink>
      </nav>
      <div className="nav-right">
        <span className="hello">{user?.name?.split(' ')[0]}</span>
        <ThemeToggle />
        <button className="btn ghost sm" onClick={() => { logout(); nav('/login'); }}>Log out</button>
      </div>
    </header>
  );
}
