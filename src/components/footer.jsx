import React, { useState } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import { BsFillChatTextFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { NavLink } from 'react-router-dom';

function Footer() {
  const recipientId = localStorage.getItem('lastRecipientId');
  const [showModal, setShowModal] = useState(false);

  const handleChatClick = () => {
    if (!recipientId) {
      setShowModal(true);
    }
  };

  return (
    <>
      <footer style={footerStyle.container}>
        <div style={footerStyle.iconContainer}>
          <NavLink to="/home" style={{textDecoration: 'none'}}>
            {({ isActive }) => (
              <>
                <IoHomeSharp
                  style={{
                    ...footerStyle.icon,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                />
                <p
                  style={{
                    ...footerStyle.p,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                >
                  Home
                </p>
              </>
            )}
          </NavLink>
        </div>

        <div style={footerStyle.iconContainer}>
          <NavLink to="/food-dashboard" style={{textDecoration: 'none'}}>
            {({ isActive }) => (
              <>
                <MdFastfood
                  style={{
                    ...footerStyle.icon,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                />
                <p
                  style={{
                    ...footerStyle.p,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                >
                  Food
                </p>
              </>
            )}
          </NavLink>
        </div>

        <div style={footerStyle.iconContainer}>
          <NavLink to="/medical" style={{textDecoration: 'none'}}>
            {({ isActive }) => (
              <>
                <GiHealthNormal
                  style={{
                    ...footerStyle.icon,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                />
                <p
                  style={{
                    ...footerStyle.p,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                >
                  Health
                </p>
              </>
            )}
          </NavLink>
        </div>

        <div style={footerStyle.iconContainer}>
          {recipientId ? (
            <NavLink to={`/chat/${recipientId}`} style={{textDecoration: 'none'}}>
              {({ isActive }) => (
                <>
                  <BsFillChatTextFill
                    style={{
                      ...footerStyle.icon,
                      color: isActive ? '#4CAF50' : 'gray',
                    }}
                  />
                  <p
                    style={{
                      ...footerStyle.p,
                      color: isActive ? '#4CAF50' : 'gray',
                    }}
                  >
                    Chat
                  </p>
                </>
              )}
            </NavLink>
          ) : (
        <div onClick={handleChatClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <BsFillChatTextFill
            style={{
              ...footerStyle.icon,
              color: 'gray'
            }}
          />
          <p style={{ ...footerStyle.p, color: 'gray' }}>Chat</p>
        </div>

          )}
        </div>

        <div style={footerStyle.iconContainer}>
          <NavLink to="/user-profile" style={{textDecoration: 'none'}}>
            {({ isActive }) => (
              <>
                <FaUser
                  style={{
                    ...footerStyle.icon,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                />
                <p
                  style={{
                    ...footerStyle.p,
                    color: isActive ? '#4CAF50' : 'gray',
                  }}
                >
                  Profile
                </p>
              </>
            )}
          </NavLink>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div style={modalStyle.overlay}>
          <div style={modalStyle.modal}>
            <p>Please select a chat first.</p>
            <button onClick={() => setShowModal(false)} style={modalStyle.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;

// Footer styles
const footerStyle = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    color: 'black',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.5rem 0',
  },
  icon: {
    fontSize: '26px',
    // fontWeight: 'bold',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  p: {
    margin: 0,
    fontSize: '12px',
  }
};

// Modal styles
const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
