import React from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthenticationContext/Authcontext';

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute