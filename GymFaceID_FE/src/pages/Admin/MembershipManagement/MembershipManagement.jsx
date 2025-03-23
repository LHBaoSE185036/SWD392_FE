import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Form, message, Select, InputNumber } from 'antd';
import './MembershipManagement.css';
import MembershipTable from '../../../components/Tables/MembershipTable';
import { SearchOutlined } from '@mui/icons-material';
import moment from 'moment';

const API_URL = "/api/membership/membership";
const TOKEN = sessionStorage.getItem("accessToken");

const MembershipManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: "",
        trainingDay: null,
        duration: null,
        price: null,
        slotTimeType: "",
        slotTimeRequest: []
    });

    const storedUser = sessionStorage.getItem("username");
    const storedGmailUser = sessionStorage.getItem("GG-username");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({
            name: "",
            type: "",
            description: "",
            trainingDay: null,
            duration: null,
            price: null,
            slotTimeType: "",
            slotTimeRequest: []
        });
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateSlotTimeRequest = (index, key, value) => {
        setFormData((prev) => {
            const updatedSlots = [...prev.slotTimeRequest];
            updatedSlots[index] = { ...updatedSlots[index], [key]: value };
            return { ...prev, slotTimeRequest: updatedSlots };
        });
    };

    const addSlotTime = () => {
        setFormData((prev) => ({
            ...prev,
            slotTimeRequest: [
                ...prev.slotTimeRequest,
                {
                    slotTimeType: "",
                    startTime: "",
                    endTime: ""
                }
            ]
        }));
    };

    // Function to validate time format (HH:MM or HH:MM:SS)
    const isValidTimeFormat = (timeString) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
        return timeRegex.test(timeString);
    };

    // Add missing :00 for HH:MM format to make it HH:MM:SS
    const formatTimeString = (timeString) => {
        if (!timeString) return "";

        const match = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (match) {
            let [_, hours, minutes, seconds] = match;
            hours = hours.padStart(2, "0");
            seconds = seconds || "00";
            return `${hours}:${minutes}:${seconds}`;
        }

        return timeString;
    };


    const validateForm = () => {
        let errors = {};

        // Basic field validations
        if (!formData.name || !formData.name.trim()) errors.name = "Membership Name is required";
        if (!formData.type || !formData.type.trim()) errors.type = "Type is required";
        if (!formData.description || !formData.description.trim()) errors.description = "Description is required";

        // Number validations
        if (!formData.trainingDay) errors.trainingDay = "Training Day is required";
        else if (formData.trainingDay <= 0) errors.trainingDay = "Training Day must be a positive number";

        if (!formData.duration) errors.duration = "Duration is required";
        else if (formData.duration <= 0) errors.duration = "Duration must be a positive number";

        if (!formData.price) errors.price = "Price is required";
        else if (formData.price <= 0) errors.price = "Price must be a positive number";

        if (!formData.slotTimeType || !formData.slotTimeType.trim()) errors.slotTimeType = "Slot Time Type is required";

        // Slot time validations
        if (formData.slotTimeRequest.length === 0) {
            errors.slotTimeRequest = "At least one slot time is required";
        } else {
            formData.slotTimeRequest.forEach((slot, index) => {
                if (!slot.slotTimeType || !slot.slotTimeType.trim()) {
                    errors[`slotTimeType_${index}`] = `Slot Time Type ${index + 1} is required`;
                }

                if (!slot.startTime) {
                    errors[`startTime_${index}`] = `Start Time ${index + 1} is required`;
                } else if (!isValidTimeFormat(slot.startTime)) {
                    errors[`startTime_${index}`] = `Start Time must be in format HH:MM or HH:MM:SS`;
                }

                if (!slot.endTime) {
                    errors[`endTime_${index}`] = `End Time ${index + 1} is required`;
                } else if (!isValidTimeFormat(slot.endTime)) {
                    errors[`endTime_${index}`] = `End Time must be in format HH:MM or HH:MM:SS`;
                }

                // Validate time range - only if both times are valid
                if (slot.startTime && slot.endTime &&
                    isValidTimeFormat(slot.startTime) && isValidTimeFormat(slot.endTime)) {
                    const startMoment = moment(formatTimeString(slot.startTime), "HH:mm:ss");
                    const endMoment = moment(formatTimeString(slot.endTime), "HH:mm:ss");

                    if (startMoment.isValid() && endMoment.isValid() && !endMoment.isAfter(startMoment)) {
                        errors[`timeRange_${index}`] = `End Time must be after Start Time for slot ${index + 1}`;
                    }
                }
            });
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddMembership = async () => {
        if (!validateForm()) {
            message.error("Please fill in all required fields correctly.");
            return;
        }

        try {
            // Format time strings in slot time requests
            const formattedSlotTimeRequest = formData.slotTimeRequest.map(slot => ({
                ...slot,
                startTime: formatTimeString(slot.startTime),
                endTime: formatTimeString(slot.endTime)
            }));

            const requestData = {
                ...formData,
                trainingDay: Number(formData.trainingDay),
                duration: Number(formData.duration),
                price: Number(formData.price),
                slotTimeType: formData.slotTimeType,
                slotTimeRequest: formattedSlotTimeRequest,
                status: "active" // Adding status field as active by default
            };

            console.log(API_URL);

            const response = await axios.post(API_URL, requestData, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(API_URL);

            message.success("Membership created successfully!");
            setIsModalOpen(false);
            setFormData({
                name: "",
                type: "",
                description: "",
                trainingDay: null,
                duration: null,
                price: null,
                slotTimeType: "",
                slotTimeRequest: []
            });

        } catch (error) {
            console.error("Error creating membership:", error.response?.data || error.message);
            message.error(`Failed to create membership: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className="membership-management">
            <div className="search-container">
                <div className="search-input-border-text">Search here</div>
                <div className="search-input-border">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="search-input"
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <SearchOutlined className='search-icon' />
                </div>
                <div className='user-container'>Hello, <span>{storedUser ? storedUser : storedGmailUser}</span> </div>
            </div>
            <div className='main-content-title-card'>
                <div className='title-box'>
                    <h2 className="page-title">Membership Management</h2>
                    <p className="page-subtitle">Allow you to view, create, edit, or delete memberships.</p>
                </div>
                <Button type="primary" className="add-membership-btn" onClick={showModal}>
                    Add Membership
                </Button>
            </div>

            <Modal
                title="Add New Membership"
                open={isModalOpen}
                onCancel={handleCancel}
                width={700}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddMembership}>
                        Submit
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item
                        label="Membership Name"
                        validateStatus={formErrors.name ? "error" : ""}
                        help={formErrors.name}
                        required
                    >
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter membership name"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        validateStatus={formErrors.type ? "error" : ""}
                        help={formErrors.type}
                        required
                    >
                        <Select
                            placeholder="Select membership type"
                            value={formData.type || undefined}
                            onChange={(value) => handleNumberChange("type", value)}
                        >
                            <Select.Option value="basic">Basic</Select.Option>
                            <Select.Option value="premium">Premium</Select.Option>
                            <Select.Option value="student">Student</Select.Option>
                            <Select.Option value="guest">Guest</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        validateStatus={formErrors.description ? "error" : ""}
                        help={formErrors.description}
                        required
                    >
                        <Input.TextArea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            rows={3}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            label="Training Days"
                            validateStatus={formErrors.trainingDay ? "error" : ""}
                            help={formErrors.trainingDay}
                            required
                            style={{ width: '33%' }}
                        >
                            <InputNumber
                                min={1}
                                placeholder="Days"
                                value={formData.trainingDay}
                                onChange={(value) => handleNumberChange("trainingDay", value)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Duration (months)"
                            validateStatus={formErrors.duration ? "error" : ""}
                            help={formErrors.duration}
                            required
                            style={{ width: '33%' }}
                        >
                            <InputNumber
                                min={1}
                                placeholder="Months"
                                value={formData.duration}
                                onChange={(value) => handleNumberChange("duration", value)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            validateStatus={formErrors.price ? "error" : ""}
                            help={formErrors.price}
                            required
                            style={{ width: '33%' }}
                        >
                            <InputNumber
                                min={0}
                                placeholder="Price"
                                value={formData.price}
                                onChange={(value) => handleNumberChange("price", value)}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Slot Time Type (ex: Khung giờ A, Khung giờ B)"
                        validateStatus={formErrors.slotTimeType ? "error" : ""}
                        help={formErrors.slotTimeType}
                        required
                    >
                        <Input
                            name="slotTimeType"
                            value={formData.slotTimeType}
                            onChange={handleChange}
                            placeholder="Enter general slot time type"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Slot Time Request"
                        validateStatus={formErrors.slotTimeRequest ? "error" : ""}
                        help={formErrors.slotTimeRequest}
                        required
                    >
                        <Button type="dashed" onClick={addSlotTime} style={{ marginBottom: '10px' }}>
                            + Add Slot Time
                        </Button>
                    </Form.Item>

                    {formData.slotTimeRequest.map((slot, index) => (
                        <div key={index} style={{
                            border: '1px solid #f0f0f0',
                            padding: '16px',
                            borderRadius: '4px',
                            marginBottom: '16px'
                        }}>
                            <h4>Slot Time {index + 1}</h4>

                            <Form.Item
                                label="Slot Time Type"
                                validateStatus={formErrors[`slotTimeType_${index}`] ? "error" : ""}
                                help={formErrors[`slotTimeType_${index}`]}
                                required
                            >
                                <Input
                                    placeholder="e.g. Sáng, Tối"
                                    value={slot.slotTimeType}
                                    onChange={(e) => updateSlotTimeRequest(index, "slotTimeType", e.target.value)}
                                />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Start Time (HH:MM or HH:MM:SS)"
                                    validateStatus={formErrors[`startTime_${index}`] ? "error" : ""}
                                    help={formErrors[`startTime_${index}`]}
                                    required
                                    style={{ width: '50%' }}
                                >
                                    <Input
                                        placeholder="e.g. 08:00 or 08:00:00"
                                        value={slot.startTime}
                                        onChange={(e) => updateSlotTimeRequest(index, "startTime", e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="End Time (HH:MM or HH:MM:SS)"
                                    validateStatus={formErrors[`endTime_${index}`] ? "error" : ""}
                                    help={formErrors[`endTime_${index}`]}
                                    required
                                    style={{ width: '50%' }}
                                >
                                    <Input
                                        placeholder="e.g. 09:30 or 09:30:00"
                                        value={slot.endTime}
                                        onChange={(e) => updateSlotTimeRequest(index, "endTime", e.target.value)}
                                    />
                                </Form.Item>
                            </div>

                            {formErrors[`timeRange_${index}`] && (
                                <div style={{ color: '#ff4d4f', marginBottom: '8px' }}>
                                    {formErrors[`timeRange_${index}`]}
                                </div>
                            )}

                            {index > 0 && (
                                <Button
                                    danger
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            slotTimeRequest: prev.slotTimeRequest.filter((_, i) => i !== index)
                                        }));
                                    }}
                                >
                                    Remove Slot
                                </Button>
                            )}
                        </div>
                    ))}
                </Form>
            </Modal>

            <div className='table-container'>
                <MembershipTable searchText={searchText} />
            </div>
        </div>
    );
};

export default MembershipManagement;