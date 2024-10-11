import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Input, Select, Button } from 'antd';
import AccountsCards from '../components/AccountsCards/AccountsCards';
import IndividualPayments from '../components/individualPayments/IndividualPayments'; // Modal component for details
import AccountDetails from '../components/AccountDetails/AccountDetails';
import '../styles/Finance.css';

const { Search } = Input;
const { Option } = Select;

const Finance = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(''); // Store selected account for modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://127.0.0.1:4343/api/v1/payments',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sortedPayments = response.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setPayments(sortedPayments);
        setFilteredPayments(sortedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (value) => {
    setSearchDate(value);
    const filtered = payments.filter((payment) =>
      payment.created_at.includes(value)
    );
    setFilteredPayments(filtered);
  };

  const handleFilter = (value) => {
    setSelectedAccount(value);
    const filtered = payments.filter((payment) =>
      payment.account.includes(value)
    );
    setFilteredPayments(filtered);
  };

  const showModal = (account) => {
    setSelectedAccount(account); // Set the selected account
    setIsModalVisible(true); // Show modal
  };
  const showModal1 = () => {
    // Set the selected account
    setIsModalVisible(true); // Show modal
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Date of Payment',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <div className='finance-container'>
        <div className='left'>
          {/* Pass showModal to AccountsCards */}
          <AccountsCards onCardClick={showModal} />
        </div>

        <div className='right'>
          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder='Search by Date (YYYY-MM-DD)'
              onSearch={handleSearch}
              enterButton
              style={{ width: 200, marginRight: 16, marginBottom: 10 }}
            />
            <Select
              placeholder='Filter by Account'
              onChange={handleFilter}
              style={{ width: 200 }}
              allowClear>
              <Option value=''>All Accounts</Option>
              {[...new Set(payments.map((payment) => payment.account))].map(
                (account) => (
                  <Option key={account} value={account}>
                    {account}
                  </Option>
                )
              )}
            </Select>
            <Button
              type='primary'
              onClick={showModal1}
              style={{ marginLeft: 16 }}>
              Add Payment
            </Button>
          </div>
          {loading ? (
            <Spin tip='Loading payments...' />
          ) : (
            <Table
              dataSource={filteredPayments}
              columns={columns}
              rowKey='id'
              pagination={{ pageSize: 4 }}
              bordered
            />
          )}
        </div>
      </div>

      {/* Modal Component */}
      <AccountDetails
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        account={selectedAccount} // Pass selected account to modal
      />
    </div>
  );
};

export default Finance;
