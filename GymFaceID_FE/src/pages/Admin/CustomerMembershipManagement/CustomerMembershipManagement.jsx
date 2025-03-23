import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, message, Select } from 'antd';
import { SearchOutlined, DeleteOutline, VisibilityOutlined, CloseOutlined } from '@mui/icons-material';
import "./CustomerMembershipManagement.css";

const API_URL = "/api/customer-membership/all";
const CUSTOMERS_API_URL = "/api/customer/customers";
const MEMBERSHIPS_API_URL = "/api/membership/memberships";
const REGISTER_API_URL = "/api/customer-membership/register";
const DELETE_API_URL = "/api/customer-membership/"
const TOKEN = sessionStorage.getItem("accessToken");
const { Option } = Select;

// View Modal Component
const ViewCustomerMembershipModal = ({ customerMembership, onClose }) => {
    if (!customerMembership) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content view-modal">
                <div className="modal-header">
                    <h2>Customer Membership Details</h2>
                    <button className="close-btn" onClick={onClose}><CloseOutlined /></button>
                </div>
                <div className="modal-body">
                    <div className="detail-row">
                        <span className="detail-label">ID:</span>
                        <span className="detail-value">{customerMembership.id}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">
                            {customerMembership.customerName} ({customerMembership.customerId})
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Membership:</span>
                        <span className="detail-value">
                            {customerMembership.name} ({customerMembership.id})
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Start Date:</span>
                        <span className="detail-value">{customerMembership.startDate}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">End Date:</span>
                        <span className="detail-value">{customerMembership.endDate}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Session Counter:</span>
                        <span className="detail-value">{customerMembership.sessionCounter}</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="close-modal-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const DeleteCustomerMembershipModal = ({ customerMembership, onClose, onConfirm }) => {
    if (!customerMembership) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <div className="modal-header">
                    <h2>Confirm Deletion</h2>
                    <button className="close-btn" onClick={onClose}><CloseOutlined /></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete the customer membership for <strong>"{customerMembership.customerName}"</strong> with membership <strong>"{customerMembership.membershipName}"</strong>?</p>
                    <p>This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="confirm-delete-btn" onClick={() => onConfirm(customerMembership.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const CustomerMembershipTable = ({ searchText, refreshTable }) => {
    const [customerMemberships, setCustomerMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewModal, setViewModal] = useState({ show: false, customerMembership: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, customerMembership: null });
    const [customers, setCustomers] = useState({}); 
    const [memberships, setMemberships] = useState({}); 

    const fetchData = async () => {
        setLoading(true);
        try {
            const membershipResponse = await axios.get(API_URL, {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });
            if (membershipResponse.data && membershipResponse.data.success) {
                setCustomerMemberships(membershipResponse.data.data);
            } else {
                throw new Error("Failed to fetch customer memberships");
            }

            const customersResponse = await axios.get(CUSTOMERS_API_URL, {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });

            if (customersResponse.data && customersResponse.data.data) {
                // Create a map of customer IDs to names
                const customerMap = {};
                customersResponse.data.data.forEach(customer => {
                    customerMap[customer.customerId] = customer.fullName;
                });
                setCustomers(customerMap);
            }


            // Fetch memberships for mapping
            const membershipsResponse = await axios.get(MEMBERSHIPS_API_URL, {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });
            if (membershipsResponse.data && membershipsResponse.data.data) {
                const membershipMap = {};
                membershipsResponse.data.data.forEach(membership => {
                    membershipMap[membership.id] = membership.name;
                });
                setMemberships(membershipMap);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTable]);

    const handleDeleteCustomerMembership = async (id) => {
        try {
            console.log(`Deleting customer membership with ID: ${id}`);

            const response = await fetch(`${DELETE_API_URL}/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${TOKEN}`,
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete: ${response.status}`);
            }

            setCustomerMemberships(customerMemberships.filter(cm => cm.id !== id));
            setDeleteModal({ show: false, customerMembership: null });
            message.success("Customer membership deleted successfully");
        } catch (err) {
            console.error("Error deleting customer membership:", err);
            message.error(`Error: ${err.message}`);
        }
    };

    const filteredCustomerMemberships = searchText
        ? customerMemberships.filter(cm =>
            cm.id.toString().includes(searchText) ||
            cm.customerId.toString().includes(searchText) ||
            cm.membershipId.toString().includes(searchText) ||
            (customers[cm.customerId] && customers[cm.customerId].toLowerCase().includes(searchText.toLowerCase())) ||
            (memberships[cm.membershipId] && memberships[cm.membershipId].toLowerCase().includes(searchText.toLowerCase()))
        )
        : customerMemberships;
    if (loading) return <div className="loader">Loading customer memberships...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    return (
        <>
            <table className="customer-membership-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Membership</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Session Counter</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomerMemberships.length > 0 ? (
                        filteredCustomerMemberships.map((customerMembership) => (
                            <tr key={customerMembership.id}>
                                <td>{customerMembership.id}</td>
                                <td>
                                    {customers[customerMembership.customerId] || 'Unknown'}
                                    <span className="id-label">({customerMembership.customerId})</span>
                                </td>
                                <td>
                                    {memberships[customerMembership.membershipId] || 'Not registered'}
                                    <span className="id-label">({customerMembership.membershipId})</span>
                                </td>
                                <td>{customerMembership.startDate}</td>
                                <td>{customerMembership.endDate}</td>
                                <td>{customerMembership.sessionCounter}</td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => setViewModal({ show: true, customerMembership })}
                                    >
                                        <VisibilityOutlined />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => setDeleteModal({ show: true, customerMembership })}
                                    >
                                        <DeleteOutline />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No customer memberships found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {viewModal.show && (
                <ViewCustomerMembershipModal
                    customerMembership={{
                        ...viewModal.customerMembership,
                        customerName: customers[viewModal.customerMembership.customerId] || 'Unknown',
                        membershipName: memberships[viewModal.customerMembership.membershipId] || 'Unknown'
                    }}
                    onClose={() => setViewModal({ show: false, customerMembership: null })}
                />
            )}

            {deleteModal.show && (
                <DeleteCustomerMembershipModal
                    customerMembership={{
                        ...deleteModal.customerMembership,
                        customerName: customers[deleteModal.customerMembership.customerId] || 'Unknown',
                        membershipName: memberships[deleteModal.customerMembership.membershipId] || 'Unknown'
                    }}
                    onClose={() => setDeleteModal({ show: false, customerMembership: null })}
                    onConfirm={handleDeleteCustomerMembership}
                />
            )}
        </>
    );
};

// Main CustomerMembershipManagement Component
const CustomerMembershipManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        customerId: null,
        membershipId: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [customers, setCustomers] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingMemberships, setLoadingMemberships] = useState(false);
    const [refreshTable, setRefreshTable] = useState(0);

    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    // Fetch customers and memberships when modal opens
    useEffect(() => {
        if (isModalOpen) {
            fetchCustomers();
            fetchMemberships();
        }
    }, [isModalOpen]);

    const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const response = await axios.get(CUSTOMERS_API_URL, {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            } else {
                throw new Error("Invalid response format for customers");
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
            message.error(`Failed to load customers: ${err.message}`);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchMemberships = async () => {
        setLoadingMemberships(true);
        try {
            const response = await axios.get(MEMBERSHIPS_API_URL, {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setMemberships(response.data.data);
            } else {
                throw new Error("Invalid response format for memberships");
            }
        } catch (err) {
            console.error("Error fetching memberships:", err);
            message.error(`Failed to load memberships: ${err.message}`);
        } finally {
            setLoadingMemberships(false);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            customerId: null,
            membershipId: null
        });
        setFormErrors({});
    };

    const handleCustomerChange = (value) => {
        setFormData({
            ...formData,
            customerId: value
        });
    };

    const handleMembershipChange = (value) => {

        setFormData({
            ...formData,
            membershipId: value
        });
    };

    const validateForm = () => {
        let errors = {};

        if (!formData.customerId) errors.customerId = "Customer is required";
        if (!formData.membershipId) errors.membershipId = "Membership is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegisterCustomerMembership = async () => {
        if (!validateForm()) {
            message.error("Please select both a customer and a membership.");
            return;
        }

        try {
            const response = await fetch(`${REGISTER_API_URL}?customerId=${formData.customerId}&membershipId=${formData.membershipId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                },
            });

            console.log(`${REGISTER_API_URL}?customerId=${formData.customerId}&membershipId=${formData.membershipId}`);

            if (!response.ok) {
                throw new Error(`Failed to register: ${response.statusText}`);
            }

            const data = await response.json();

            if (data && data.success) {
                message.success("Customer membership registered successfully!");
                setIsModalOpen(false);
                setFormData({
                    customerId: null,
                    membershipId: null
                });

                setRefreshTable(prev => prev + 1);
            } else {
                throw new Error(data.message || "Failed to register customer membership");
            }
        } catch (error) {
            console.error("Error registering customer membership:", error);
            message.error(`Failed to register customer membership: ${error.message}`);
        }
    };

    // Modal footer buttons with proper keys
    const modalFooterButtons = [
        <Button key="cancel-button" onClick={handleCancel}>
            Cancel
        </Button>,
        <Button key="register-button" type="primary" onClick={handleRegisterCustomerMembership}>
            Register
        </Button>
    ];

    return (
        <div className="customer-membership-management">
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
                    <h1 className="page-title">Customer Membership Management</h1>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete customer memberships.</p>
                </div>

                <Button type="primary" className="add-customer-membership-btn" onClick={showModal}>
                    Add Customer Membership
                </Button>
            </div>

            <Modal
                title="Register New Customer Membership"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={modalFooterButtons}
            >
                <Form layout="vertical">
                    <Form.Item
                        label="Customer"
                        validateStatus={formErrors.customerId ? "error" : ""}
                        help={formErrors.customerId}
                        required
                    >
                        <Select
                            placeholder="Select Customer"
                            loading={loadingCustomers}
                            value={formData.customerId}
                            onChange={handleCustomerChange}
                            style={{ width: '100%' }}
                        >
                            {customers.map(customer => (
                                <Option key={`customer-${customer.customerId}`} value={customer.customerId}>
                                    {customer.fullName} ({customer.customerId})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Membership"
                        validateStatus={formErrors.membershipId ? "error" : ""}
                        help={formErrors.membershipId}
                        required
                    >
                        <Select
                            placeholder="Select Membership"
                            loading={loadingMemberships}
                            value={formData.membershipId}
                            onChange={handleMembershipChange}
                            style={{ width: '100%' }}
                        >
                            {memberships.map(membership => (
                                <Option key={`membership-${membership.id}`} value={membership.id}>
                                    {membership.name} ({membership.id})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <div className='table-container'>
                <CustomerMembershipTable searchText={searchText} refreshTable={refreshTable} />
            </div>
        </div>
    );
};

export default CustomerMembershipManagement;