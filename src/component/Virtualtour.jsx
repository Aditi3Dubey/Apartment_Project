import React, { useState } from "react";
import image1 from "../assets/Interior.jpg";
import image2 from "../assets/Esterior.jpg";
import logo from "../assets/svg.svg";
import Archismlogo from "./Archismlogo";

const images = {
  ground:
    "https://i.pinimg.com/736x/91/6a/d1/916ad15dff10cdf9087b58f4fc2c6673.jpg",
  first:
    "https://balancedarchitecture.com/wp-content/uploads/2021/11/EXISTING-FIRST-FLOOR-PRES-scaled-e1635965923983.jpg",
  roof: "https://www.houseplans.net/uploads/plans/28196/floorplans/28196-1-1200.jpg?v=093022132212",
};

export default function CombinedView() {
  const [view, setView] = useState("gallery");
  const [selected, setSelected] = useState("ground");

  // INTERIOR VIEW
  if (view === "interior") {
    return (
      <div className="relative flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden pb-28 md:pb-0">
        {/* Close Button */}
        <button
          onClick={() => setView("gallery")}
          className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full shadow-lg"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        {/* Image Section */}
        <div className="flex-grow flex items-center justify-center p-4">
          <img
            src={images[selected]}
            alt={`${selected} floor`}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        {/* Floor Buttons */}
        <div className="flex flex-row md:flex-col justify-center items-center gap-4 p-4 md:p-10">
          {["ground", "first", "roof"].map((floor) => (
            <button
              key={floor}
              onClick={() => setSelected(floor)}
              className={`px-4 py-2 rounded-md text-white transition text-sm sm:text-base ${
                selected === floor ? "bg-gray-800" : "bg-gray-600"
              }`}
            >
              {floor.charAt(0).toUpperCase() + floor.slice(1)} Floor
            </button>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute bottom-4 right-4 z-20">
          <img src={logo} alt="Logo" className="w-24 sm:w-28 h-auto" />
        </div>
      </div>
    );
  }

  // GALLERY VIEW (INTERIOR + EXTERIOR)
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-8 md:px-16 lg:pl-72">
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-6xl h-[50vh] sm:h-[60vh]">
          {/* Interior Box */}
          <div className="relative w-full sm:w-1/2 h-64 sm:h-full rounded-xl overflow-hidden shadow-md">
            <img
              src={image1}
              alt="Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setView("interior")}
                className="bg-[#8b7e77d0] text-white text-base sm:text-lg md:text-xl px-5 py-2 rounded-md tracking-wide"
              >
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
            <div className="absolute inset-0 bg-black bg-opacity-30" />
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
