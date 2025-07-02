import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  const categories = ['Home', 'Food', 'Mental', 'Dietary', 'Physical'];
  const articles = [
    {
      title: 'Why Exercise is Your Best Medicine',
      desc: 'In a world filled with quick fixes and medical supplements, the best treatment is still exercise.'
    },
    {
      title: 'Embracing Sustainable Healthy Eating',
      desc: 'There are many ways to improve your eating habits, but sustainable practices are the most impactful.'
    },
    {
      title: 'Unlocking Movement, Restoring Life',
      desc: 'When moving matters, stories of athletes, dancers, and everyday people.'
    },
    {
      title: 'Unlocking Movement, Restoring Life',
      desc: 'When moving matters, stories of athletes, dancers, and everyday people.'
    }
  ];

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: 20,
      color: '#333'
    },
    header: {
      backgroundColor: '#333',
      color: '#fff',
      padding: 10,
      borderRadius: 4,
      marginBottom: 20
    },
    title: { margin: 0, fontSize: 24, letterSpacing: 1 },
    greeting: { margin: '0 0 10px' },
    button: {
      display: 'inline-block',
      backgroundColor: '#6a0dad',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: 5,
      cursor: 'pointer',
      fontSize: 14
    },
    section: { marginBottom: 30 },
    sectionTitle: { margin: '0 0 10px', fontSize: 18, color: '#6a0dad' },
    categories: { display: 'flex', gap: 10, flexWrap: 'wrap' },
    category: {
      flex: '1 1 100px',
      backgroundColor: '#fff',
      padding: '10px 0',
      textAlign: 'center',
      borderRadius: 5,
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    articleList: { display: 'flex', flexDirection: 'column', gap: 15 },
    article: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 5,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid #6a0dad'
    },
    articleTitle: { margin: '0 0 5px', fontSize: 16 },
    articleDesc: { margin: 0, fontSize: 14, color: '#555' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>HEALTH TIP</h1>
      </header>

      <main>
        <section style={styles.section}>
          <p style={styles.greeting}>Good morning, Laura</p>
          <p style={styles.greeting}>How are you today?</p>
          <button style={styles.button}>View today's health</button>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What are you looking for?</h2>
          <div style={styles.categories}>
            {categories.map((cat, i) => (
              <div key={i} style={styles.category}>{cat}</div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Health Articles and news</h2>
          <h3 style={{ ...styles.sectionTitle, fontSize: 16 }}>Recommended</h3>
          <div style={styles.articleList}>
            {articles.map((art, i) => (
              <div key={i} style={styles.article}>
                <h4 style={styles.articleTitle}>{art.title}</h4>
                <p style={styles.articleDesc}>{art.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));