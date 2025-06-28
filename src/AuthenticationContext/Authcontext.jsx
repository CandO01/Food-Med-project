import React, { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function AuthcontextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Load from localStorage on first mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    const savedEmail = localStorage.getItem('userEmail')
    if (savedName && savedEmail) {
      setUser({ name: savedName, email: savedEmail })
      setIsLoggedIn(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('userName', userData.name)
    localStorage.setItem('userEmail', userData.email)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthcontextProvider
export { AuthContext }
