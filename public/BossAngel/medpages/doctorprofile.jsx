import React from 'react';
import './index.css';
import DoctorProfile from './DoctorProfile';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <DoctorProfile />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Ask a Doctor</h1>
    </header>
  );
}
import React from 'react';
import './index.css';

export default function StatsCard({ patients, experience, rating }) {
  return (
    <div className="stats-container">
      <div className="stat">
        <span className="value">{patients}</span>
        <span className="label">Patients</span>
      </div>
      <div className="stat">
        <span className="value">{experience}</span>
        <span className="label">Experience</span>
      </div>
      <div className="stat">
        <span className="value">{rating} ★</span>
        <span className="label">Rating</span>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import './index.css';

export default function AskQuestion() {
  const [question, setQuestion] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Your question: ${question}`);
    setQuestion('');
  };

  return (
    <form className="ask-question" onSubmit={handleSubmit}>
      <textarea
        value={question}
        placeholder="Type your question..."
        onChange={e => setQuestion(e.target.value)}
        required
      />
      <button type="submit">Ask Now</button>
    </form>
  );
}
import React from 'react';
import './index.css';

export default function Overview({ text }) {
  return (
    <section className="overview">
      <h3>About Me</h3>
      <p>{text}</p>
    </section>
  );
}