import React, { useCallback } from 'react'
import { auth } from "../../firebase";
import { useAuth } from "../../features/Auth/useAuth"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';

import "./LogoutButton.css"

export default function LogoutButton() {
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("username");

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      if (storedUser){
        console.log("Stored user: ", storedUser);
        await logout();
        localStorage.clear();
        navigate("/");
      }
      await logout();
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <Button type="primary" onClick={handleLogout} className='logout-Btn'>Logout</Button>
  )
}
