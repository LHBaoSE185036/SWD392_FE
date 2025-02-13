import React from 'react'
import './UserManagement.css'
import UserTable from '../../../components/UserTable';
import { PersonAddAlt1 } from '@mui/icons-material';

const UserManagement = () => {
  return (
    <div className="user-management">
      <div className="search-container">
        <input type="text" placeholder="Search here" className="search-input" />
      </div>

      <h1 className="page-title">User Management</h1>
      <p className="page-subtitle">Allow you to view, create, edit, or delete a user.</p>

      <UserTable />

      <button className="add-user-btn">
        <span className="add-user-icon"><PersonAddAlt1 /></span> Add User
      </button>
    </div>
  )
}

export default UserManagement;