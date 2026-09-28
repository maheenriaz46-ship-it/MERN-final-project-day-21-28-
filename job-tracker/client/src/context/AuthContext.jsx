import { createContext, useContext, useState } from 'react';
import { api } from '../api.js';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const save = (d) => {
    localStorage.setItem('token', d.token);
    localStorage.setItem('user', JSON.stringify(d.user));
    setToken(d.token);
    setUser(d.user);
  };
  const login = async (body) => save(await api('/auth/login', { method: 'POST', body }));
  const register = async (body) => save(await api('/auth/register', { method: 'POST', body }));
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ token, user, login, register, logout }}>{children}</Ctx.Provider>;
}
