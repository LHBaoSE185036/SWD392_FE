import React, { useState } from 'react'
import { auth, provider } from "../../firebase"
import { signInWithPopup } from 'firebase/auth'

import { Box } from '@mui/material';

import "./Login.css"
import GoogleIcon from '../../assets/24px.svg';
import GoogleLogo from '../../assets/272px-Google_2015_logo.png';
import Logo from '../../assets/LightMainLogo.png'
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Signed In: ", result.user);
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div class="shape">
    <div className='loginContainer'>
      <Box>
        <img src={Logo} alt="Logo" className="logo" />
        <img src={GoogleLogo} alt='Google Logo' className='GGLogo' />
        
        {error && <p className='errorMessage'>{error}</p>}
        {/*user ? 
        <button onClick={handlenavigate} className='loginButton'>
          <DirectionsWalk/> Head on in <ArrowForward className='GGIcon'/>
        </button> 
        : */
        <button onClick={handleGoogleLogin} className='loginButton'>
          <img src={GoogleIcon} alt='Google Icon' className='GGIcon' /> Login with Google
        </button>}
      </Box>
    </div>
    </div>
  )
}
