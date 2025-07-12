import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const LocationMap = () => {
  const [position, setPosition] = useState(null);
  const [city, setCity] = useState('Fetching location...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);

        // Fetch city name using reverse geocoding
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json();
          const displayCity = data.address?.city || data.address?.town || data.address?.village || 'Unknown location';
          setCity(displayCity);
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          setCity('Location unavailable');
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setCity('Permission denied');
      }
    );
  }, []);

  return (
    <div>
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Current City: {city}</p>
      <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
        {position ? (
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={position}
              icon={L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
              })}
            >
              <Popup>You are here!</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Getting location...</p>
        )}
      </div>
    </div>
  );
};

export default LocationMap;



































// // LocationMap.js
// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// const LocationMap = () => {
//   const [position, setPosition] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setPosition([pos.coords.latitude, pos.coords.longitude]);
//       },
//       (err) => {
//         console.error('Location access denied:', err);
//       }
//     );
//   }, []);

//   return (
//     <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
//       {position ? (
//         <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={position} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" })}>
//             <Popup>You are here!</Popup>
//           </Marker>
//         </MapContainer>
//       ) : (
//         <p>Getting location...</p>
//       )}
//     </div>
//   );
// };

// export default LocationMap;
