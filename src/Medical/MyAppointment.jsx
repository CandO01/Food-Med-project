import React, { useEffect, useState } from "react";
import LoadingDots from "../AuthenticationContext/LoadingDots";
import { AuthContext } from "../AuthenticationContext/Authcontext";
import { Link } from "react-router-dom";
import { Phone, MessageCircle} from 'lucide-react'

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = React.useContext(AuthContext)

  // console.log(user)
  
  useEffect(() => {
    const patientId = user?._id
    console.log(patientId)
    if(!patientId){
      setError('Patient not logged in')
      setLoading(false)
  }
    async function fetchMyAppointments() {
      setLoading(true);
      try {
        const res = await fetch(`https://foodmed-firstserver-backup.onrender.com/appointment/patient/${patientId}`);

        const data = await res.json();
        console.log(data)
        if(!res.ok) throw new Error(data.error || 'Failed to fecth patient appointment')
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false);
      }
    }
    fetchMyAppointments();
  }, []);

  if (loading) return <LoadingDots center size={12} color="#4CAF50" />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>My Bookings</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments.</p>
      ) : (
        <ul style={styles.list}>
          {appointments.map((appt) => (
            <li key={appt._id} style={styles.card}>
              <p>
                <strong>Doctor:</strong> {appt.doctorName || "Unknown"}
              </p>
              <p>
                <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {appt.status}
              </p>

              {appt.doctorEmail && (
                <Link to={`/chat/${appt.doctorEmail}`}>
                  <button style={styles.button}>
                    <MessageCircle size={18} color="white" />
                    <span style={{color: 'white', fontWeight: '700'}}> Chat with {appt.doctorName || appt.doctorEmail}</span>
                    
                  </button>
                </Link>
              )}

              {appt.doctorPhone && (
                <a href={`tel:${appt.doctorPhone}`}>
                  <button style={styles.button}>
                    <Phone size={18} color="white"/> 
                    <span style={{color: 'white', fontWeight: '700'}}> Call</span>
                  </button>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyAppointments;

const styles = {
  container: { padding: "20px" },
  list: { listStyle: "none", padding: 0 },
  card: {
    border: "1px solid #ccc",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  button: { marginRight: "8px", cursor: "pointer", border: 'none', padding: '10px', borderRadius: '6px', backgroundColor: '#4CAF50' },
};
