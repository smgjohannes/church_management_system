import React, { useEffect, useState } from 'react';
import { Modal, Table, Select, Spin } from 'antd';
import moment from 'moment';

const { Option } = Select;

const PaymentsModal = ({ isVisible, onClose, member }) => {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  useEffect(() => {
    if (member && isVisible) {
      setLoading(true);
      // Simulate loading process
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [member, isVisible]);

  if (!member || !member.payments) {
    return null; // or you could render some fallback UI
  }

  const paymentYears = [
    ...new Set(member.payments.map((payment) => moment(payment.date).year())),
  ].sort((a, b) => b - a); // Sort years in descending order

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const filteredPayments = member.payments.filter(
    (payment) => moment(payment.date).year() === selectedYear
  );

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    ...moment.months().map((month) => ({
      title: month,
      dataIndex: month.toLowerCase(),
      key: month.toLowerCase(),
      render: (text, record) => {
        const payment = record.payments.find(
          (p) =>
            moment(p.date).format('MMMM').toLowerCase() === month.toLowerCase()
        );
        const amount = payment ? payment.amount : 0;
        return (
          <span style={{ color: amount > 0 ? 'green' : 'red' }}>
            {`N$${amount},00`}
          </span>
        );
      },
    })),
  ];

  const dataSource = [
    ...new Set(filteredPayments.map((payment) => payment.account)),
  ]
    .map((account, index) => ({
      key: index.toString(),
      type: account,
      payments: filteredPayments.filter(
        (payment) => payment.account === account
      ),
    }))
    .filter((data) => data.payments.length > 0);

  return (
    <Modal
      title='Payments'
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={1200}>
      {loading ? (
        <Spin tip='Loading...' />
      ) : (
        <>
          <Select
            defaultValue={selectedYear}
            style={{ width: 120, marginBottom: 16 }}
            onChange={handleYearChange}>
            {paymentYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
          />
        </>
      )}
    </Modal>
  );
};

export default PaymentsModal;
