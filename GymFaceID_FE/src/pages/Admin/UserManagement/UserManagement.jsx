import React, { useState } from 'react'
import './UserManagement.css'
import UserTable from '../../../components/UserTable';
import { PersonAddAlt1Outlined, SearchOffOutlined, SearchOutlined } from '@mui/icons-material';

import PFP from '../../../assets/placeholder.png'

const UserManagement = () => {
  const storedUser = sessionStorage.getItem("username");
  const storedGmailUser = sessionStorage.getItem("GG-username");
  
  return (
    <div className="user-management">
      <div className="search-container">
        <div className="search-input-border-text">Search here</div>
        <div className="search-input-border">
          <input type="text" placeholder="Search here" className="search-input" />
          <SearchOutlined className='search-icon'/>
        </div>
        <div className='user-container'>Hello, <span>{storedUser ? storedUser : storedGmailUser}</span> {/*<img src={PFP} alt="PFP" />*/}</div>
      </div>

      <div className='main-content-title-card'>
        <div className='title-box'>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Allow you to view, create, edit, or delete a user.</p>
        </div>

        <button className="add-user-btn">
          Add User
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
                  <stop offset="0%" stopColor="#00FF44" />
                  <stop offset="40%" stopColor="#34A922" />
                  <stop offset="100%" stopColor="#09FF00" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </button>
      </div>
      
      <div className='table-container'>
        <UserTable />
      </div>
      
    </div>
  )
}

export default UserManagement;