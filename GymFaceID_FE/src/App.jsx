import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import MainLayout from "./components/MainLayout/MainLayout";

function App() {

  return (
    <Router>
      <Routes>
          <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  )
}

export default App
