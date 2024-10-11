import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Form,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Modal,
  message,
  Select,
  Input,
} from 'antd';
import moment from 'moment';

const { Option } = Select;

const IndividualPayments = ({ isModalVisible, handleCancel, member }) => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMemberIdNumber, setSelectedMemberIdNumber] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:4343/api/v1/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(response.data);
      } catch (error) {
        message.error('Failed to fetch members, please reload the page');
      }
      setLoading(false);
    };

    fetchMembers();
  }, [token]);

  useEffect(() => {
    if (member) {
      setSelectedMemberId(member.id);
      setSelectedMemberIdNumber(member.id_number);
      form.setFieldsValue({
        memberId: member.id,
        id_number: member.id_number,
      });
    }
  }, [member, form]);

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      memberId: selectedMemberId,
      id_number: selectedMemberIdNumber,
    };

    if (
      !['Membership', 'Contribution', 'Pastoral Fund'].includes(values.account)
    ) {
      delete data.memberId;
      delete data.id_number;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:4343/api/v1/payments`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFinanceData((prevData) => [...prevData, response.data]);
      message.success('Payment record added successfully');
      handleCancel();
      form.resetFields();
      setSelectedMemberIdNumber(null);
      setSelectedMemberId(null);
    } catch (err) {
      message.error('Failed to add payment record');
      console.error(err);
    }
  };

  const handleMemberChange = (value) => {
    const selectedMember = members.find((member) => member.id === value);
    setSelectedMemberId(selectedMember ? selectedMember.id : null);
    setSelectedMemberIdNumber(selectedMember ? selectedMember.id_number : null);
    form.setFieldsValue({
      id_number: selectedMember ? selectedMember.id_number : '',
    });
  };

  return (
    <Modal
      title='Add Payment'
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}>
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='account'
              label='Account Receivable'
              rules={[
                {
                  required: true,
                  message: 'Please select account receivable!',
                },
              ]}>
              <Select placeholder='Select Account Receivable'>
                <Option value='Pastoral Fund'>Pastoral Fund</Option>
                <Option value='Membership'>Membership</Option>
                <Option value='Contribution'>Contribution</Option>
                <Option value='Offering'>Offering</Option>
                <Option value='Tithe'>Tithe</Option>
                <Option value='Building Fund'>Building Fund</Option>
                <Option value='Stationary'>Stationary</Option>
                <Option value='Thanks Giving'>Thanks Giving</Option>
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
              rules={[{ required: true, message: 'Please enter the amount!' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='reference'
              label='Reference'
              rules={[{ required: true, message: 'Please enter reference!' }]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='memberId'
              label='Select Member'
              rules={[{ required: false }]}>
              <Select placeholder='Select Member' onChange={handleMemberChange}>
                {members.map((member) => (
                  <Select.Option key={member.id} value={member.id}>
                    {member.name}
                  </Select.Option>
                ))}
              </Select>
              <span>Member is optional (Select if payment is from Member)</span>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='id_number'
              label='ID Number'
              rules={[{ required: false }]}>
              <Input style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit'>
          Add Payment
        </Button>
      </Form>
    </Modal>
  );
};

export default IndividualPayments;
