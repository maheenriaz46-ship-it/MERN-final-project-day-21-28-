import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Switch theme" title="Switch theme">
      <span className={'knob ' + theme}>{theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  );
}
