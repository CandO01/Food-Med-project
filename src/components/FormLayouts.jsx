import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Footer from './footer'
function FormLayouts() {
  return (
    <div className='body-container'>
      <main>
       <Outlet />
      </main>
    </div>
  )
}

export default FormLayouts