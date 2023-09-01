import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('firstName');
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    id: 0,
    registered: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    adminNotes: ''
  });
  const updatedUserData = {};

  useEffect(() => {
    axios.get(`http://localhost:50000/users?page=${page}&pageSize=10`)
      .then((response) => {
        const { data, totalPages } = response.data;
        setUsers(data);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [page, sortBy, searchTerm]);

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleAddUser = () => {
    axios.post('/users', newUser)
      .then((response) => {
        const newUser = response.data.data;
        setUsers([...users, newUser]);
        setNewUser({
          id: 0,
          registered: '',
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          adminNotes: ''
        });
      })
      .catch((error) => {
        console.error('Error adding a user:', error);
      });
  };

  const handleEditUser = (userId, updatedUserData) => {
    axios.put(`/users/${userId}`, updatedUserData)
      .then((response) => {
        const updatedUser = response.data.data;
        const updatedUsers = users.map((user) =>
          user.id === userId ? updatedUser : user
        );
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error updating a user:', error);
      });
  };  

  const handleDeleteUser = (userId) => {
    axios.delete(`/users/${userId}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error deleting a user:', error);
      });
  };

  return (
    <div>
      <h1>User List</h1>

      {/* Sort by */}
      <div>
        <label>Sort by:</label>
        <select onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="middleName">Middle Name</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="address">Address</option>
        </select>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* User List */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
            <button onClick={() => handleEditUser(user.id, updatedUserData)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next Page
        </button>
      </div>

      {/* Add User Form */}
      <h2>Add User</h2>
      <form>
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        {/* Add other input fields for additional user properties */}
        <button type="button" onClick={handleAddUser}>Add User</button>
      </form>
    </div>
  );
}

export default UserList;
