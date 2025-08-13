import React from "react";
import image1 from "../assets/Interior.jpg";
import image2 from "../assets/Exterior.jpg";
import Archismlogo from "./Archismlogo";
import { useNavigate } from "react-router-dom";
import RotateLock from "./RotateLock";

function Gallery() {
  const navigate = useNavigate();

  return (
    <RotateLock>
      <div className="relative min-h-screen text-black overflow-hidden">
        {/* ✅ Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm "
          style={{
            backgroundImage: "url('/Camera_01/Cliffton_O1.0000.png')",
            zIndex: -1,
          }}
        />
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-8 md:px-16  lg:pl-72">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-6xl min-h-[60vh]">
            {/* Interior Box */}
            <div className="relative w-full sm:w-1/2 min-h-[60vh] rounded-xl overflow-hidden shadow-lg">
              <img
                src={image1}
                alt="Interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-[#8b7e77d0] text-white text-sm sm:text-lg md:text-xl px-5 py-2 rounded-md tracking-wide shadow-md">
                  INTERIOR
                </button>
              </div>
            </div>

            {/* Exterior Box */}
            <div className="relative w-full sm:w-1/2 min-h-[60vh] rounded-xl overflow-hidden shadow-lg">
              <img
                src={image2}
                alt="Exterior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => navigate("/exterior")}
                  className="bg-[#353331d0] text-white text-sm sm:text-lg md:text-xl px-5 py-2 rounded-md tracking-wide shadow-md"
                >
                  EXTERIOR
                </button>
              </div>
            </div>
          </div>
        </div>

        <Archismlogo />
      </div>
    </RotateLock>
  );
}

export default Gallery;
