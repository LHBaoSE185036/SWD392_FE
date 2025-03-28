import React, { useState, useEffect } from "react";
import "../styles/MembershipTable.css";
import { DeleteOutline, VisibilityOutlined, CloseOutlined } from "@mui/icons-material";

const API_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/membership/memberships";
const API_DELETURL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/membership/membership";
const TOKEN = sessionStorage.getItem("accessToken");

const ViewMembershipModal = ({ membership, onClose }) => {
    if (!membership) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatTime = (timeString) => {
        if (!timeString || typeof timeString !== 'string') {
            return "N/A";
        }

        const timeParts = timeString.split(':');
        if (timeParts.length < 2) {
            return "N/A";
        }

        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        if (isNaN(hour) || isNaN(minute)) {
            return "N/A";
        }

        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        return `${formattedHour}:${formattedMinute}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content view-modal">
                <div className="modal-header">
                    <h2>Membership Details</h2>
                    <button className="close-btn" onClick={onClose}><CloseOutlined /></button>
                </div>
                <div className="modal-body">
                    <div className="detail-row">
                        <span className="detail-label">ID:</span>
                        <span className="detail-value">{membership.id}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{membership.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{membership.type}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{membership.description}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Training Days:</span>
                        <span className="detail-value">{membership.trainingDay}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{membership.duration} months</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">{formatPrice(membership.price)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Time Slots:</span>
                        <div className="detail-value">
                            {Array.isArray(membership.slotTimeResponses) && membership.slotTimeResponses.length > 0 ? (
                                <ul className="time-slots-list">
                                    {membership.slotTimeResponses.map((slot, index) => (
                                        <li key={index}>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>No time slots available</span>
                            )}
                        </div>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-badge">{membership.status}</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="close-modal-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const DeleteMembershipModal = ({ membership, onClose, onConfirm }) => {
    if (!membership) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <div className="modal-header">
                    <h2>Confirm Deletion</h2>
                    <button className="close-btn" onClick={onClose}><CloseOutlined /></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to deactivate the membership <strong>"{membership.name}"</strong>?</p>
                    <p>This will set the membership status to inactive.</p>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="confirm-delete-btn" onClick={() => onConfirm(membership.id)}>Deactivate</button>
                </div>
            </div>
        </div>
    );
};

const MembershipTable = ({ searchText, onRefresh }) => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewModal, setViewModal] = useState({ show: false, membership: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, membership: null });

    const fetchMemberships = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch memberships");
            }

            const responseData = await response.json();
            console.log("API response:", responseData);

            const activeMemberships = Array.isArray(responseData.data)
                ? responseData.data.filter(membership => membership.status === "active")
                : [];

            setMemberships(activeMemberships);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    const handleDeactivateMembership = async (membershipId) => {
        try {
            const response = await fetch(`${API_DELETURL}/${membershipId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                },
            });
            console.log(`${API_DELETURL}/${membershipId}`);  

            if (!response.ok) {
                throw new Error("Failed to deactivate membership");
            }

            setDeleteModal({ show: false, membership: null });

            fetchMemberships();

            if (onRefresh) {
                onRefresh();
            }

            alert("Membership has been deactivated successfully");
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredMemberships = searchText
        ? memberships.filter(membership =>
            membership.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            membership.type?.toLowerCase().includes(searchText.toLowerCase()) ||
            membership.description?.toLowerCase().includes(searchText.toLowerCase()))
        : memberships;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatTime = (timeString) => {
        if (!timeString || typeof timeString !== 'string') {
            return "N/A";
        }

        const timeParts = timeString.split(':');
        if (timeParts.length < 2) {
            return "N/A";
        }

        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        if (isNaN(hour) || isNaN(minute)) {
            return "N/A";
        }

        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        return `${formattedHour}:${formattedMinute}`;
    };

    const formatSlotTimes = (slotTimeResponses) => {
        if (!Array.isArray(slotTimeResponses) || slotTimeResponses.length === 0) {
            return "No slots available";
        }

        return (
            <div className="time-slots">
                {slotTimeResponses.map((slot, index) => (
                    <div key={index} className="time-slot">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div className="loader">Loading memberships...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <table className="membership-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Training Days</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Time Slots</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMemberships.length > 0 ? (
                        filteredMemberships.map((membership, index) => (
                            <tr key={index}>
                                <td>{membership.id}</td>
                                <td>{membership.name}</td>
                                <td>{membership.type}</td>
                                <td>{membership.description}</td>
                                <td>{membership.trainingDay}</td>
                                <td>{membership.duration} months</td>
                                <td>{formatPrice(membership.price)}</td>
                                <td>{formatSlotTimes(membership.slotTimeResponses)}</td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => setViewModal({ show: true, membership })}
                                    >
                                        <VisibilityOutlined />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => setDeleteModal({ show: true, membership })}
                                    >
                                        <DeleteOutline />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No active memberships found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {viewModal.show && (
                <ViewMembershipModal
                    membership={viewModal.membership}
                    onClose={() => setViewModal({ show: false, membership: null })}
                />
            )}

            {deleteModal.show && (
                <DeleteMembershipModal
                    membership={deleteModal.membership}
                    onClose={() => setDeleteModal({ show: false, membership: null })}
                    onConfirm={handleDeactivateMembership}
                />
            )}
        </>
    );
};

export default MembershipTable;