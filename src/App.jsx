import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Layout from './components/Layout/Layout';
import ChurchMembers from './pages/ChurchMembers';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Expenses from './pages/Expenses';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />

        {/* Protected Routes wrapped inside Layout */}
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
          <Route path='/layout' element={<Dashboard />} />
          <Route path='/churchmembers' element={<ChurchMembers />} />
          <Route path='/finance' element={<Finance />} />
          <Route path='/expenses' element={<Expenses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
