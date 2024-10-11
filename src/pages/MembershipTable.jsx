import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/membershipTable.css';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from 'antd';

const { Option } = Select;

const MembershipTable = ({ filterCriteria }) => {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMembersAndPayments = async () => {
      const token = localStorage.getItem('token');
      try {
        const [membersResponse, paymentsResponse] = await Promise.all([
          axios.get('http://127.0.0.1:4343/api/v1/members', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:4343/api/v1/payments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMembers(membersResponse.data);
        setPayments(paymentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMembersAndPayments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredPayments = payments.filter(
    (payment) => payment.type === 'membershipCard'
  );

  const filteredMembers = members.filter((member) => {
    const memberPayment = filteredPayments.find(
      (payment) => payment.memberId === member.id
    );

    if (!memberPayment) return false;

    const matchesDate = filterCriteria.date
      ? memberPayment.date.includes(filterCriteria.date)
      : true;
    const matchesId = filterCriteria.id
      ? member.id.toString().includes(filterCriteria.id)
      : true;

    return matchesDate && matchesId;
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
  };
  const memberTotals = filteredMembers.map((member) => {
    const totalAmount = filteredPayments
      .filter((payment) => payment.memberId === member.id)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return { ...member, totalAmount };
  });

  const totalAmount = memberTotals.reduce(
    (sum, member) => sum + member.totalAmount,
    0
  );

  const handleRowClick = (member) => {
    setSelectedMember(member);
    setIsDetailModalVisible(true);
  };

  const handleAddPaymentClick = (member) => {
    setSelectedMember(member);
    setIsPaymentModalVisible(true);
    form.setFieldsValue({ memberId: member.id });
  };

  const handlePaymentModalCancel = () => {
    setIsPaymentModalVisible(false);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  const handlePaymentSubmit = (values) => {
    // handle form submission
    console.log(values);
    setIsPaymentModalVisible(false);
    form.resetFields();
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const data = {
    membershipCard: {},
  };

  if (selectedMember) {
    const memberPayments = filteredPayments.filter(
      (payment) =>
        payment.memberId === selectedMember.id &&
        new Date(payment.date).getFullYear() === selectedYear
    );

    memberPayments.forEach((payment) => {
      const month = new Date(payment.date).toLocaleString('default', {
        month: 'long',
      });

      data.membershipCard[month] =
        (data.membershipCard[month] || 0) + payment.amount;
    });
  }

  const years = Array.from(
    new Set(payments.map((payment) => new Date(payment.date).getFullYear()))
  );

  return (
    <div className='membership-table'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cell No</th>
            <th>Total Amount</th>
            <th>Type Of Payment</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {memberTotals.map((member) => {
            const memberPayment = filteredPayments.find(
              (payment) => payment.memberId === member.id
            );
            return (
              <tr key={member.id}>
                <td>{`${member.name} ${member.surname}`}</td>
                <td>{member.cell_number}</td>
                <td>{member.totalAmount}</td>
                <td>{memberPayment.type}</td>
                <td>{formatDate(memberPayment.date)}</td>
                <td className='action-handle'>
                  <Button type='primary'>
                    <Link to={`/updateMember/${member.id}`}>Update</Link>
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => handleAddPaymentClick(member)}>
                    +Payment
                  </Button>
                  <Button type='primary' onClick={() => handleRowClick(member)}>
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        title='Add Payment'
        visible={isPaymentModalVisible}
        onCancel={handlePaymentModalCancel}
        footer={null}>
        <Form form={form} onFinish={handlePaymentSubmit} layout='vertical'>
          <Form.Item name='memberId' initialValue={selectedMember?.id} hidden>
            <InputNumber />
          </Form.Item>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='type'
                label='Payment Type'
                rules={[
                  { required: true, message: 'Please select a payment type!' },
                ]}>
                <Select placeholder='Select Payment Type'>
                  <Option value='pastoralFunds'>Pastoral Funds</Option>
                  <Option value='membershipCard'>Membership Card</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='date'
                label='Select Month and Year'
                rules={[
                  {
                    required: true,
                    message: 'Please select the month and year!',
                  },
                ]}>
                <DatePicker picker='month' style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='amount'
                label='Amount'
                rules={[
                  { required: true, message: 'Please enter the amount!' },
                ]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Button type='primary' htmlType='submit'>
            Add Payment
          </Button>
        </Form>
      </Modal>
      <Modal
        className='Payment_modal'
        title={`${selectedMember?.name} ${selectedMember?.surname}'s Payment Details`}
        visible={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={1200} // Set the desired width here
      >
        <div>
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            style={{ marginBottom: '20px' }}>
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <table className='post-table'>
            <thead>
              <tr>
                <th>Type</th>
                {months.map((month) => (
                  <th key={month}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Membership Card</td>
                {months.map((month) => (
                  <td key={month}>
                    {data.membershipCard[month]
                      ? `N$${data.membershipCard[month]},00`
                      : 'N$0,00'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
      <div className='total-amount'>
        <strong>Total Amount:</strong> {totalAmount}
      </div>
    </div>
  );
};

export default MembershipTable;
