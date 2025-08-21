import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import './index.css'
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
import Profilepage from './Pages/Profilepage'
import UserProfile from './Pages/UserPage'
import Findadoctor from './Medical/Findadoctor'
import ProtectedRoute from './Pages/ProtectedRoute'
import DoctorProfileCard from './Medical/DoctorCard'
import DoctorRegistrationForm from './Pages/DoctorRegistrationForm'
import RolesPage from './Pages/RolesPage'
import PaymentSuccess from './Medical/PaymentSuccess'

function App() {
  return (
    <>
    {/* UpdateAppModal */}
    <UpdateNoticeModal />
      <Routes>
        <Route path='/' element={<Layouts />}>
        <Route index element={<SplashCarousel />} />
          {/* Show language screen first */}
          <Route path='role' element={<RolesPage />} />
          <Route path='language' element={<Language />} />

          {/* Payment route */}
          <Route path='payment-success' element={<PaymentSuccess />} />

          {/*Public route no Auth routes needed */}
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Signin />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='verify-otp' element={<VerifyOTP />} />
          <Route path='reset-password' element={<ResetPassword />} />
          <Route path='doctor-registration' element = {<DoctorRegistrationForm /> } />

          {/* Protected routes */}
          <Route path='welcome' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='location' element={<ProtectedRoute><Location /></ProtectedRoute>} />
          <Route path='profile' element={<ProtectedRoute><Profilepage /></ProtectedRoute>} />
          <Route path='congratulations' element={<ProtectedRoute><Congratulations /></ProtectedRoute>} />
          <Route path='home' element={<ProtectedRoute><GeneralHomePage /></ProtectedRoute>} />
          <Route path='about-us' element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path='user-profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Food Form */}
          <Route path='food-form' element={<ProtectedRoute><FoodForms /></ProtectedRoute>} />
          <Route path='food-dashboard' element={<FoodSubmissionDashboard />} />

          {/* chatting platform */}
          <Route path="/chat/:recipientId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path='donor-profile' element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
          <Route path='user-request' element={<ProtectedRoute><UserRequests /></ProtectedRoute>} />

          {/* Medical route */}
          <Route path='medical' element={<ProtectedRoute><Findadoctor /></ProtectedRoute>} />
          <Route path='doctor-profile' element={<ProtectedRoute><DoctorProfileCard /></ProtectedRoute>} />

          {/* Catch-all route */}
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
