import React from 'react'
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';

import "./LogoutButton.css"

export default function LogoutButton() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <Button type="primary" onClick={handleLogout} className='logout-Btn'>Logout</Button>
  )
}
