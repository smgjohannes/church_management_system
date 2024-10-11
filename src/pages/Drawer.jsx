import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import IndividualPayments from '../components/individualPayments/IndividualPayments';
import PaymentsModal from '../components/PaymentModal/PaymentsModal'; // Ensure the correct import path

import '../styles/drawer.css';

const MemberDrawer = ({ isVisible, member, onClose }) => {
  const [isPaymentsModalVisible, setPaymentsModalVisible] = useState(false);
  const [isAddPaymentModalVisible, setAddPaymentModalVisible] = useState(false);

  const showPaymentsModal = () => {
    setPaymentsModalVisible(true);
  };

  const closePaymentsModal = () => {
    setPaymentsModalVisible(false);
  };

  const showAddPaymentModal = () => {
    setAddPaymentModalVisible(true);
  };

  const closeAddPaymentModal = () => {
    setAddPaymentModalVisible(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Drawer
      className='drawer-container'
      open={isVisible}
      onClose={onClose}
      direction='right'>
      <div className='drawer-content'>
        {member ? (
          <>
            {member.Images && member.Images.length > 0 && (
              <div className='image_holder'>
                {member.Images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.url}
                      alt={`Member ${index}`}
                      style={{
                        width: '100%',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <h2>Member Details</h2>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>Id Number:</strong> {member.id_number}
              </p>
              <p className='drawer--column_container'>
                <strong>Name:</strong> {member.name}
              </p>
            </div>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>Surname:</strong> {member.surname}
              </p>
              <p className='drawer--column_container'>
                <strong>Cell Number:</strong> {member.cell_number}
              </p>
            </div>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>Date Of Birth:</strong>{' '}
                {formatDate(member.date_of_birth)}
              </p>
              <p className='drawer--column_container'>
                <strong>Age:</strong> {member.age}
              </p>
            </div>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>Member Of:</strong> {member.member_of}
              </p>
              <p className='drawer--column_container'>
                <strong>Local Church:</strong> {member.local_church}
              </p>
            </div>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>From Date:</strong> {formatDate(member.from_date)}
              </p>
              <p className='drawer--column_container'>
                <strong>Father:</strong> {member.father}
              </p>
            </div>
            <div className='column_container'>
              <p className='drawer--column_container'>
                <strong>Mother:</strong> {member.mother}
              </p>
              <p className='drawer--column_container'>
                <strong>Status:</strong> {member.status}
              </p>
            </div>
          </>
        ) : (
          <p>No member selected.</p>
        )}
      </div>

      <div className='drawer-footer'>
        <button onClick={showPaymentsModal} className='view-payment-button'>
          View Payments
        </button>
        <button onClick={showAddPaymentModal} className='add-payment-button'>
          Add payment
        </button>
        <button onClick={onClose} className='close-button'>
          Close
        </button>
      </div>

      <IndividualPayments
        isModalVisible={isAddPaymentModalVisible}
        handleCancel={closeAddPaymentModal}
        member={member}
      />
      <PaymentsModal
        isVisible={isPaymentsModalVisible}
        onClose={closePaymentsModal}
        member={member}
      />
    </Drawer>
  );
};

export default MemberDrawer;
