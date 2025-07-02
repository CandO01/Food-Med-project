import React from 'react';
import SchedulePage from './SchedulePage';
import './App.css';

function App() {
  return <SchedulePage />;
}

export default App;
import React from 'react';
import ScheduleHeader from './ScheduleHeader';
import DaysNav from './DaysNav';
import ScheduleList from './ScheduleList';
import './SchedulePage.css';

const appointments = [
  { time: '08:00 AM', name: 'Gabriel Ezekiel', color: '#e3f2fd' },
  { time: '09:00 AM', name: 'Michael Ogwu',   color: '#fce4ec' },
  { time: '09:20 AM', name: 'Destiny Selie',   color: '#e8f5e9' },
  { time: '10:00 AM', name: 'Maryann Nwagu',   color: '#fff3e0' },
  { time: '11:40 AM', name: 'Gift Nwankwo',    color: '#f3e5f5' },
  { time: '07:00 PM', name: 'Amobi Samuel',    color: '#e1f5fe' },
  { time: '08:00 PM', name: 'Solomon Sokoso',  color: '#fbe9e7' },
];

export default function SchedulePage() {
  return (
    <div className="schedule-page">
      <ScheduleHeader
        date="13 September, 2025"
        avatar="/avatar.jpg"
      />
      <DaysNav days={['Sun 12','Mon 12','Tue 12','Wed 12','Thu 12']} />
      <ScheduleList items={appointments} />
    </div>
  );
}
import React from 'react';
import './ScheduleHeader.css';

export default function ScheduleHeader({ date, avatar }) {
  return (
    <header className="schedule-header">
      <div className="header-info">
        <h1>Schedules</h1>
        <p>{date}</p>
      </div>
      <img className="avatar" src={avatar} alt="Profile" />
    </header>
  );
}
import React from 'react';
import './DaysNav.css';

export default function DaysNav({ days }) {
  return (
    <nav className="days-nav">
      {days.map((day, idx) => (
        <button key={idx} className={idx === 0 ? 'active' : ''}>
          {day}
        </button>
      ))}
    </nav>
  );
}
import React from 'react';
import ScheduleItem from './ScheduleItem';
import './ScheduleList.css';

export default function ScheduleList({ items }) {
  return (
    <ul className="schedule-list">
      {items.map((item, idx) => (
        <ScheduleItem
          key={idx}
          time={item.time}
          name={item.name}
          color={item.color}
        />
      ))}
    </ul>
  );
}
import React from 'react';
import './ScheduleItem.css';

export default function ScheduleItem({ time, name, color }) {
  return (
    <li
      className="schedule-item"
      style={{ backgroundColor: color }}
    >
      <span className="time">{time}</span>
      <span className="name">{name}</span>
    </li>
  );
}