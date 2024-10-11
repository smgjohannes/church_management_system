import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Dashboard.css';
import DashboardStatsCards from '../components/DashboardStatsCards/DashboardStatsCards';
import DirectChat from '../components/DirectChat/DirectChat';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    '2024-09-15': { description: 'Youth Conference' },
    '2024-09-21': { description: 'Church Anniversary' },
  });

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(
      events[formattedDate]
        ? events[formattedDate].description
        : 'No event on this date'
    );
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (events[formattedDate]) {
      return <span className='event-dot'></span>;
    }
  };

  const tileClassName = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    return events[formattedDate] ? 'event-date' : null;
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-metrics--left'>
        <div className='stats-cards'>
          <DashboardStatsCards />
        </div>
        <div className='direct-chat-container'>
          <DirectChat />
        </div>
      </div>
      <div className='dashboard-metrics--right'>
        <div className='calendar-marker'>
          <Calendar
            onClickDay={handleDateClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />
        </div>
        {selectedDate && (
          <div className='event-popup'>
            <p>{selectedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
