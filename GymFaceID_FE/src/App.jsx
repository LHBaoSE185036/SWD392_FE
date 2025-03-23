import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from "./features/Auth/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { ThemeProvider } from "./Context";

import './App.css'
import MainLayout from "./components/MainLayout/MainLayout";
import Login from "./pages/Login-page/Login";
import RoleSelect from "./pages/Login-page/RoleSelection/RoleSelect";
import HomePage from "./pages/User/HomePage/HomePage";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import MembershipManagement from "./pages/Admin/MembershipManagement/MembershipManagement";
import AccountManagement from "./pages/Admin/AccountManagement/AccountManagement";

import ProtectedRoutes from "./utils/ProtectedRoutes";
import FrontPage from "./pages/Front-page/FrontPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}


function AppRoutes() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userAuth } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="loader" />;

    return (
        <Routes>
            <Route path="/" element={<ThemeProvider><FrontPage /></ThemeProvider>} />
            <Route path="/login" element={<Login />} />

            <Route element={user ? <ProtectedRoutes user={user} /> : <ProtectedRoutes user={userAuth} />}>
                <Route path="/role-selection" element={<RoleSelect />} />
                <Route path="/HomePage" element={<HomePage />} />

                <Route path="/AdminPage" element={<MainLayout />}>
                    <Route path="UserManagement" element={<UserManagement />} />
                    <Route path="MembershipManagement" element={<MembershipManagement />} />
                    <Route path="AccountManagement" element={<AccountManagement />} />
                </Route>
            </Route>
        </Routes>
    );
}


export default App