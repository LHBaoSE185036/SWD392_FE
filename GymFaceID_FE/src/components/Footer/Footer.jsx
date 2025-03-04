import React from "react";
import "./Footer.css";
import Wave from "../../assets/wave.png";
import { Facebook, GitHub, Instagram } from "@mui/icons-material";


const Footer = () => {
  return (
    <div className="footer">
      <img src={Wave} alt="" style={{ width: "100%" }} />
      <div className="f-content">
        <span>dangbavan2004@gmail.com</span>
        <div className="f-icons">
          <Instagram style={{color: "white", size: "3rem"}} />
          <Facebook style={{color: "white", size: "3rem"}} />
          <GitHub style={{color: "white", size: "3rem"}} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
