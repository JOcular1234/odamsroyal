// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [role, setRole] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // On mount, sync with localStorage
//     setRole(localStorage.getItem('admin_role'));
//     setToken(localStorage.getItem('admin_token'));
//     setLoading(false);
//   }, []);

//   const login = (token, role) => {
//     localStorage.setItem('admin_token', token);
//     localStorage.setItem('admin_role', role);
//     setToken(token);
//     setRole(role);
//   };

//   const logout = () => {
//     localStorage.removeItem('admin_token');
//     localStorage.removeItem('admin_role');
//     setToken(null);
//     setRole(null);
//   };

//   return (
//     <AuthContext.Provider value={{ role, token, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


// frontend/src/context/AuthContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, sync with localStorage
    setRole(localStorage.getItem('admin_role'));
    setUsername(localStorage.getItem('admin_username'));
    setToken(localStorage.getItem('admin_token'));
    setLoading(false);
  }, []);

  const login = (token, role, username) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_role', role);
    localStorage.setItem('admin_username', username);
    setToken(token);
    setRole(role);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_username');
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ role, username, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}