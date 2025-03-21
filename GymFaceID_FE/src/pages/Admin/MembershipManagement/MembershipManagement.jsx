import React from 'react';
import './MembershipManagement.css';
import MembershipTable from '../../../components/Tables/MembershipTable';
import { PersonAddAlt1Outlined, SearchOutlined } from '@mui/icons-material';

const MembershipManagement = () => {
    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    return (
        <div className="membership-management">
            <div className="search-container">
                <div className="search-input-border-text">Search here</div>
                <div className="search-input-border">
                    <input type="text" placeholder="Search here" className="search-input" />
                    <SearchOutlined className='search-icon' />
                </div>
                <div className='user-container'>Hello, <span>{storedUser ? storedUser : storedGmailUser}</span> </div>
            </div>
            <div className='main-content-title-card'>
                <div className='title-box'>
                    <h1 className="page-title">Membership Management</h1>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete memberships.</p>
                </div>
                <button className="add-membership-btn">
                    Add Membership
                </button>
            </div>

            <div className='table-container'>
                <MembershipTable />
            </div>
        </div>
    );
};

export default MembershipManagement;