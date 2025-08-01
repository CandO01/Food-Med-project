import React from 'react'
import {  Routes, Route } from 'react-router-dom'
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
import FoodForms from './components/FoodForm/FoodDonorForms'
import FoodSubmissionDashboard from './components/FoodForm/FoodSubmissionDashboard'
import ChatPage from './Food & Med Page/Chat'
import DonorProfile from './components/FoodForm/DonorProfile'
import UserRequests from './components/FoodForm/UserRequestChat'
import UpdateNoticeModal from './components/UpdateNoticeModal'
import AboutUs from './Pages/AboutUs'
import Header from './components/header'
import Profilepage from './Pages/Profilepage'
import UserProfile from './Pages/UserPage'
import Findadoctor from './Medical/Findadoctor'

function App() {
  return (
    <>
    {/* UpdateAppModal */}
    <UpdateNoticeModal />
    <Header />
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
          <Route path='profile' element={<Profilepage />} />

          {/* Other pages */}
          <Route path='welcome' element={<Home />} />
          <Route path='location' element={<Location />} />
          <Route path='congratulations' element={<Congratulations />} />
          <Route path='home' element={<GeneralHomePage />} />
          <Route path='about-us' element={<AboutUs />} />
          <Route path='user-profile' element={<UserProfile />} />

          {/* Food Form */}
          <Route path='food-form' element={<FoodForms />} />
          <Route path='food-dashboard' element={<FoodSubmissionDashboard />} />

          {/* chatting platform */}
          <Route path="/chat/:recipientId" element={<ChatPage />} />
          <Route path='donor-profile' element={<DonorProfile />} />
          <Route path='user-request' element={<UserRequests />} />
          {/* <Route path='user-request' element={<UserRequests />} /> */}

          {/* Medical route */}
          <Route path='medical' element={<Findadoctor />} />

          {/* Catch-all route */}
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
