import React from 'react';
import ReactDOM from 'react-dom';

function SchedulePage() {
  const days = ['Sun 12','Mon 12','Tue 12','Wed 12','Thu 12'];
  const appointments = [
    { time: '08:00 AM', name: 'Gabriel Ezekiel',   color: '#e3f2fd' },
    { time: '09:00 AM', name: 'Michael Ogwu',      color: '#fce4ec' },
    { time: '09:20 AM', name: 'Destiny Selie',      color: '#e8f5e9' },
    { time: '10:00 AM', name: 'Maryann Nwagu',      color: '#fff3e0' },
    { time: '11:40 AM', name: 'Gift Nwankwo',       color: '#f3e5f5' },
    { time: '07:00 PM', name: 'Amobi Samuel',       color: '#e1f5fe' },
    { time: '08:00 PM', name: 'Solomon Sokoso',     color: '#fbe9e7' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Schedules</h1>
          <p style={styles.date}>13 September, 2025</p>
        </div>
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          style={styles.avatar}
        />
      </header>

      {/* Days Navigation */}
      <nav style={styles.daysNav}>
        {days.map((d, i) => (
          <button
            key={i}
            style={{
              ...styles.dayButton,
              ...(i === 0 ? styles.activeDay : {})
            }}
          >
            {d}
          </button>
        ))}
      </nav>

      {/* Appointment List */}
      <ul style={styles.list}>
        {appointments.map((a, i) => (
          <li
            key={i}
            style={{
              ...styles.item,
              backgroundColor: a.color
            }}
          >
            <span style={styles.time}>{a.time}</span>
            <span style={styles.name}>{a.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '2rem auto',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#0052cc',
    color: '#fff'
  },
  title: { margin: 0, fontSize: '1.25rem' },
  date: { margin: 0, fontSize: '0.9rem' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%'
  },
  daysNav: {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#e6f0ff',
    padding: '0.5rem 0'
  },
  dayButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#555'
  },
  activeDay: {
    color: '#0052cc',
    borderBottom: '2px solid #0052cc'
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: 6
  },
  time: { fontWeight: 'bold', fontSize: '0.95rem' },
  name: { color: '#333', fontSize: '0.95rem' }
};

ReactDOM.render(<SchedulePage />, document.getElementById('root'));