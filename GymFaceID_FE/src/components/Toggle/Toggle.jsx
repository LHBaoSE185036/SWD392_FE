import React, { useContext } from "react";
import "./Toggle.css";
import { themeContext } from "../../Context";
import { DarkMode, LightMode } from "@mui/icons-material";

const Toggle = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const handleClick = () => {
    // debugger
    theme.dispatch({ type: "toggle" });
  };
  return (
    <div className="toggle" onClick={handleClick} 
          style={!darkMode ? { border: "3px solid var(--orange)" } : { border: "3px solid cyan" }}>
      <DarkMode className="dark-off"/>
      <LightMode className="light-off"/>
      <div
        className="t-button"
        style={!darkMode ? { left: "2px", background: "var(--orange)" } : { right: "2px", background: "cyan" }}
      ></div>
    </div>
  );
};

export default Toggle;
