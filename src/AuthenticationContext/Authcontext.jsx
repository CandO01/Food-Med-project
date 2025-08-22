// // src/AuthenticationContext/AuthcontextProvider.jsx
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthcontextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Load saved user from localStorage
  useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');
    const _id = localStorage.getItem('userId');
    const canDonate = localStorage.getItem('canDonate') === 'true';
    const canRequest = localStorage.getItem('canRequest') === 'true'


//     // New features added
    if(_id && name && email){
      setUser({ _id, name, email, phone, canDonate, canRequest });
      setIsLoggedIn(true);
    }
  }, []);

    const login = ({_id, name, email, phone, canDonate, canRequest }) => {
  localStorage.clear(); // Clear any old data

  setUser({ _id, name, email, phone, canDonate, canRequest });
  setIsLoggedIn(true);

//   // Save user data to localStorage
  localStorage.setItem('userId', _id);
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPhone', phone);
  // localStorage.setItem('userId', email);

  localStorage.setItem('canDonate', canDonate);
   localStorage.setItem('canRequest', canRequest);

//   // Always set userId
  localStorage.setItem('userId', email);

//   // If user is a donor, also set donorId and donorEmail
  if (canDonate) {
    localStorage.setItem('donorId', _id);
    localStorage.setItem('donorId', email);
    localStorage.setItem('donorEmail', email);
  } else {
    localStorage.removeItem('donorId');
    localStorage.removeItem('donorEmail');
  }
};

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
    localStorage.removeItem("lastSelectedContact");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthcontextProvider;
export { AuthContext };

// // src/AuthenticationContext/AuthcontextProvider.jsx
// import React, { createContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// function AuthcontextProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Restore saved user/doctor from localStorage
//   useEffect(() => {
//     const _id = localStorage.getItem('userId');
//     const name = localStorage.getItem('userName');
//     const email = localStorage.getItem('userEmail');
//     const phone = localStorage.getItem('userPhone');
//     const role = localStorage.getItem('role');
//     const canDonate = localStorage.getItem('canDonate') === 'true';
//     const canRequest = localStorage.getItem('canRequest') === 'true';
//     const specialty = localStorage.getItem('specialty');
//     const image = localStorage.getItem('image');

//     if (_id && name && email) {
//       setUser({ _id, name, email, phone, role, canDonate, canRequest, specialty, image });
//       setIsLoggedIn(true);
//     }
//   }, []);

//   // Login function (handles both users and doctors)
//   const login = ({ _id, name, email, phone, canDonate, canRequest, role, specialty, image }) => {
//     localStorage.clear(); // Clear previous data

//     setUser({ _id, name, email, phone, role, canDonate, canRequest, specialty, image });
//     setIsLoggedIn(true);

//     localStorage.setItem('userId', _id);
//     localStorage.setItem('userName', name);
//     localStorage.setItem('userEmail', email);
//     localStorage.setItem('userPhone', phone);
//     localStorage.setItem('role', role);

//     if (role === 'user') {
//       localStorage.setItem('canDonate', canDonate);
//       localStorage.setItem('canRequest', canRequest);

//       if (canDonate) {
//         localStorage.setItem('donorId', _id);
//         localStorage.setItem('donorEmail', email);
//       }
//     }

//     if (role === 'doctor') {
//       localStorage.setItem('specialty', specialty || '');
//       localStorage.setItem('image', image || '');
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     setIsLoggedIn(false);
//     localStorage.clear();
//     localStorage.removeItem('lastSelectedContact');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthcontextProvider;
// export { AuthContext };
