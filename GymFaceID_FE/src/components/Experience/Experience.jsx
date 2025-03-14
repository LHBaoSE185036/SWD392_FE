import React, { useContext } from "react";
import { themeContext } from "../../Context";
import "./Experience.css";
const Experience = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className="experience" id='experience'>
      <div className="achievement">
        {/* darkMode */}
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>1</div>
        <span  style={{color: darkMode?'white':''}}>Years </span>
        <span>Serviced</span>
      </div>
      <div className="achievement">
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>2</div>
        <span  style={{color: darkMode?'white':''}}>Gyms </span>
        <span>Joined</span>
      </div>
      <div className="achievement">
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>10</div>
        <span  style={{color: darkMode?'white':''}}>Users </span>
        <span>Registerd</span>
      </div>
    </div>
  );
};

export default Experience;
