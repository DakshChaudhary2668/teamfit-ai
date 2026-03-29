import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionCode, setSessionCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const savedUser = localStorage.getItem('teamfit_user');
    const savedToken = localStorage.getItem('teamfit_token');
    const savedSession = localStorage.getItem('teamfit_session_id');
    const savedCode = localStorage.getItem('teamfit_session_code');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    if (savedSession) setSessionId(savedSession);
    if (savedCode) setSessionCode(savedCode);
    setLoading(false);
  }, []);

  function loginUser(userData, tokenValue) {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('teamfit_user', JSON.stringify(userData));
    localStorage.setItem('teamfit_token', tokenValue);
  }

  function setSession(id, code) {
    setSessionId(id);
    setSessionCode(code);
    localStorage.setItem('teamfit_session_id', id);
    localStorage.setItem('teamfit_session_code', code);
  }

  function clearSession() {
    setSessionId(null);
    setSessionCode(null);
    localStorage.removeItem('teamfit_session_id');
    localStorage.removeItem('teamfit_session_code');
  }

  function logout() {
    setUser(null);
    setToken(null);
    setSessionId(null);
    setSessionCode(null);
    localStorage.removeItem('teamfit_user');
    localStorage.removeItem('teamfit_token');
    localStorage.removeItem('teamfit_session_id');
    localStorage.removeItem('teamfit_session_code');
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      sessionId, sessionCode,
      loginUser, logout,
      setSession, clearSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
