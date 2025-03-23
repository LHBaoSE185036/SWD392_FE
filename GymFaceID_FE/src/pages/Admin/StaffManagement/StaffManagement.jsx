import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Form, Select } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import StaffTable from '../../../components/Tables/StaffTable';
import './StaffManagement.css';

const API_URL = "api/staff/staff";
const TOKEN = sessionStorage.getItem("accessToken");
const { Option } = Select;

const StaffManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "",
        accountId: null
    });

    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({ fullName: "", email: "", role: "", accountId: null });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (value) => {
        setFormData({
            ...formData,
            role: value
        });
    };

    const handleAddStaff = async () => {
        try {
            // For demo purposes, setting a random account ID if not provided
            const dataToSubmit = {
                ...formData,
                accountId: formData.accountId || Math.floor(Math.random() * 1000000) + 1000000
            };

            const response = await axios.post(API_URL, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Staff Created:", response.data);
            alert("Staff created successfully!");
            setIsModalOpen(false);
            setFormData({ fullName: "", email: "", role: "", accountId: null });
        } catch (error) {
            console.error("Error creating staff:",
                error.response?.data || error.message);
            alert(`Failed to create staff: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div className="staff-management">
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
                    <h1 className="page-title">Staff Management</h1>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete a staff.</p>
                </div>

                <Button type="primary" className="add-staff-btn" onClick={showModal}>
                    Add Staff
                </Button>
            </div>

            <Modal
                title="Add New Staff"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddStaff}
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
                            name="fullName"
                            placeholder="Enter Full Name"
                            value={formData.fullName}
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
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            { required: true, message: "Role is required" }
                        ]}
                    >
                        <Select
                            placeholder="Select Role"
                            value={formData.role}
                            onChange={handleSelectChange}
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="manager">Manager</Option>
                            <Option value="trainer">Trainer</Option>
                            <Option value="receptionist">Receptionist</Option>
                        </Select>
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
                <StaffTable />
            </div>
        </div>
    );
};

export default StaffManagement;