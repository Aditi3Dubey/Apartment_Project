import React from "react";
import logo from "../assets/svg.svg";

function Archismlogo() {
  return (
    <div className="absolute bottom-4 right-4 z-50">
      <img src={logo} alt="Logo" className="w-24 sm:w-28 h-auto" />
    </div>
  );
}

export default Archismlogo;
