import Navbar from "../../components/Navbar/Navbar";
import Intro from "../../components/Intro/Intro";
import Services from "../../components/Services/Services";

import Experience from "../../components/Experience/Experience";
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
            background: darkMode ? "black" : "lightyellow",
            color: darkMode ? "white" : "",
        }}
        >
            <Navbar />
            <Intro />
            <Services />
            <Experience />
            <Works />
            {/* <Portfolio /> */}
            <Footer />
        
        </div>
  )
}
