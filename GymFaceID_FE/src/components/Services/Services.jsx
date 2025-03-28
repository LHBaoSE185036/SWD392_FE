import React, { useContext } from "react";
import "./Services.css";
import Card from "../Card/Card";
import system from "../../assets/system.png";
import scan from "../../assets/scan.png";
import security from "../../assets/security.png";
import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  // transition
  const transition = {
    duration: 1,
    type: "spring",
  };

  const handleRegisterDirect = () => {
    navigate("/AdminPage");
  };

  return (
    <div className="services" id="services">
      {/* left side */}
      <div className="awesome">
        {/* dark mode */}
        <span style={{ color: darkMode ? "white" : "" }}>Our Reliable</span>
        <span>Services</span>
        <spane>
          Provide a safe and secured Identification Functionality
          <br />
          for your Gym membership experience
        </spane>
        <div>
          <button className="frontPageButton s-button" onClick={() => handleRegisterDirect()}>Register FaceID</button>
        </div>
      </div>
      {/* right */}
      <div className="cards">
        {/* first card */}
        <motion.div
          initial={{ left: "50rem" }}
          whileInView={{ left: "45rem" }}
          transition={transition}
        >
          <Card
            emoji={system}
            heading={"System"}
            detail={"A, B, C, D, E"}
          />
        </motion.div>
        {/* second card */}
        <motion.div
          initial={{ left: "15rem", top: "-5rem" }}
          whileInView={{ left: "20rem"}}
          transition={transition}
        >
          <Card
            emoji={scan}
            heading={"Tools"}
            detail={"A, B, C, D, E"}
          />
        </motion.div>
        {/* 3rd */}
        <motion.div
          initial={{ top: "19rem", left: "25rem" }}
          whileInView={{ left: "30rem" }}
          transition={transition}
        >
          <Card
            emoji={security}
            heading={"Design"}
            detail={
              "A, B, C, D, E"
            }
            color="rgba(252, 166, 31, 0.45)"
          />
        </motion.div>
        <div 
          className="blur s-blur1"
          style={{ background: "#ABF1FF94" }}>

        </div>
        <div
          className="blur s-blur2"
          style={{ background: "var(--purple)" }}
        ></div>
      </div>
    </div>
  );
};

export default Services;
