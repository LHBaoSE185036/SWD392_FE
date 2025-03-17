import React, { useContext } from "react";
import "./Intro.css";
import Vector1 from "../../assets/Vector1.png";
import Vector2 from "../../assets/Vector2.png";
import gymMember from "../../assets/gym-member.png";
import dumbbell from "../../assets/dumbbell.png";
import thumbup from "../../assets/thumbup.png";
import shield from "../../assets/shield.png";
import FloatinDiv from "../FloatingDiv/FloatingDiv";
import GymFaceIDLogo from "../../assets/AmazinGym-Face-ID-Logo.png"
import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
const Intro = () => {
  const navigate = useNavigate();
  // Transition
  const transition = { duration: 2, type: "spring" };

  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  const handleDirect = () => {
    navigate("/login");
  };

  return (
    <div className="Intro" id="Intro">
      <div className="i-left">
        <div className="i-icons">
            <img src={GymFaceIDLogo} alt="" />
          </div>
        <div className="i-name">
          <span style={{ color: darkMode ? "white" : "#555" }}>Greetings! We Are</span>
          <span>Amazin Gym FaceID</span>
          <span>
            Frontend Developer with high level of experience in web designing
            and development, producting the Quality work
          </span>
        </div>
        <Link to="contact" smooth={true} spy={true}>
          <button className="frontPageButton i-button" onClick={() => handleDirect()}>Get Started</button>
        </Link>
      </div>
      <div className="i-right">
        <img src={Vector1} alt="" style={{opacity: "0.4"}}/>
        <img src={Vector2} alt="" style={{opacity: "0.8"}}/>
        <img src={gymMember} alt="" style={{backdropFilter: "blur(8px)"}}/>
        {/* animation */}
        <motion.img
          initial={{ left: "-36%" }}
          whileInView={{ left: "-24%" }}
          transition={transition}
          src={dumbbell}
          alt=""
        />

        <motion.div
          initial={{ top: "-4%", left: "74%" }}
          whileInView={{ left: "68%" }}
          transition={transition}
          className="floating-div"
        >
          <FloatinDiv img={shield} text1="Secure" text2="Access" />
        </motion.div>

        {/* animation */}
        <motion.div
          initial={{ left: "-2rem", top: "18rem" }}
          whileInView={{ left: "0rem" }}
          transition={transition}
          className="floating-div"
        >
          {/* floatinDiv mein change hy dark mode ka */}
          <FloatinDiv img={thumbup} text1="Ease" text2="of Use" />
        </motion.div>

        <div className="blur" style={{ background: "rgb(238 210 255)" }}></div>
        <div
          className="blur"
          style={{
            background: "#C1F5FF",
            top: "17rem",
            width: "21rem",
            height: "11rem",
            left: "-9rem",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Intro;
