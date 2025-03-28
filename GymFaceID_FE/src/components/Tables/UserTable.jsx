import React, { useEffect, useRef, useState } from "react";
import "../styles/UserTable.css";
import { Modal, Button, Input, Upload } from "antd";
import { AssignmentIndOutlined, DeleteOutline, DriveFileRenameOutline, UploadOutlined, VisibilityOutlined } from "@mui/icons-material";

import { registerRekognition } from "../../features/Rekognition/registerRekognition";
import Webcam from "react-webcam";

const API_URL = "/api/customer/customers";
const API_SINGLE_URL = "/api/customer/";
const TOKEN = sessionStorage.getItem("accessToken");

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
    });

    const [isFaceScanModalOpen, setIsFaceScanModalOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const webcamRef = useRef(null);

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

            const activeUsers = responseData.data.filter(user => user.status == "active");

            setUsers(activeUsers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showViewModal = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setSelectedUser(null);
    };

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
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error.message);
            alert(`Failed to update user: ${error.message}`);
        }
    };

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
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error.message);
            alert(`Failed to delete user: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log("Selected file updated:", selectedFile);
    }, [selectedFile]);    

    const showFaceScanModal = (user) => {
        setSelectedCustomerId(user.customerId);
        setIsFaceScanModalOpen(true);
    };

    const captureImage = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            setSelectedFile(null); // Reset file upload when capturing a new image
        }
    };

    const handleFileChange = (info) => {
        console.log("Upload onChange triggered:", info);
        if (!info.file) {
            console.log("No file detected in info object.");
            return;
        }
    
        const file = info.file.originFileObj;
        console.log("Extracted file:", file);
    
        if (file) {
            setSelectedFile(file);
            setCapturedImage(null); // Reset captured image if a file is selected
        } else {
            console.log("originFileObj is undefined!");
        }
    };     

    const handleRegisterFace = async () => {
        if (!selectedCustomerId) return;
        
        try {
            setScanning(true);
            await registerRekognition(capturedImage || selectedFile, selectedCustomerId);
            alert("Face registered successfully!");
            setIsFaceScanModalOpen(false);
            setCapturedImage(null);
            setSelectedFile(null);
        } catch (error) {
            alert("Face registration failed!");
        } finally {
            setScanning(false);
        }
    };

    const videoConstraints = {
        width: 480,
        height: 240,
        facingMode: "user",
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
                                <button className="register-btn" onClick={() => showFaceScanModal(user)}>
                                    <AssignmentIndOutlined />
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

            <Modal
                title="Register Face ID"
                open={isFaceScanModalOpen}
                onCancel={() => setIsFaceScanModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsFaceScanModalOpen(false)}>Cancel</Button>,
                    <Button key="register" type="primary" disabled={(!capturedImage && !selectedFile) || scanning} onClick={handleRegisterFace}>
                        {scanning ? "Processing..." : "Register"}
                    </Button>,
                ]}
            >
                <div className="face-scan-containe">
                    {!capturedImage && !selectedFile ? (
                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} className="webcam" />
                    ) : selectedFile ? (
                        <img src={selectedFile ? URL.createObjectURL(selectedFile) : ""} alt="Uploaded Face" className="captured-image" />
                    ) : (
                        <img src={capturedImage} alt="Captured Face" className="captured-image" />
                    )}

                    <div className="button-containe">
                        {!capturedImage && !selectedFile ? (
                            <button className="capture-btn" onClick={captureImage}>Capture</button>
                        ) : (
                            <button className="retake-btn" onClick={() => {
                                setCapturedImage(null);
                                setSelectedFile(null);
                            }}>Rescan</button>
                        )}
                        <Upload
                            showUploadList={false}
                            beforeUpload={(file) => {
                                console.log("Before upload:", file);
                                setSelectedFile(file); // Directly set state here
                                setCapturedImage(null);
                                return false; // Prevent default upload
                            }}
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UserTable;