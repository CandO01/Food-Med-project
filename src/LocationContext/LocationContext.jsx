// src/context/LocationContext.js
import React, { createContext, useEffect, useState } from 'react';

 const LocationContext = createContext();

const userLocation = ({ children }) => {
  const [location, setLocation] = useState({ city: '', state: '', country: '' });

  const getStateAndCountry = async (lat, lng) => {
    const apiKey = 'bcf76bd4fc23494289ee2e6d7e01ce93';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const components = data.results[0].components;
      setLocation({
        city: components.city || '',
        state: components.state || '',
        country: components.country || '',
      });
    } catch (error) {
      console.error('🌍 Location fetch error:', error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getStateAndCountry(latitude, longitude);
      },
      (error) => {
        console.error('📍 Geolocation permission denied or error:', error);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export default userLocation;
export { LocationContext }


























// import React, { createContext, useState, useEffect } from 'react'

// const LocationContext = createContext()

// function UserLocation({children}) {
//   const [userCity, setUserCity] = useState('')
//   const [coords, setCoords] = useState(null)

//   useEffect(()=>{
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const lat = position.coords.latitude
//       const long = position.coords.longitude
//       setCoords({ lat, long })

//       try {
//         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`)

//         if(!response.ok) throw new Error('We are unable to proceed with your data')
        
//           const data = await response.json()
//           const displayCity = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
//           setUserCity(displayCity)
//       } catch (error) {
//         console.error('Failed to fetch city', error)
//         setUserCity('Unavailable city')
//       }
//     })
//   }, [])


//   return (
//     <LocationContext.Provider value={{userCity, coords}}>
//       {children}
//     </LocationContext.Provider>
//   )
// }

// export default UserLocation
// export { LocationContext }