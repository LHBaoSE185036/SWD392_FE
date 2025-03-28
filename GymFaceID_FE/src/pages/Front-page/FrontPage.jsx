import Navbar from "../../components/Navbar/Navbar";
import Intro from "../../components/Intro/Intro";
import Services from "../../components/Services/Services";
import SwipeList from "../../components/SwipeList/SwipeList";
import Experience from "../../components/Experience/Experience";
import Membership from "../../components/Membership/Membership"
import Works from "../../components/Works/Works";
import Footer from "../../components/Footer/Footer";
import "./FrontPage.css"

import { useContext } from "react";
import { themeContext } from "../../Context";

export default function FrontPage() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
        <div
        className= { darkMode ? "frontPageApp Dark" : "frontPageApp"}
        style={{
            background: darkMode ? "#333" : "lightgray",
            color: darkMode ? "white" : "",
        }}
        >
            <Navbar />
            <Intro />
            <Services />
            <Experience />
            <Membership />
            <Works />
            
            {/* <SwipeList /> */}
            <Footer />
        
        </div>
  )
}
