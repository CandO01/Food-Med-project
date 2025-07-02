import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>TODAYS TIP</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Latest tip</h2>
        <div style={styles.tipCard}>
          <img
            src="https://via.placeholder.com/300x200"
            alt="Recharge Yourself"
            style={styles.tipImage}
          />
          <p style={styles.tipLabel}>RECHARGE YOURSELF</p>
        </div>
        <h3 style={styles.tipTitle}>
          Prioritize Rest and Recharge: The Foundation of Recovery
        </h3>
        <p style={styles.tipText}>
          Sleep is not a luxury; it's a non-negotiable biological necessity for physical and
          mental restoration. For most adults, this range is optimal. Inadequate sleep impacts
          mood, concentration, immune function, and metabolism.
          <a href="#" style={styles.readMore}> Read more...</a>
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Hottest tips</h2>
        <div style={styles.tipsGrid}>
          <div style={styles.tipPlaceholder} />
          <div style={styles.tipPlaceholder} />
          <div style={styles.tipPlaceholder} />
        </div>
        <a href="#" style={styles.viewAll}>View all</a>
      </section>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#333',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: 600,
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    margin: '0 0 20px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeading: {
    margin: '0 0 10px',
    fontSize: '1.2rem',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
  },
  tipCard: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  tipImage: {
    width: '100%',
    borderRadius: '4px',
  },
  tipLabel: {
    margin: '10px 0 0',
    fontWeight: 'bold',
  },
  tipTitle: {
    fontSize: '1rem',
    margin: '10px 0 5px',
  },
  tipText: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  readMore: {
    color: '#00f',
    textDecoration: 'none',
    marginLeft: '5px',
  },
  tipsGrid: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tipPlaceholder: {
    backgroundColor: '#444',
    width: '30%',
    paddingBottom: '20%',
    borderRadius: '4px',
  },
  viewAll: {
    display: 'block',
    textAlign: 'center',
    color: '#00f',
    textDecoration: 'none',
    marginTop: '10px',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));