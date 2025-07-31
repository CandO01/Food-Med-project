// src/AuthenticationContext/AuthcontextProvider.jsx
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthcontextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load saved user from localStorage
  useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (name && email && role) {
      setUser({ name, email, role });
      setIsLoggedIn(true);
    }
  }, []);

    const login = ({ name, email, role, phone }) => {
  localStorage.clear(); // Clear any old data

  setUser({ name, email, role });
  setIsLoggedIn(true);

  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('role', role);
  localStorage.setItem('userPhone', phone);

  // Always set userId
  localStorage.setItem('userId', email);

  // If user is a donor, also set donorId and donorEmail
  if (role === 'donor') {
    localStorage.setItem('donorId', email);
    localStorage.setItem('donorEmail', email);
    localStorage.setItem('role', role);
  } else {
    localStorage.removeItem('donorId');
    localStorage.removeItem('donorEmail');
    localStorage.removeItem('role');
  }
};

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
    localStorage.removeItem("lastSelectedContact");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthcontextProvider;
export { AuthContext };


