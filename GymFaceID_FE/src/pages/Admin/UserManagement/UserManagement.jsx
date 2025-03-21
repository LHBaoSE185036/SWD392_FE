import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import UserTable from '../../../components/Tables/UserTable';
import './UserManagement.css';

const API_URL = "/api/customer/customer";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraGFuZ2RuIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyNTcwMjg4LCJleHAiOjE3NDI2NTY2ODh9.xekGSUihIEfEjWAyjkMYiKX-bFjIc2A5-ZF3Dje-qzE";

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
    });

    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({ fullName: "", phoneNumber: "", email: "" });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddUser = async () => {
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("User Created:", response.data);
            alert("User created successfully!");
            setIsModalOpen(false);
            setFormData({ fullName: "", phoneNumber: "", email: "" });

            // Trigger a refresh of the UserTable
            // This assumes your UserTable has a way to refresh data
            // You might need to implement a custom event or callback function
        } catch (error) {
            console.error("Error creating user:",
                error.response?.data || error.message);
            alert(`Failed to create user: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div className="user-management">
            <div className="search-container">
                <div className="search-input-border-text">Search here</div>
                <div className="search-input-border">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <SearchOutlined className='search-icon' />
                </div>
                <div className='user-container'>Hello, <span>{storedUser ? storedUser : storedGmailUser}</span> </div>
            </div>

            <div className='main-content-title-card'>
                <div className='title-box'>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete a user.</p>
                </div>

                <Button type="primary" className="add-user-btn" onClick={showModal}>
                    Add User
                </Button>
            </div>

            <Modal
                title="Add New User"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddUser}>
                        Submit
                    </Button>,
                ]}
            >
                <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </Modal>

            <div className='table-container'>
                <UserTable />
            </div>
        </div>
    );
};

export default UserManagement;