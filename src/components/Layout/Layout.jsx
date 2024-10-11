import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import './Layout.css';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarShrink, setIsSidebarShrink] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth > 768) {
      // On large screens, toggle shrink
      setIsSidebarShrink(!isSidebarShrink);
    } else {
      // On small screens, toggle open/close
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`layout ${isSidebarShrink ? 'sidebar-shrink' : ''}`}>
      <SideBar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className={`main-content ${isSidebarShrink ? 'shrink' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className='content-area' onClick={closeSidebar}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
