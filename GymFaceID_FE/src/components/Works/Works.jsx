import React, { useContext } from "react";
import "./Works.css";
import Microsoft from "../../assets/Microsoft-logo.png";
import Google from "../../assets/GG-logo.png";
import User from "../../assets/User-Image.png";
import X_Twitter from "../../assets/X-logo.png";
import Facebook from "../../assets/Facebook.png";
import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import {Link} from 'react-scroll'
const Works = () => {
  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  // transition
  return (
    <div className="works" id="works">
      {/* left side */}
      <div className="w-left">
        <div className="awesome">
          {/* dark Mode */}
          <span style={{ color: darkMode ? "white" : "" }}>
            Works for All these
          </span>
          <span>Accounts Sign-in</span>
          <spane>
            Lorem ispum is simpley dummy text of printing of printing Lorem
            <br />
            ispum is simpley dummy text of printingLorem ispum is simpley dummy
            text
            <br />
            y dummy text of printingLorem
            <br />
            ispum is simpley dummy text of printing
          </spane>
          <Link to="contact" smooth={true} spy={true}>
            <button className="frontPageButton w-button">Register</button>
          </Link>
          <div
            className="blur s-blur1"
            style={{ background: "#ABF1FF94" }}
          ></div>
        </div>

        {/* right side */}
      </div>
      <div className="w-right">
        <motion.div
          initial={{ rotate: 45 }}
          whileInView={{ rotate: 0 }}
          viewport={{ margin: "-40px" }}
          transition={{ duration: 3.5, type: "spring" }}
          className="w-mainCircle"
        >
          <div className="w-secCircle">
            <img src={Microsoft} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Google} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={User} alt="" />
          </div>{" "}
          <div className="w-secCircle">
            <img src={X_Twitter} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Facebook} alt="" />
          </div>
        </motion.div>
        {/* background Circles */}
        <div className="w-backCircle brownCircle"></div>
        <div className="w-backCircle grayCircle"></div>
      </div>
    </div>
  );
};

export default Works;
