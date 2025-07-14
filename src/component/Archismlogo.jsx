import React from "react";
import logo from "../assets/svg.svg";

function Archismlogo() {
  return (
    <div>
      <div className="absolute bottom-4 right-4 z-20">
        <img src={logo} alt="Logo" className="w-24 sm:w-28 h-auto" />
      </div>
    </div>
  );
}

export default Archismlogo;
