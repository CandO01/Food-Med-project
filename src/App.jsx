import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layouts from './components/layouts'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import ForgotPassword from './Pages/ForgotPassowrd'
import Home from './Pages/Home' // ✅ make sure you create and import this
import VerifyOTP from './Pages/VerifyOtp'
import ResetPassword from './Pages/ResetPassword'

function App() {
  return (
    <Routes>
      {/* Main layout wrapper */}
      <Route path='/' element={<Layouts />}>
        
        {/* Default redirect to login page */}
        <Route index element={<Navigate to='signup' />} />
        
        {/* Auth routes */}
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Signin />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='verify-otp' element={<VerifyOTP />} />
        <Route path='reset-password' element={<ResetPassword />} />
        
        {/* Protected/Home page after login */}
        <Route path='home' element={<Home />} />
        
      </Route>
    </Routes>
  )
}

export default App
