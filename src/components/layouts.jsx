import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './footer'
import Header from './header'

function Layouts() {
  const location = useLocation()

  // Define routes that should NOT have the footer
  const noFooterRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-otp', '/home', '/location', '/', '/congratulations']

  const hideFooter = noFooterRoutes.includes(location.pathname)

  return (
    <> 
      <Header />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />} {/* Only show footer if not on excluded routes */}
    </>
  )
}

export default Layouts
