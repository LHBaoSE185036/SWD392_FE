import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { AuthProvider } from "./features/Auth/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { ThemeProvider } from "./Context";

import './App.css'
import MainLayout from "./components/MainLayout/MainLayout";
import Login from "./pages/Login-page/Login";
import RoleSelect from "./pages/Login-page/RoleSelection/RoleSelect";
import HomePage from "./pages/User/HomePage/HomePage";

import ProtectedRoutes from "./utils/ProtectedRoutes";
import FrontPage from "./pages/Front-page/FrontPage";
import FaceScanPage from "./pages/User/FaceScan-Page/FaceScanPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(currentUser) {
        setUser(currentUser);
        console.log(currentUser);
        setLoading(false);
      } else {
        // If not Google login, check API login session
        const storedUser = sessionStorage.getItem("username"); 
        const storedRole = sessionStorage.getItem("selectedRole");

        if (storedUser && storedRole) {
          setUser({ username: storedUser, role: storedRole });
          console.log("User: ", user);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
    
  if (loading) return <div>Loading...</div>;
  
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ThemeProvider><FrontPage/></ThemeProvider>} />
        <Route path="/login" element={ <Login/> } />
        <Route path="/role-selection" element={ <RoleSelect/> } />

        <Route path="/face-scanner" element={ <FaceScanPage/> } />
        
        <Route element={<ProtectedRoutes user={user}/> }>
          <Route path="/AdminPage" element={ <MainLayout/>}/>
          <Route path="/HomePage" element={ <HomePage/>}/>
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
