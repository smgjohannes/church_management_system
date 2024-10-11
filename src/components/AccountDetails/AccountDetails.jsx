import React from 'react';
import { Modal, Table } from 'antd';

const AccountDetails = ({
  isModalVisible,
  handleCancel,
  account,
  accountDetails,
}) => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
  };
  // Format data for display
  const formattedData =
    accountDetails && accountDetails.length > 0
      ? accountDetails.flatMap((payment) => {
          // Check if the payment has a member associated
          if (payment.member && payment.member.length > 0) {
            return payment.member.map((member) => ({
              id: payment.id,
              name: `${member.name} `, // Concatenate name and surname
              amount: payment.amount,
              date: formatDate(payment.date),
            }));
          } else {
            // Display the payment even if no members are associated
            return [
              {
                id: payment.id,
                name: 'No Associated to Member ',
                amount: payment.amount,
                date: formatDate(payment.date),
              },
            ];
          }
        })
      : []; // If accountDetails is undefined or empty, return an empty array

  return (
    <Modal
      title={`Payments for ${account}`}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}>
      <Table
        columns={columns}
        dataSource={formattedData} // Display member or payment details
        rowKey='id'
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default AccountDetails;
