// App.js
import React from 'react';import './index.css';

const Header = () => (
  <header className="header">
    <h1>Ask A Doctor</h1>
  </header>
);

const DoctorCard = ({ name, specialty }) => (
  <div className="doctor-card">
    <h2>{name}</h2>
    <p>{specialty}</p>
    <button>Ask Now</button>
  </div>
);

const CategoryCard = ({ category }) => (
  <div className="category-card">
    <p>{category}</p>
  </div>
);

const TopRatedDoctor = ({ name, specialty }) => (
  <div className="top-rated-doctor">
    <strong>{name}</strong> - <em>{specialty}</em>
  </div>
);

function App() {
  return (
    <div className="container">
      <Header />

      <section className="featured-section">
        <h3>Featured Doctor</h3>
        <DoctorCard name="Dr. Gabriel Abel" specialty="Eye Specialist" />
      </section>

      <section className="categories-section">
        <h3>Categories</h3>
        <div className="categories">
          <CategoryCard category="Eye Specialist" />
          <CategoryCard category="Dentist" />
          <CategoryCard category="Brain Specialist" />
        </div>
      </section>

      <section className="top-rated-section">
        <h3>Top Rated Doctors</h3>
        <TopRatedDoctor name="Walter Kigs" specialty="Dentist" />
        <TopRatedDoctor name="Debra Kin" specialty="Eye Specialist" />
      </section>
    </div>
  );
}

export default App;