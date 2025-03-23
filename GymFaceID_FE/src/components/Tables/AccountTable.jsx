import React, { useEffect, useState } from "react";
import "../styles/AccountTable.css";
import { Modal, Button, Input, Select } from "antd";
import { DeleteOutline, DriveFileRenameOutline, VisibilityOutlined } from "@mui/icons-material";

const API_URL = "/api/account/accounts";
const API_SINGLE_URL = "/api/account";
const TOKEN = sessionStorage.getItem("accessToken");
const { Option } = Select;

const AccountTable = () => {
    const [Accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({
        userName: "",
        role: "",
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch Accounts");
            }
            const responseData = await response.json();
            console.log(responseData);
            

            const activeAccounts = responseData.data.filter(Account => Account.status === true);

            setAccounts(activeAccounts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showViewModal = (Account) => {
        setSelectedAccount(Account);
        setIsViewModalOpen(true);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setSelectedAccount(null);
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

    const showDeleteModal = (Account) => {
        setSelectedAccount(Account);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedAccount(null);
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${API_SINGLE_URL}/${selectedAccount.accountId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });
            console.log(`${API_SINGLE_URL}/${selectedAccount.accountId}`)

            if (!response.ok) {
                throw new Error("Failed to delete Account");
            }

            alert("Account deleted successfully!");
            setIsDeleteModalOpen(false);
            setSelectedAccount(null);
            fetchAccounts();
        } catch (error) {
            console.error("Error deleting Account:", error.message);
            alert(`Failed to delete Account: ${error.message}`);
        }
    };

    if (loading) return <div className="loader">Loading Accounts...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Accounts.map((Account, index) => (
                        <tr key={index}>
                            <td>{Account.accountId}</td>
                            <td>{Account.userName}</td>
                            <td>{Account.role}</td>
                            <td>
                                <button className="view-btn" onClick={() => showViewModal(Account)}>
                                    <VisibilityOutlined />
                                </button>

                                <button className="delete-btn" onClick={() => showDeleteModal(Account)}>
                                    <DeleteOutline />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* View Staff Modal */}
            <Modal
                title="View Account Details"
                open={isViewModalOpen}
                onCancel={handleViewCancel}
                footer={[
                    <Button key="back" onClick={handleViewCancel}>
                        Back
                    </Button>,
                ]}
            >
                {selectedAccount && (
                    <div>
                        <p><strong>Account ID:</strong> {selectedAccount.accountId}</p>
                        <p><strong>Username:</strong> {selectedAccount.userName}</p>
                        <p><strong>Role:</strong> {selectedAccount.role}</p>
                    </div>
                )}
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                title="Delete Account"
                open={isDeleteModalOpen}
                onCancel={handleDeleteCancel}
                footer={[
                    <Button key="back" onClick={handleDeleteCancel}>
                        Back
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDeleteAccount}>
                        Delete
                    </Button>,
                ]}
            >
                {selectedAccount && (
                    <div>
                        <p>Are you sure you want to delete this Account?</p>
                        <p><strong>Account ID:</strong> {selectedAccount.accountId}</p>
                        <p><strong>Username:</strong> {selectedAccount.userName}</p>
                        <p><strong>Role:</strong> {selectedAccount.role}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AccountTable;