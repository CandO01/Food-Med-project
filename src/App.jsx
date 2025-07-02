import React from 'react'
import {  Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import Layouts from './components/layouts'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import ForgotPassword from './Pages/ForgotPassowrd'
import Home from './Pages/Home'
import VerifyOTP from './Pages/VerifyOtp'
import ResetPassword from './Pages/ResetPassword'
import Location from './Pages/Location/Location'
import Language from './Pages/Location/Language'
import Congratulations from './Pages/Congratulations'
import GeneralHomePage from './Food & Med Page/GeneralHomePage'
import SplashCarousel from './SplashCarousel/SplashCarousel'
import FoodForms from './components/FoodForm/FoodForms'
import FoodSubmissionDashboard from './components/FoodSubmissionDashboard'

function App() {
  return (
      <Routes>
        <Route path='/' element={<Layouts />}>
        <Route index element={<SplashCarousel />} />
          {/* Show language screen first */}
          <Route path='language' element={<Language />} />

          {/* Auth routes */}
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Signin />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='verify-otp' element={<VerifyOTP />} />
          <Route path='reset-password' element={<ResetPassword />} />

          {/* Other pages */}
          <Route path='home' element={<Home />} />
          <Route path='location' element={<Location />} />
          <Route path='congratulations' element={<Congratulations />} />
          <Route path='landing-page' element={<GeneralHomePage />} />

          {/* Food Form */}
          <Route path='food-form' element={<FoodForms />} />
          <Route path='food-dashboard' element={<FoodSubmissionDashboard />} />
        </Route>
      </Routes>
  )
}

export default App
