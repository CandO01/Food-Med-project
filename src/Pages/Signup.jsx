import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function displayModal(){
    setShowModal(prev=>{
      return prev = !prev
    })
  }

   function removeModal(){
    setShowModal(prev=> !prev)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('signing-up')
    setMessage('')
    setError(null)

    try {
      const res = await fetch('https://foodmed-server.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)
      setMessage(data.message || 'Thank you for signing up successfully! Redirecting you to the login section')
      setStatus('done')
    // Delay 3 seconds before redirecting
      setTimeout(() => {
        navigate('/login')
      }, 4500)
     
    } catch (err) {
      setError(err.message)
      setStatus('failed')
    }
  }

 return (
    <div className="signup-form">
      <h1 className='heading-one'>{t('signup.heading')}</h1>

      {success && <Confetti />}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className='signup-container' onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder={t('signup.fullName')}
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('signup.email')}
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('signup.password')}
          onChange={handleChange}
          value={form.password}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder={t('signup.confirm')}
          onChange={handleChange}
          value={form.confirm}
          required
        />

        <p className='have-account'>
          {t('signup.haveAccount')}<Link to="/login">{t('signup.login')}</Link>
        </p>

        <div className='terms-and-condi'>
          {t('signup.terms')} <span style={{fontWeight: 700}}><div style={{display: 'inline-block'}} onClick={displayModal}>{t('signup.learnMore')}</div></span>
        </div>

        <button type="submit" disabled={status === 'signing-up'}>
          {status === 'signing-up' ? t('signup.signingUp') : t('signup.signup')}
        </button>
      </form>
          {/* Terms and conditions modal */}
      { showModal && <div className="modal">
        <div style={{display: 'flex', position: 'static'}}>
           <h1 style={{fontSize: 25}}>Terms and Conditions for FoodMed Application</h1>
           <div style={{color: 'red', fontSize: 22, fontWeight: 700}} onClick={removeModal}>X</div>
        </div>
       <hr />
       <p>Terms and Conditions for FoodMed Application
         Last updated: 30th June, 2025

          Please read these Terms and Conditions ("Terms") carefully before using the FoodMed application ("App", "Service") operated by FoodMed Technologies ("we", "our", or "us"). By accessing or using the App, you agree to be bound by these Terms.

          If you do not agree with any part of the terms, please do not use our Service.
          <br />
          <br />
          <strong>1. Eligibility</strong> 
          By using the App, you affirm that you are at least 18 years old or are using it under the supervision of a parent or legal guardian. You also confirm that any information you provide is accurate and truthful.
          <br />
          <br />
          <strong>2. Purpose of the App</strong> 
          FoodMed is a digital platform that provides certification, verification, and safety ratings for food and medicinal products. The App may offer:

          Product certification badges

          Ingredient analysis

          Regulatory compliance reports

          Health alerts and recalls

          Vendor ratings and reviews

          This service is intended for informational purposes only and should not be considered as a substitute for professional medical or legal advice.
          <br />
          <br />
          <strong>3. User Obligations</strong> 
          As a user, you agree to:

          Use the App in accordance with applicable laws and regulations

          Not submit false or misleading information

          Refrain from distributing harmful or unauthorized content

          Respect intellectual property rights of others
          <br />
          <br />
          <strong>4. Certifications & Disclaimers</strong> 
          All certifications and verifications provided by FoodMed are based on data available at the time of review, including third-party regulatory bodies and public health sources.

          We do not guarantee:

          The complete accuracy or legality of every certified product

          That a certified product is suitable for all users or medical conditions

          Users are advised to consult a qualified medical or food safety professional when making health-related decisions.
          <br />
          <br />
          <strong>5. Intellectual Property</strong> 
          All content, design elements, software, and logos within the App are the intellectual property of FoodMed Technologies and are protected by applicable copyright, trademark, and patent laws. You may not copy, distribute, or reuse our materials without written permission.
          <br />
          <br />
          <strong>6. Privacy Policy</strong> 
          Your use of the App is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data. By using the App, you consent to such collection and use.
          <br />
          <br />
          <strong>7. Limitation of Liability</strong> 
          FoodMed shall not be held liable for:

          Any indirect or consequential damages

          Medical issues arising from product use

          Loss of data, business interruption, or legal actions related to product certifications

          Use the app at your own risk.
          <br />
          <br />
          <strong>8. Third-Party Links</strong> 
          Our App may contain links to third-party websites or products. We are not responsible for the accuracy, legality, or safety of any content or services offered by such third parties.
          <br />
          <br />
          <strong>9. Account Termination</strong> 
          We reserve the right to suspend or terminate user accounts for violations of these Terms, including fraudulent certifications, misuse of platform features, or legal violations.
          <br />
          <br />
          <strong>10. Changes to Terms</strong> 
          We may modify these Terms at any time. You will be notified of any significant changes. Continued use of the App after such updates constitutes your acceptance of the new Terms.
          <br />
          <br />
          <strong>11. Governing Law</strong> 
          These Terms shall be governed and interpreted in accordance with the laws of Nigeria, without regard to its conflict of law principles.
          <br />
          <br />
          <strong>12. Contact Us</strong> 
          For questions or concerns regarding these Terms, please contact: <br />

          📧 <strong>Email:</strong> support@foodmed.app <br />
          📞 <strong>Phone:</strong> 08130841061 <br />
          🏢 <strong>Address:</strong> Techwitsclan head office Victoria Island Lagos.
        </p>
      </div>}
    </div>
  )
}

export default Signup
