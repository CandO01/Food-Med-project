import React, { createContext, useState } from 'react'

const AuthContext = createContext()
function AuthcontextProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function login(){
    setIsLoggedIn(true)
  }

  function logout(){
    setIsLoggedIn(false)
  }
  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthcontextProvider

export { AuthContext }