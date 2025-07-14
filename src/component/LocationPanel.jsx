import React, { useState } from "react";
import { X } from "lucide-react";
import Archismlogo from "./Archismlogo";

const LocationPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const backgroundImage =
    "https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg";

  const categories = [
    { label: "Mall", color: "bg-green-300" },
    { label: "Hospital", color: "bg-purple-500" },
    { label: "Education", color: "bg-blue-800" },
    { label: "Restaurants", color: "bg-orange-300" },
    { label: "Hotel", color: "bg-cyan-400" },
    { label: "Club", color: "bg-green-500" },
    { label: "Sport", color: "bg-gray-500" },
    { label: "Public Transport", color: "bg-pink-400" },
  ];

  return (
    <div>
      <div
        className="min-h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Panel conditional render */}
        {isOpen && (
          <div
            className="fixed right-2 top-16 sm:top-5 
            w-[50%] xs:w-[42%] sm:w-[260px] 
            max-h-[calc(100vh-140px)] 
            bg-black/30 text-white p-4 rounded-xl 
            backdrop-blur-sm z-30 shadow-lg 
            overflow-y-auto space-y-3"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
              <div className="text-base font-medium">Location</div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Category List */}
            <div className="bg-black/40 rounded-lg p-2 backdrop-blur-sm space-y-2 w-full">
              <div className="bg-white/10 rounded-lg p-2 space-y-1 w-full">
                {categories.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${cat.color}`}
                      />
                      <span className="text-xs">{cat.label}</span>
                    </div>
                    {index !== categories.length - 1 && (
                      <hr className="w-full border-white/10 my-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info Box */}
            <div className="bg-black/40 rounded-xl px-4 py-2 text-xs backdrop-blur-md space-y-2 shadow-md w-full leading-tight">
              <div className="font-semibold text-sm">
                Al Maskmak Palace
                <br className="hidden sm:block" />
                museum
              </div>

              <div className="text-white/60 text-[11px]">Category: Major</div>
              <div>Type A</div>

              <div className="border-t border-white/10" />

              <div>
                <div className="text-white/60 text-[11px]">Address</div>
                <div>
                  6937 Al Thumairi St, 6937, 3153,
                  <br className="hidden sm:block" />
                  Riyadh 12634, Saudi Arabia
                </div>
              </div>

              <div className="border-t border-white/10" />

              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-white/60 text-[11px]">Distance</div>
                  <div>22.0 km</div>
                </div>
                <div>
                  <div className="text-white/60 text-[11px]">Time</div>
                  <div>23 mins</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Archismlogo />
    </div>
  );
};

export default LocationPanel;
