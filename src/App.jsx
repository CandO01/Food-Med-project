import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layouts from './components/FormLayouts'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import ForgotPassowrd from './Pages/ForgotPassowrd'
import FormLayouts from './components/FormLayouts'


function App() {

  return (
    <Routes>
      <Route path='' element={<Layouts />}>
        <Route path='/' element={<FormLayouts />}>
        {/* For login form */}
          <Route index element={<Navigate />} />
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Signin />} />
          <Route path='forgot-password' element={<ForgotPassowrd />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App