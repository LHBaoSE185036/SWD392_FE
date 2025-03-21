import React, { useEffect, useState } from "react";
import "../styles/UserTable.css";
import { Modal, Button, Input } from "antd";
import { DeleteOutline, DriveFileRenameOutline, VisibilityOutlined } from "@mui/icons-material";

const API_URL = "/api/customer/customers";
const API_SINGLE_URL = "/api/customer";
const TOKEN = sessionStorage.getItem("accessToken");

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
    });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const responseData = await response.json();

            const activeUsers = responseData.data.filter(user => user.status !== "inactive");

            setUsers(activeUsers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // View User Modal
    const showViewModal = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setSelectedUser(null);
    };

    // Edit User Modal
    const showEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName || "",
            phoneNumber: user.phoneNumber || "",
            email: user.email || "",
        });
        setIsEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`${API_SINGLE_URL}/${selectedUser.customerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log(`${API_SINGLE_URL}/${selectedUser.customerId}`)

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            alert("User updated successfully!");
            setIsEditModalOpen(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error updating user:", error.message);
            alert(`Failed to update user: ${error.message}`);
        }
    };

    // Delete User Modal
    const showDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`${API_SINGLE_URL}/${selectedUser.customerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });
            console.log(`${API_SINGLE_URL}/${selectedUser.customerId}`)

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            alert("User deleted successfully!");
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error deleting user:", error.message);
            alert(`Failed to delete user: ${error.message}`);
        }
    };

    if (loading) return <div className="loader">Loading users...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Phone Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.customerId}>
                            <td>{user.customerId}</td>
                            <td>{user.fullName}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                                <button className="view-btn" onClick={() => showViewModal(user)}>
                                    <VisibilityOutlined />
                                </button>
                                <button className="edit-btn" onClick={() => showEditModal(user)}>
                                    <DriveFileRenameOutline />
                                </button>
                                <button className="delete-btn" onClick={() => showDeleteModal(user)}>
                                    <DeleteOutline />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* View User Modal */}
            <Modal
                title="View User Details"
                open={isViewModalOpen}
                onCancel={handleViewCancel}
                footer={[
                    <Button key="back" onClick={handleViewCancel}>
                        Back
                    </Button>,
                    <Button key="edit" type="primary" onClick={() => {
                        handleViewCancel();
                        showEditModal(selectedUser);
                    }}>
                        Edit
                    </Button>,
                ]}
            >
                {selectedUser && (
                    <div>
                        <p><strong>User ID:</strong> {selectedUser.customerId}</p>
                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                        <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
                        <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
                        {/* Add any other fields that are available in your user data */}
                    </div>
                )}
            </Modal>

            {/* Edit User Modal */}
            <Modal
                title="Edit User"
                open={isEditModalOpen}
                onCancel={handleEditCancel}
                footer={[
                    <Button key="cancel" onClick={handleEditCancel}>
                        Cancel
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdateUser}>
                        Update
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
                    value={formData.email || ""}
                    onChange={handleChange}
                />
            </Modal>

            {/* Delete User Modal */}
            <Modal
                title="Delete User"
                open={isDeleteModalOpen}
                onCancel={handleDeleteCancel}
                footer={[
                    <Button key="back" onClick={handleDeleteCancel}>
                        Back
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
                        Delete
                    </Button>,
                ]}
            >
                {selectedUser && (
                    <div>
                        <p>Are you sure you want to delete this user?</p>
                        <p><strong>User ID:</strong> {selectedUser.customerId}</p>
                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                        <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default UserTable;