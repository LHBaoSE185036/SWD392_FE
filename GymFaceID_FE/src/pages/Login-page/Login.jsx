import React, { useState } from 'react';
import { auth, provider } from "../../firebase";
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../features/Auth/useAuth';

import { Box } from '@mui/material';
import { Visibility, VisibilityOff, Password } from '@mui/icons-material';

import "./Login.css";
import GoogleIcon from '../../assets/24px.svg';
import GoogleLogo from '../../assets/272px-Google_2015_logo.png';
import Logo from '../../assets/LightMainLogo.png';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ State for password visibility

  const [error, setError] = useState(null);
  const [switched, setSwitched] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClick = () => {
    setSwitched(!switched);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      sessionStorage.setItem("GG-username", result.user.displayName);
      navigate("/role-selection");
    } catch (error) {
      console.error("Google Login Failed:", error);
      setError("Failed to login. Please try again.");
    }
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    try {
      const role = await login(username, password);

      if (role) {
        console.log(`Logged in as ${role}`);
        setTimeout(() => {
          navigate(role === "ADMIN" ? "/AdminPage" : "/HomePage");
        }, 100);
      }
    } catch (error) {
      console.error("Login Failed:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className='loginContainer'>
      <div className="shape" />
      <div className="shape2" />
      <div className="switch-toggle" onClick={handleClick} 
        style={!switched ? { border: "5px solid gray", background: "#ffffff80", transition: "border 0.4s ease" } :
                           { border: "5px solid white", background: "#80808080", transition: "border 0.4s ease" }}>
        <Password className="usernamePassLogin"/>
        <img src={GoogleIcon} alt='Google' className="googleLogin"/>
        <div className="switch-button"
          style={!switched ? { top: "2px", border: "5px solid gray", transition: "border 0.4s ease" } :
                             { bottom: "2px", border: "5px solid white", transition: "border 0.4s ease" }}
        ></div>
      </div>

      <Box className={switched ? "googleLoginBox" : "googleLoginBox away"}>
        <img src={Logo} alt="Logo" className="logo" />
        <img src={GoogleLogo} alt='Google Logo' className='GGLogo' />
          
        {error && <p className='errorMessage'>{error}</p>}
        <button onClick={handleGoogleLogin} className='loginButton'>
          <img src={GoogleIcon} alt='Google Icon' className='GGIcon' /> Login with Google
        </button>
      </Box> 
        
      <Box className={switched ? "usernamePassLoginBox away" : "usernamePassLoginBox"}>
        <form onSubmit={handleNormalLogin}>
          <div className="input-field">
            <label>Username</label>
            <input
              className="input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label>Password</label>
            <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className={`passToggle ${showPassword ? 'hide' : 'show'}`} onClick={togglePasswordVisibility}>  
                <Visibility className={showPassword ? 'show' : ''}/> <VisibilityOff className={showPassword ? '' : 'hide'}/>
              </div>
            </div>
          {error && <p className="error-message">{error}</p>}
          <button className='loginButton' type="submit">
            Login
          </button>
        </form>
      </Box>
    </div>
  );
}
