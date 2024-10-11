import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountsCards.css';
import { BiMoney } from 'react-icons/bi';
import AccountDetails from '../AccountDetails/AccountDetails'; // Import the modal component

const AccountsCards = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(''); // Track selected account
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:4343/api/v1/payments/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (account) => {
    const token = localStorage.getItem('token');

    axios
      .get(
        `http://127.0.0.1:4343/api/v1/payments/getAccountDetails/${account}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response.data); // Log the response to check the structure
        setAccountDetails(response.data); // Set the full response data
        setSelectedAccount(account); // Set selected account for modal
        setIsModalVisible(true); // Open the modal
      })
      .catch((err) => {
        console.error('Error fetching account details:', err); // Log errors to the console
        setError(err);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='accounts-main-container'>
      <div className='card--container-accounts'>
        {stats.length > 0 &&
          stats.map((item, index) => (
            <div
              className='card-finance-accounts'
              key={index}
              onClick={() => handleCardClick(item.account)} // Fetch details on click
            >
              <div className='card--cover-accounts'>
                <BiMoney />
              </div>
              <div className='card--title-accounts'>
                <h2>{item.account}</h2>
                <p className='card--title__paragraph-accounts'>
                  {item.totalAmount}
                </p>
              </div>
            </div>
          ))}
      </div>

      {isModalVisible && (
        <AccountDetails
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          account={selectedAccount}
          accountDetails={accountDetails} // Pass account details to the modal
        />
      )}
    </div>
  );
};

export default AccountsCards;
