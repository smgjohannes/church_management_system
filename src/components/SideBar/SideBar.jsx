import React from 'react';
import {
  BiBookAlt,
  BiHelpCircle,
  BiHome,
  BiListUl,
  BiMessage,
  BiStats,
} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const SideBar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='sidebar-logo'>
        <h2>
          <BiBookAlt className='logo-icon' /> EBC
        </h2>
      </div>
      <ul className='sidebar-menu'>
        <Link to='/layout' className='menu-item active' onClick={closeSidebar}>
          <BiHome className='icon' /> Dashboard
        </Link>
        <Link to='/churchmembers' className='menu-item' onClick={closeSidebar}>
          <BiListUl className='icon' /> Member List
        </Link>
        <Link to='/finance' className='menu-item' onClick={closeSidebar}>
          <BiStats className='icon' /> Payments
        </Link>
        <Link to='/expenses' className='menu-item' onClick={closeSidebar}>
          <BiStats className='icon' /> Expenses
        </Link>
        <Link to='' className='menu-item' onClick={closeSidebar}>
          <BiMessage className='icon' /> Messages
        </Link>
        <Link to='' className='menu-item' onClick={closeSidebar}>
          <BiHelpCircle className='icon' /> Help
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
