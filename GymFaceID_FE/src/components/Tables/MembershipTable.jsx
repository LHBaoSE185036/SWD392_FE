import React, { useState, useEffect } from "react";
import "../styles/MembershipTable.css";
import { DeleteOutline, DriveFileRenameOutline, VisibilityOutlined } from "@mui/icons-material";

const API_URL = "/api/membership/memberships";
const TOKEN = sessionStorage.getItem("accessToken");

const MembershipTable = () => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberships = async () => {
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
                setMemberships(responseData.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, []);

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

        // Parse the HH:MM:SS format
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
        <table className="membership-table">
            <thead>
                <tr>
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
                {Array.isArray(memberships) && memberships.length > 0 ? (
                    memberships.map((membership, index) => (
                        <tr key={index}>
                            <td>{membership.name}</td>
                            <td>{membership.type}</td>
                            <td>{membership.description}</td>
                            <td>{membership.trainingDay}</td>
                            <td>{membership.duration} months</td>
                            <td>{formatPrice(membership.price)}</td>
                            <td>{formatSlotTimes(membership.slotTimeResponses)}</td>
                            <td>
                                <button className="view-btn"><VisibilityOutlined /></button>
                                <button className="delete-btn"><DeleteOutline /></button>
                                <button className="edit-btn"><DriveFileRenameOutline /></button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>No memberships found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default MembershipTable;