import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Pagination } from 'antd'; // Add Pagination from Ant Design
import '../styles/expense.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filterAccount, setFilterAccount] = useState('All');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // Set the number of transactions per page
  const [selectedExpenseDetail, setSelectedExpenseDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    transaction_reference: '',
    amount: '',
    payment_date: '',
    date: '',
    description: '',
    account: '',
  });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://127.0.0.1:4343/api/v1/expenses',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(response.data);
      setFilteredExpenses(response.data);
      updateTotalAmount(response.data);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching expenses:', error);
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while fetching expenses.';
      setErrorMessage(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleFilterAccountChange = (e) => {
    const account = e.target.value;
    setFilterAccount(account);
    filterExpenses(account, filterMonth, filterYear); // Use current month and year
  };

  const handleFilterMonthChange = (e) => {
    const month = e.target.value;
    setFilterMonth(month);
    filterExpenses(filterAccount, month, filterYear); // Use current account and year
  };

  const handleFilterYearChange = (e) => {
    const year = e.target.value;
    setFilterYear(year);
    filterExpenses(filterAccount, filterMonth, year); // Use current account and month
  };

  const filterExpenses = (account, month, year) => {
    let filtered = expenses;

    // Filter by account if selected
    if (account !== 'All') {
      filtered = filtered.filter(
        (expense) =>
          expense.account === account || expense.payment?.account === account
      );
    }

    // Filter by month if selected
    if (month) {
      filtered = filtered.filter((expense) => {
        const expenseMonth = new Date(expense.date).getMonth() + 1; // Get the month (1-based)
        return expenseMonth === parseInt(month);
      });
    }

    // Filter by year if selected
    if (year) {
      filtered = filtered.filter((expense) => {
        const expenseYear = new Date(expense.date).getFullYear(); // Get the year
        return expenseYear === parseInt(year);
      });
    }

    // Set the filtered expenses and update pagination and total
    setFilteredExpenses(filtered);
    setCurrentPage(1); // Reset to first page after filtering
    updateTotalAmount(filtered);
  };

  const updateTotalAmount = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalAmount(total);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:4343/api/v1/expenses',
        newExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const savedExpense = response.data;
      setExpenses([...expenses, savedExpense]);
      setFilteredExpenses([...expenses, savedExpense]);
      updateTotalAmount([...expenses, savedExpense]);
      setFormData({
        transaction_reference: '',
        amount: '',
        payment_date: '',
        date: '',
        description: '',
        account: '',
      });
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error submitting expense:', error);
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while submitting the expense.';
      setErrorMessage(errorMessage);
    }
  };
  const handleRowClick = (expense) => {
    setSelectedExpenseDetail(expense);
    setIsDetailModalVisible(true);
  };
  return (
    <div className='dashboard-church--member'>
      <div className='expense-container'>
        <h1>Expenses</h1>
        {errorMessage && (
          <div className='error-message'>
            <p style={{ color: 'red' }}>{errorMessage}</p>
          </div>
        )}

        <div className='expense-form'>
          <form
            class='expense-form--container'
            onSubmit={selectedExpense ? handleSaveEdit : handleSubmit}>
            <div className='form-group--cover'>
              <div class='form-group'>
                <label htmlFor='transaction_reference'>
                  Transaction Reference:
                </label>
                <input
                  type='text'
                  id='transaction_reference'
                  value={formData.transaction_reference}
                  onChange={handleInputChange}
                />
              </div>
              <div class='form-group'>
                <label htmlFor='amount'>Amount:</label>
                <input
                  type='number'
                  id='amount'
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='form-group--cover'>
              <div class='form-group'>
                <label htmlFor='payment_date'>Payment Date:</label>
                <input
                  type='date'
                  id='payment_date'
                  value={formData.payment_date}
                  onChange={handleInputChange}
                />
              </div>
              <div class='form-group'>
                <label htmlFor='date'>Date:</label>
                <input
                  type='date'
                  id='date'
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='form-group--cover'>
              <div class='form-group'>
                <label htmlFor='description'>Description:</label>
                <input
                  type='text'
                  id='description'
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div class='form-group'>
                <label htmlFor='account'>Account:</label>
                <input
                  type='text'
                  id='account'
                  value={formData.account}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div class='form-buttons'>
              <button type='submit'>
                {selectedExpense ? 'Save' : 'Add Expense'}
              </button>
              {selectedExpense && (
                <button type='button' onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className='expense-list'>
          <div className='filter'>
            <label htmlFor='filterAccount'>Filter by Account:</label>
            <select
              id='filterAccount'
              value={filterAccount}
              onChange={handleFilterAccountChange}>
              <option value='All'>All</option>
              <option value='Contribution'>Contribution</option>
              <option value='Membership'>Membership</option>
              <option value='Pastoral Fund'>Pastoral Fund</option>
              <option value='Building Fund'>Building Fund</option>
              <option value='Tithe'>Tithe</option>
              <option value='Offering'>Offering</option>
              <option value='Stationary'>Stationary</option>
              <option value='Thanks Giving'>Thanks Giving</option>
            </select>

            <label htmlFor='filterMonth'>Filter by Month:</label>
            <select
              id='filterMonth'
              value={filterMonth}
              onChange={handleFilterMonthChange}>
              <option value=''>All</option>
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {new Date(0, m).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <label htmlFor='filterYear'>Filter by Year:</label>
            <select
              id='filterYear'
              value={filterYear}
              onChange={handleFilterYearChange}>
              <option value=''>All</option>
              {[...Array(5).keys()].map((i) => (
                <option key={i + 2020} value={i + 2020}>
                  {i + 2020}
                </option>
              ))}
            </select>
          </div>

          <p className='total-amount'>
            Total Amount: N${totalAmount.toFixed(2)}
          </p>

          <h2>Expense List</h2>

          <table className='expense-table'>
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Amount</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((expense) => (
                <tr key={expense.id} onClick={() => handleRowClick(expense)}>
                  <td>{expense.transaction_reference}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{formatDate(expense.payment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredExpenses.length}
            onChange={handlePageChange}
          />
        </div>

        <Button type='primary' onClick={() => setIsReportModalVisible(true)}>
          Generate Report
        </Button>

        <Modal
          title='Expense Details'
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key='close' onClick={() => setIsDetailModalVisible(false)}>
              Close
            </Button>,
          ]}>
          {selectedExpenseDetail && (
            <div className='modal-detail-container'>
              <p>
                <strong>Transaction Reference:</strong>{' '}
                {selectedExpenseDetail.transaction_reference}
              </p>
              <p>
                <strong>Amount:</strong> N$
                {selectedExpenseDetail.amount.toFixed(2)}
              </p>
              <p>
                <strong>Payment Date:</strong>{' '}
                {formatDate(selectedExpenseDetail.payment_date)}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedExpenseDetail.description}
              </p>
              <p>
                <strong>Account:</strong>{' '}
                {selectedExpenseDetail.payment?.account}
              </p>{' '}
              {/* Show the Account */}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Expenses;
