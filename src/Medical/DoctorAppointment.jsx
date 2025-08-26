import React, { useEffect, useState } from "react";
import LoadingDots from "../AuthenticationContext/LoadingDots";
import { AuthContext } from "../AuthenticationContext/Authcontext";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = React.useContext(AuthContext)
  
  useEffect(() => {
     const doctorId = user?._id
    if(!doctorId){
      setError('Doctor not logged in')
      setLoading(false)
      return;
    }

    async function fetchAppointments() {
      setLoading(true);
      try {
        const res = await fetch(`https://foodmed-firstserver-backup.onrender.com/appointment/doctor/${doctorId}`);

        const data = await res.json();

        console.log(data)

        if(!res.ok) throw new Error(data.error || 'Failed to fetch doctor appointment')
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  if (loading) return <LoadingDots center size={12} color="#4CAF50" />;
   if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>My Appointments (Doctor)</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul style={styles.list}>
          {appointments.map((appt) => (
            <li key={appt._id} style={styles.card}>
              <p>
                <strong>Patient:</strong> {appt.patientName || appt.patientEmail}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appt.date).toLocaleDateString()}
              </p>

              {appt.patientEmail && (
                <Link to={`/chat/${appt.patientEmail}`}>
                  <button style={styles.button}>
                    <MessageCircle size={18} color="white" />
                    <span style={{color: 'white', fontWeight: '700'}}> Chat with {appt.patientName || appt.patientEmail}
                    </span> 
                  </button>
                </Link>
              )}

              {appt.patientPhone && (
                <a href={`tel:${appt.patientPhone}`}>
                  <button style={styles.button}>  
                    <Phone size={18} color="white" /> 
                    <span style={{color: 'white', fontWeight: '700'}}>
                       Call Patient
                      </span>
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

export default DoctorAppointments;

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
