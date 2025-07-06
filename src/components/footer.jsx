import React from 'react'
import { IoHomeSharp } from "react-icons/io5";
import { BsFillChatTextFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={footerStyle.container}>
      <div style={footerStyle.iconContainer}>
        <Link to="/landing-page">
          <IoHomeSharp style={footerStyle.icon} />
        </Link>
        <p style={footerStyle.p}>Home</p>
      </div>
      <div style={footerStyle.iconContainer}>
        <Link to="/food-dashboard">
          <MdFastfood style={footerStyle.icon} />
        </Link>
        <p style={footerStyle.p}>Food</p>
      </div>
      <div style={footerStyle.iconContainer}>
        <Link to="/health">
          <GiHealthNormal style={footerStyle.icon} />
        </Link>
        <p style={footerStyle.p}>Health</p>
      </div>
      <div style={footerStyle.iconContainer}>
        <Link to="/chat">
          <BsFillChatTextFill style={footerStyle.icon} />
        </Link>
        <p style={footerStyle.p}>Chat</p>
      </div>
      <div style={footerStyle.iconContainer}>
        <Link to="/donor-request-dashboard">
          <FaUser style={footerStyle.icon} />
        </Link>
        <p style={footerStyle.p}>Profile</p>
      </div>
    </footer>
  )
}

export default Footer

const footerStyle = {
  container : {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#1a1a1a',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.5rem 0',
    background: 'orange'
  },
  icon: {
    fontSize: '26px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  p: {
    margin: 0,
    fontSize: '12px',
    color: 'white',
  }

 }
