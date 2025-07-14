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

  const login = ({ name, email, role }) => {
    setUser({ name, email, role });
    setIsLoggedIn(true);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('role', role);

      // Set userId and/or donorId based on role
     localStorage.setItem('userId', email); // Set for both roles
        if (role === 'donor') {
          localStorage.setItem('donorId', email);
        }

  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthcontextProvider;
export { AuthContext };
