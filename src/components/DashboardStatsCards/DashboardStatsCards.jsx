import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiBadge, BiMoney } from 'react-icons/bi';
import './DashboardStatsCards.css';
const DashboardStatsCards = () => {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchMembers = axios.get('http://127.0.0.1:4343/api/v1/members', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchPayments = axios.get('http://127.0.0.1:4343/api/v1/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchMembers, fetchPayments])
      .then((responses) => {
        setMembers(responses[0].data);
        setPayments(responses[1].data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calculate total amount from payments
  const totalAmount = payments.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );

  const admin_stats = [
    {
      title: 'Members',
      total: members.length,
      icon: <BiBadge />,
    },
    {
      title: 'Financial',
      total: totalAmount.toFixed(2),
      icon: <BiMoney />,
    },
  ];

  return (
    <div className='card--container'>
      {admin_stats.map((item, index) => (
        <div className='card' key={index}>
          <div className='card--cover'>{item.icon}</div>
          <div className='card--title'>
            <h2>{item.title}</h2>
            <p className='card--title__paragraph'>
              {item.total !== undefined ? item.total : 'N/A'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsCards;
