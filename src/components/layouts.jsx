import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './footer'

function Layouts() {
  const location = useLocation()

  // Define routes that should NOT have the footer
  const noFooterRoutes = ['/login', '/signup', '/forgot-password']

  const hideFooter = noFooterRoutes.includes(location.pathname)

  return (
    <>
      <Outlet />
      {!hideFooter && <Footer />} {/* Only show footer if not on excluded routes */}
    </>
  )
}

export default Layouts
