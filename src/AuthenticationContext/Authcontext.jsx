import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthcontextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('role'); // <-- Added

    if (savedName && savedEmail && savedRole) {
      setUser({ name: savedName, email: savedEmail, role: savedRole }); // Include role
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('role', userData.role); // Save role
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthcontextProvider;
export { AuthContext };
