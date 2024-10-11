import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([
    {
      date: '20 July 2024 03:25pm',
      type: 'Transfer',
      description: 'Service Fee',
      amount: '$560',
      status: 'Credit',
    },
    {
      date: '15 July 2024 01:35pm',
      type: 'Card Payment',
      description: 'UI/UX Project',
      amount: '$700',
      status: 'Debit',
    },
    {
      date: '15 July 2024 01:35pm',
      type: 'Card Payment',
      description: 'UI/UX Project',
      amount: '$700',
      status: 'Debit',
    },
    // Add more transactions here
  ]);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  return (
    <div className='transaction-history'>
      <div className='transaction-header'>
        <h2>All Transactions</h2>
        <div className='date-picker'>
          <label htmlFor='start-date'>Start Date: </label>
          <DatePicker
            id='start-date'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat='dd MMM yyyy'
          />
          <label htmlFor='end-date'>End Date: </label>
          <DatePicker
            id='end-date'
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat='dd MMM yyyy'
          />
        </div>
      </div>
      <table className='transaction-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transactions.date}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>
                <span
                  className={
                    transaction.status === 'Credit'
                      ? 'status-credit'
                      : 'status-debit'
                  }>
                  {transaction.status}
                </span>
              </td>
              <td>
                <button className='action-btn print-btn'>🖨️</button>
                <button className='action-btn delete-btn'>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination'>
        <button>Previous</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default TransactionHistory;
