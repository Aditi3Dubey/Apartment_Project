import React from "react";
import image1 from "../assets/Interior.jpg";
import image2 from "../assets/Esterior.jpg";
import Archismlogo from "./Archismlogo";

function Gallary() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Responsive padding: small on mobile, larger on desktop */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8 md:px-16 lg:pl-72">
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-6xl h-[50vh] sm:h-[60vh]">
          {/* Interior Box */}
          <div className="relative w-full sm:w-1/2 h-64 sm:h-full rounded-xl overflow-hidden shadow-md">
            <img
              src={image1}
              alt="Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button className="bg-[#8b7e77d0] text-white text-base sm:text-lg md:text-xl px-5 py-2 rounded-md tracking-wide">
                INTERIOR
              </button>
            </div>
          </div>

          {/* Exterior Box */}
          <div className="relative w-full sm:w-1/2 h-64 sm:h-full rounded-xl overflow-hidden shadow-md">
            <img
              src={image2}
              alt="Exterior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button className="bg-[#8b7e77d0] text-white text-base sm:text-lg md:text-xl px-5 py-2 rounded-md tracking-wide">
                EXTERIOR
              </button>
            </div>
          </div>
        </div>
      </div>
      <Archismlogo />
    </div>
  );
}

export default Gallary;
