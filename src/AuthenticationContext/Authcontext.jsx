import React, { createContext, useState } from 'react'

const AuthContext = createContext()

function AuthcontextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)             // e.g. { name, email }
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthcontextProvider
export { AuthContext }
