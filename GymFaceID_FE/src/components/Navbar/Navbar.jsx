import React from "react";
import { motion, useScroll, useMotionValueEvent, useTransform, useInView } from "framer-motion";
import Toggle from "../Toggle/Toggle";
import "./Navbar.css";
import { Link } from "react-scroll";

const navbar = () => {
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", 
  );

  const position = useTransform(
    scrollYProgress,
    [0, 0.04],
    ["20%", "0%"]
  )
  const borderColor = useTransform(
    scrollYProgress,
    [0.04, 1],
    ["none", "1px solid gray"]
  )

  return (
    <motion.div className="n-wrapper" id="Navbar"
    style={{
      position: "fixed",
      y: position,
      borderBottom: borderColor
    }}
    >
      {/* left */}
      <div className="n-left">
        <div className="n-name">Amazin Gym</div>
        <Toggle />
      </div>
      {/* right */}
      <div className="n-right">
        <div className="n-list">
          <ul style={{ listStyleType: "none" }}>
            <li>
              <Link /*activeClass="active"*/ to="Intro" spy={true} smooth={true}>
                Home
              </Link>
            </li>
            <li>
              <Link to="services" spy={true} smooth={true}>
                Serivces
              </Link>
            </li>
            <li>
              <Link to="experience" spy={true} smooth={true}>
                Experience
              </Link>
            </li>
            <li>
              <Link to="works" spy={true} smooth={true}>
                Register
              </Link>
            </li>
          </ul>
        </div>
        <Link to="contact" spy={true} smooth={true}>
        <button className="frontPageButton n-button">Contact</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default navbar;
