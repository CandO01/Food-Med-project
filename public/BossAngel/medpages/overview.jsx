import React from 'react';
import ProfilePage from './ProfilePage';
import './index.css';

function App() {
  return (
    <div className="app">
      <ProfilePage />
    </div>
  );
}

export default App;
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ContactIcons from './ContactIcons';
import AboutSection from './AboutSection';
import WorkingTime from './WorkingTime';
import Schedule from './Schedule';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileHeader
        name="Dr. Gabriella Abel"
        specialty="Eye Specialist"
        avatar="/avatar.jpg"
        rating={5}
      />

      <ContactIcons />

      <AboutSection text={
        `As an ophthalmologist, I'm a medical doctor specializing in comprehensive eye and vision care. 
        I diagnose, treat, and prevent all eye conditions, ranging from common vision issues to 
        sight-threatening diseases like glaucoma and cataracts, ensuring your eyes receive the best 
        possible care.`
      } />

      <WorkingTime days="Mon – Fri" hours="08:00 AM – 08:00 PM" />

      <Schedule month="June" dates={['16', '17', '18', '19', '20', '21']} />
    </div>
  );
}import React from 'react';
import ProfileHeader from './ProfileHeader';
import ContactIcons from './ContactIcons';
import AboutSection from './AboutSection';
import WorkingTime from './WorkingTime';
import Schedule from './Schedule';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileHeader
        name="Dr. Gabriella Abel"
        specialty="Eye Specialist"
        avatar="/avatar.jpg"
        rating={5}
      />

      <ContactIcons />

      <AboutSection text={
        `As an ophthalmologist, I'm a medical doctor specializing in comprehensive eye and vision care. 
        I diagnose, treat, and prevent all eye conditions, ranging from common vision issues to 
        sight-threatening diseases like glaucoma and cataracts, ensuring your eyes receive the best 
        possible care.`
      } />

      <WorkingTime days="Mon – Fri" hours="08:00 AM – 08:00 PM" />

      <Schedule month="June" dates={['16', '17', '18', '19', '20', '21']} />
    </div>
  );
}
import React from 'react';
import './ProfileHeader.css';

export default function ProfileHeader({ avatar, name, specialty, rating }) {
  const stars = Array.from({ length: rating }, (_, i) => '★').join('');
  return (
    <div className="profile-header">
      <img className="avatar" src={avatar} alt={name} />
      <div className="info">
        <h2>{name}</h2>
        <p className="specialty">{specialty}</p>
        <p className="rating">{stars}</p>
      </div>
    </div>
  );
}
import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './ContactIcons.css';

export default function ContactIcons() {
  return (
    <div className="contact-icons">
      <FaPhone />
      <FaEnvelope />
      <FaMapMarkerAlt />
    </div>
  );
}
import React from 'react';
import './AboutSection.css';

export default function AboutSection({ text }) {
  return (
    <section className="about-section">
      <h3>About me</h3>
      <p>{text}</p>
    </section>
  );
}
import React from 'react';
import './WorkingTime.css';

export default function WorkingTime({ days, hours }) {
  return (
    <div className="working-time">
      <h4>Working time</h4>
      <p>{days}, {hours}</p>
    </div>
  );
}
import React from 'react';
import './Schedule.css';

export default function Schedule({ month, dates }) {
  return (
    <div className="schedule">
      <h4>Upcoming Schedule</h4>
      <p className="month">{month}</p>
      <div className="dates">
        {dates.map((d, idx) => (
          <span key={idx} className="date">{d}</span>
        ))}
      </div>
    </div>
  );
}