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
  localStorage.clear(); // clear previous user data first

  setUser({ name, email, role });
  setIsLoggedIn(true);
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('role', role);
  localStorage.setItem('userPhone', phone); // ✅ Save phone directly here

  // Set userId and/or donorId based on role
  localStorage.setItem('userId', email); // Set for both roles

  if (role === 'donor') {
    localStorage.setItem('donorId', email);
    localStorage.removeItem('userId');
  } else {
    localStorage.setItem('userId', email);
    localStorage.removeItem('donorId');
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
