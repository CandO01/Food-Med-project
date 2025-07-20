import React from 'react'
import construction from '../assets/construction.gif'
function Findadoctor() {
  return (
    <>
      <img style={{textAlign: 'center', width: '400px'}} src={construction} alt="website under construction animation"  />
      <div className="marquee-container">
        <div className="marquee-text">
          This website page is currently undergoing construction, please come back later. Thank you for your patience and understanding. We love you all ❤️
        </div>
     </div>
    </>
  )
}

export default Findadoctor