import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Form, Select } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import AccountTable from '../../../components/Tables/AccountTable';
import './AccountManagement.css';

const API_URL = "/api/Account/Account";
const ADDAPI_URL = "/api/account/create"
const TOKEN = sessionStorage.getItem("accessToken");
const { Option } = Select;

const AccountManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        role: ""
    });

    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({ userName: "", password: "", role: "" });
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

    const handleAddAccount = async () => {
        try {
            const dataToSubmit = {
                username: formData.userName,
                password: formData.password,
                role: formData.role.toUpperCase()
            };
            console.log(dataToSubmit);
            const response = await axios.post(ADDAPI_URL, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Account created successfully!");
            setIsModalOpen(false);
            setFormData({ userName: "", password: "", role: "" });
        } catch (error) {
            console.error("Error creating Account:",
                error.response?.data || error.message);
            alert(`Failed to create Account: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div className="Account-management">
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
                    <h1 className="page-title">Account Management</h1>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete a Account.</p>
                </div>

                <Button type="primary" className="add-Account-btn" onClick={showModal}>
                    Add Account
                </Button>
            </div>

            <Modal
                title="Add New Account"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddAccount}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[
                            { required: true, message: "Username is required" }
                        ]}
                    >
                        <Input
                            name="userName"
                            placeholder="Enter Username"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: "Password is required" }
                        ]}
                    >
                        <Input.Password
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
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
                <AccountTable />
            </div>
        </div>
    );
};

export default AccountManagement;