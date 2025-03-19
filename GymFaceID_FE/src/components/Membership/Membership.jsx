import React, { useContext, useState } from "react";
import { themeContext } from "../../Context";
import "./Membership.css";

const Membership = () => {
    const theme = useContext(themeContext);
    const darkMode = theme.state.darkMode;

    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        { name: "Basic Plan", price: 50, description: "Basic access to gym facilities.", trainingDay: 30, duration: 1, slotTimeType: "Khung giờ A", slotTimeResponses: [{ slotTimeType: "Sáng", startTime: "05:30:00", endTime: "08:00:00" }, { slotTimeType: "Tối", startTime: "18:00:00", endTime: "21:00:00" }] },
        { name: "Premium Plan", price: 100, description: "Premium access with personal trainer.", trainingDay: 60, duration: 2, slotTimeType: "Khung giờ A", slotTimeResponses: [] },
        { name: "Extended Basic", price: 40, description: "Extended duration for basic plan.", trainingDay: 90, duration: 3, slotTimeType: "Khung giờ B", slotTimeResponses: [] },
        { name: "Gói sinh viên khung giờ A", price: 150000, description: "Gói sinh viên với giá ưu đãi", trainingDay: 24, duration: 1, slotTimeType: "Khung giờ A", slotTimeResponses: [{ slotTimeType: "Sáng", startTime: "05:30:00", endTime: "08:00:00" }, { slotTimeType: "Tối", startTime: "18:00:00", endTime: "21:00:00" }] },
        { name: "Gói khách khung giờ A", price: 200000, description: "Gói cho khách hàng thường tập", trainingDay: 24, duration: 1, slotTimeType: "Khung giờ A", slotTimeResponses: [{ slotTimeType: "Sáng", startTime: "05:30:00", endTime: "08:00:00" }, { slotTimeType: "Tối", startTime: "18:00:00", endTime: "21:00:00" }] }
    ];

    const handleBoxClick = (plan) => {
        setSelectedPlan(plan);
    };

    const closePopup = () => {
        setSelectedPlan(null);
    };

    return (
        <div className="membership" id="membership">
            <h2 className="membershipTitle" style={{ color: darkMode ? "var(--orange)" : "#a1a1a1" }}>
                Take A Look At Our Plans As Well
            </h2>

            <div className="membershipContainer">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className="membershipBox"
                        style={{
                            background: darkMode
                                ? "linear-gradient(0deg, #1a1a1a,#575757)"
                                : "linear-gradient(0deg, #ffffff, #d1d1d1)"
                        }}                        onClick={() => handleBoxClick(plan)}
                    >
                        <h3 className={darkMode ? ".lightGradient" : ".darkGradient"}>{plan.name}</h3> {/*Khong chay duoc style?*/}
                        <p className={darkMode ? ".lightGradient" : ".darkGradient"}>Price: ${plan.price}</p> {/*Cai nay cung khong*/}
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className="popupOverlay">
                    <div className="popupBox">
                        <h2>{selectedPlan.name}</h2>
                        <p><strong>Description:</strong> {selectedPlan.description}</p>
                        <p><strong>Training Days:</strong> {selectedPlan.trainingDay}</p>
                        <p><strong>Duration:</strong> {selectedPlan.duration} month(s)</p>
                        <p><strong>Price:</strong> ${selectedPlan.price}</p>
                        <p><strong>Slot Time Type:</strong> {selectedPlan.slotTimeType}</p>
                        <h4>Available Slot Times:</h4>
                        <ul>
                            {selectedPlan.slotTimeResponses.length > 0 ? (
                                selectedPlan.slotTimeResponses.map((slot, i) => (
                                    <li key={i}>{slot.slotTimeType}: {slot.startTime} - {slot.endTime}</li>
                                ))
                            ) : (
                                <p>No specific slot times available.</p>
                            )}
                        </ul>
                        <button className="closeButton" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Membership;
