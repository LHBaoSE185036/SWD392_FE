import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Form } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import UserTable from '../../../components/Tables/UserTable';
import './UserManagement.css';

const API_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/customer/customer";
const TOKEN = sessionStorage.getItem("accessToken");

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
            [e.target.id]: e.target.value,
        });
        console.log(e.target.id);
        console.log(e.target.value);
    };

    const handleAddUser = async () => {
        try {
            // Make sure the form data is correctly named
            const dataToSubmit = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                email: formData.email
            };

            const response = await axios.post(API_URL, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("User creation response:", response);

            if (response.status >= 200 && response.status < 300) {
                alert("User created successfully!");
                setIsModalOpen(false);
                setFormData({ fullName: "", phoneNumber: "", email: "" });

            } else {
                alert("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert(`Failed to create user: ${error.response?.data?.message || error.message}`);
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
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddUser}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[
                            { required: true, message: "Full Name is required" }
                        ]}
                    >
                        <Input
                            placeholder="Enter Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: "Phone Number is required" },
                            { pattern: /^[0-9]+$/, message: "Phone number must be numeric" }
                        ]}
                    >
                        <Input
                            placeholder="Enter Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <div className='table-container'>
                <UserTable />
            </div>
        </div>
    );
};

export default UserManagement;