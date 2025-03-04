import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
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

function App() {
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          console.log(currentUser);
          setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    

    if (loading) return <div>Loading...</div>;
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ThemeProvider><FrontPage/></ThemeProvider>} />
        <Route path="/login" element={ <Login/>} />
        <Route path="/role-selection" element={ <RoleSelect/> }/>
        
        <Route element={<ProtectedRoutes user={user}/> }>
          <Route path="/AdminPage" element={ <MainLayout/>}/>
          <Route path="/HomePage" element={ <HomePage/>}/>
        </Route>

        
      </Routes>
    </Router>
  )
}

export default App
