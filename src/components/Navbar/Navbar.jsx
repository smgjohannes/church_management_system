import React from 'react';
import './Navbar.css';
import image from '../../assets/images/lifuti.jpeg';

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className='navbar sticky-navbar'>
      <div className='navbar-left'>
        <button className='menu-icon' onClick={toggleSidebar}>
          &#9776;
        </button>
        <div className='search-box'>
          <input type='text' placeholder='Search...' />
          <i className='search-icon'>&#128269;</i>
        </div>
      </div>
      <div className='navbar-right'>
        <div className='navbar-item'>
          <i className='message-icon'>&#9993;</i>
          <span className='badge'>4</span>
        </div>
        <div className='navbar-item'>
          <i className='notification-icon'>&#128276;</i>
          <span className='badge'>3</span>
        </div>
        <div className='navbar-item profile'>
          <img src={image} alt='Profile' className='profile-image' />
          Johannes
        </div>
      </div>
    </div>
  );
};

export default Navbar;
