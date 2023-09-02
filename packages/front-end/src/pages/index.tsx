import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface User {
  id: number;
  registered: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  adminNotes?: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('firstName');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newUser, setNewUser] = useState<User>({
    id : 0,
    registered: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    adminNotes: ''
  });
  const [editedUser, setEditedUser] = useState<User | null>(null); 
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`http://localhost:50000/users?page=${page}&pageSize=10&searchTerm=${searchTerm}&sortBy=${sortBy}`)
      .then((response) => {
        const { data, totalPages } = response.data;
        setUsers(data);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [page, sortBy, searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    axios.post('http://localhost:50000/users', newUser)
      .then((response) => {
        const newUser = response.data.data as User;
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

  const handleEditUser = (user: User) => {
    setEditedUser(user);
    setShowEditForm(true);
  };

  const handleUpdateUser = () => {
    if (!editedUser) {
      console.error('Edited user is undefined.');
      return;
    }
    axios.put(`http://localhost:50000/users/${editedUser}`, editedUser) // Note the use of editedUser.id
      .then((response) => {
        const updatedUser = response.data.data as User;
        console.log(editedUser.id)
        const updatedUsers = users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setShowEditForm(false);
      })
      .catch((error) => {
        console.error('Error updating a user:', error);
      });
  };
  

  const handleDeleteUser = (userId: number) => {
    axios.delete(`http://localhost:50000/users/${userId}`)
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
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User List */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
            <button onClick={() => handleEditUser(user)}>Edit</button>
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

      {/* Edit User Form */}
      {showEditForm && editedUser && (
  <div>
    <h2>Edit User</h2>
    <form>
      <input
        type="text"
        placeholder="First Name"
        value={editedUser.firstName}
        onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={editedUser.lastName}
        onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
      />
      {/* Add other input fields for editing user properties */}
      <button type="button" onClick={handleUpdateUser}>Save</button>
      <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
    </form>
  </div>
)}
    </div>
  );
}

export default UserList;
