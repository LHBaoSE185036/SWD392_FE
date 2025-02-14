import React from 'react'
import './UserManagement.css'
import UserTable from '../../../components/UserTable';
import { PersonAddAlt1Outlined } from '@mui/icons-material';

const UserManagement = () => {
  return (
    <div className="user-management">
      <div className="search-container">
        <input type="text" placeholder="Search here" className="search-input" />
      </div>

      <div className='main-content-title-card'>
        <div className='title-box'>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Allow you to view, create, edit, or delete a user.</p>
        </div>

        <button className="add-user-btn">
          <span className="add-user-icon">
            <PersonAddAlt1Outlined 
              sx={{
                width: "60%",
                height: "60%",
                fill: "url(#gradient-fill)",
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#006AFF" />
                  <stop offset="100%" stopColor="#E447EA" />
                </linearGradient>
              </defs>
            </svg>
          </span> 
          Add User
        </button>
      </div>
      
      <UserTable />

      
    </div>
  )
}

export default UserManagement;