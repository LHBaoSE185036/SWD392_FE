import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelect.css"
import Admin from '../../../assets/896f4fdf657a783e56a2c341b9bd4a9a.jpg'
import User from '../../../assets/desktop-wallpaper-14-fitness-hp-background-ultra-gym-gym-workout.jpg'

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("role", role);
    navigate(role === "admin" ? "/AdminPage" : "/HomePage");
  };

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <button className="admin-role-btn" onClick={() => handleRoleSelect("admin")}> Admin </button>
      <button className="user-role-btn" onClick={() => handleRoleSelect("user")}> User </button>
      <img className="admin-role-img" src={Admin} alt="Admin" />
      <img className="user-role-img" src={User} alt="User" />
    </div>
  );
}
