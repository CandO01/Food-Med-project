import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthenticationContext/Authcontext'
import foodmedImg from '../assets/foodmed1.png'

function Signin() {
  const [loginForm, setLoginForm] = useState({ email: '', password: ''})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const { login } = React.useContext(AuthContext)


  function handleChange(e){
    const { name, value } = e.target
    setLoginForm(prev=>({
      ...prev, 
      [name]: value
    }))
  }

  //function to handle submit

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('logging')
    setError('')

    try {
      const res = await fetch('http://localhost:5223/login', {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      if(!res.ok){
        throw new Error('Please enter your valid email address and password')
      }
      const data = res.json()
      if(res.ok){
        login()
      }
    } catch (error) {
      
    }
  }


  return (
    <div className="signin-form">
      <div className='foodmed'>
        <img src={foodmedImg} alt="food med logo" />
         <h1>FOODMED</h1>
      </div>
      <h1>Welcome back Michael</h1>
      <form className='signin-container' onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={handleChange}
          value={loginForm.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
          value={loginForm.password}
          required
        />

        <button>Log in</button>
      </form>
      <div className="forgot-password">
        <Link to='/forgot-password'>Forgot password?</Link>
        <p>Not Michael<span>Switch account</span></p>
      </div>
    </div>
  )
}

export default Signin