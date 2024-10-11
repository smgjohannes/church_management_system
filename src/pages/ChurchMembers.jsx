import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/churchMember.css';
import MemberDrawer from './Drawer';
import MemberModal from '../components/AddMember/CreateMember';

const ChurchMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:4343/api/v1/members', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMembers(res.data);
        setFilteredMembers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:4343/api/v1/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedMembers = members.filter((member) => member.id !== id);
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleStatus = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const updatedMember = members.find((member) => member.id === id);
      updatedMember.status =
        updatedMember.status === 'active' ? 'inactive' : 'active';
      await axios.put(
        `http://127.0.0.1:4343/api/v1/members/${id}`,
        updatedMember,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedMembers = members.map((member) =>
        member.id === id ? updatedMember : member
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedMember(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = members.filter((member) =>
      ['name', 'surname', 'cell_number', 'father', 'mother', 'age'].some(
        (key) => member[key]?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredMembers(filtered);
  };

  const openAddModal = () => {
    setSelectedMember(null);
    setModalIsOpen(true);
  };

  const openUpdateModal = (member) => {
    setSelectedMember(member);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMember(null);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:4343/api/v1/members', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMembers(res.data);
        setFilteredMembers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const totalMembers = members.length;
  const activeMembers = members.filter(
    (member) => member.status === 'active'
  ).length;
  const inactiveMembers = members.filter(
    (member) => member.status === 'inactive'
  ).length;

  return (
    <div className='dashboard-church--member'>
      <div className=''>
        <div className='dashboard--content_churchmember'>
          <div className='contentheade-post__container--holder'>
            <div className='post-container'>
              <div className='post-title'>Member List</div>
              <div className='post-headers--nav'>
                <button onClick={openAddModal} className='add-button'>
                  Add +
                </button>
                <input
                  type='text'
                  placeholder='Search by name, cell number, etc.'
                  value={searchTerm}
                  onChange={handleSearch}
                  className='search-input'
                />
              </div>
              <div className='post-content'>
                <div className='post-table'>
                  <table className='table-container'>
                    <thead className='table-header'>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Father</th>
                        <th>Mother</th>
                        <th>CellNo</th>
                        <th>Age</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((data, i) => (
                        <tr key={i} onClick={() => handleRowClick(data)}>
                          <td>{data.name}</td>
                          <td>{data.surname}</td>
                          <td>{data.father}</td>
                          <td>{data.mother}</td>
                          <td>{data.cell_number}</td>
                          <td>{data.age}</td>
                          <td>{data.status}</td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openUpdateModal(data);
                              }}
                              className='update-button'>
                              Update
                            </button>
                            <button
                              className='delete-button'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(data.id);
                              }}>
                              Delete
                            </button>
                            <button
                              className={
                                data.status === 'active'
                                  ? 'deactivate-button'
                                  : 'activate-button'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(data.id);
                              }}>
                              {data.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='totals'>
                  <p>Total Members: {totalMembers}</p>
                  <p>Active Members: {activeMembers}</p>
                  <p>Inactive Members: {inactiveMembers}</p>
                </div>
              </div>
            </div>
          </div>
          <MemberDrawer
            isVisible={drawerVisible}
            member={selectedMember}
            onClose={closeDrawer}
          />
          <MemberModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            member={selectedMember}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default ChurchMembers;
