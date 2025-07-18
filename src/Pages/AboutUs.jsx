import React from 'react';

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Us</h1>

      <p style={styles.text}>
        <strong>FoodMed</strong> is a people-first solution designed to bridge the gap between
        <strong> medical advice and basic human needs</strong> — food and health. In many underserved
        communities, patients not only struggle with access to proper healthcare but also face
        challenges in getting the right nutrition, especially when managing chronic conditions.
        FoodMed addresses this double-edged challenge by connecting <strong>verified medical professionals</strong> with
        users who need <strong>free medical advice</strong>, while also enabling those with food to share it with
        those in urgent need — a beautiful blend of <strong>healthcare support and humanitarian service</strong>.
      </p>

      <p style={styles.text}>
        Through our secure, user-friendly platform, people can:
      </p>
      <ul style={styles.list}>
        <li>Request medical guidance from <strong>verified doctors</strong>, especially when hospitals are out of reach.</li>
        <li>Donate or request food supplies, ensuring no one in need is left behind.</li>
        <li>Engage in real-time chat with either donors or medical professionals to get timely help.</li>
      </ul>

      <p style={styles.text}>
        FoodMed is more than just an app — it’s a <strong>lifeline</strong>, built on compassion, technology, and community impact.
      </p>

      <h2 style={styles.subtitle}>Meet the Team</h2>
      <ul style={styles.list}>
        <li><strong>Matthew</strong> – Fullstack Developer & Vision Carrier</li>
        <li><strong>Boss Angel</strong> – Frontend Lead & System Integrator</li>
        <li><strong>Abiluv</strong> – Backend Engineer with an eye for structure</li>
        <li><strong>Destiny & Miracle</strong> – The brilliant UI/UX duo that shaped every experience</li>
        <li><strong>Daisy</strong> – Our amiable and energetic Product Manager, always pushing boundaries</li>
        <li><strong>Mr. Oreoluwa</strong> – The greatest facilitator, mentor, and guiding light</li>
        <li><strong>Techwitsclan Organization</strong> – Powering us with knowledge, structure, and purpose</li>
      </ul>

      <p style={styles.text}>
        At FoodMed, we believe <strong>technology should care</strong>, and our platform is here to
        <strong> serve humanity, one meal and one medical advice at a time.</strong>
      </p>

      <p style={styles.footer}>
        Together, we’re not just building an app — we’re creating a movement.<br />
        <span style={styles.highlight}>Join us. Heal with us. Feed with us.</span>
      </p>
    </div>
  );
};

export default AboutUs;
const styles = {
    container: {
      padding: '1.5rem',
      maxWidth: '64rem',
      margin: '0 auto',
      color: '#2d2d2d',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    text: {
      marginBottom: '1rem',
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    },
    list: {
      listStyleType: 'disc',
      paddingLeft: '1.5rem',
      marginBottom: '1.5rem',
      fontSize: '1.125rem',
    },
    footer: {
      marginBottom: '100px',
      fontSize: '1.25rem',
      fontWeight: 600,
      textAlign: 'center',
    },
    highlight: {
      color: '#1e90ff', // Customize as needed
    },
  }
