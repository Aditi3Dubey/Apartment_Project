// NavigatorPanel.jsx
import React, { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import Navigation360Viewer from "./Navigator360Viewer";
import Archismlogo from "./Archismlogo";

const NavigatorPanel = () => {
  const [isOpen, setIsOpen] = useState(true);

  // 🟧 Filters State
  const [filters, setFilters] = useState({
    floor: null,
    bedroom: null,
    area: null,
  });

  const bedrooms = ["2 Bedroom", "3 Bedroom"];
  const areas = ["500-1000", "1000-1500"];

  const handleReset = () => {
    setFilters({ floor: null, bedroom: null, area: null });
  };

  return (
    <div className="relative h-screen w-full">
      {/* 🔁 Background Viewer */}
      <div className="absolute inset-0 z-0">
        <Navigation360Viewer filters={filters} /> {/* 🟧 Pass filters */}
      </div>

      <div className="relative z-10 h-screen w-full">
        {isOpen && (
          <div className="fixed right-2 top-16 sm:top-5 w-[50%] xs:w-[42%] sm:w-[260px] max-h-[calc(100vh-140px)] bg-black/20 text-white p-4 rounded-xl backdrop-blur-md z-30 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">Navigator</div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Bedroom Filter */}
            <div className="bg-black/40 p-4 rounded-lg">
              <div className="text-sm mb-2 font-medium">Bedroom</div>
              <div className="flex gap-2 flex-wrap">
                {bedrooms.map((br) => (
                  <div
                    key={br}
                    onClick={() => setFilters((prev) => ({ ...prev, bedroom: br }))}
                    className={`bg-white/25 px-4 py-2 rounded cursor-pointer text-sm text-center hover:border-2 hover:border-orange-500 ${filters.bedroom === br ? "border-orange-500 border-2" : ""}`}
                  >
                    {br}
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Dropdown */}
            <div className="bg-black/40 p-4 rounded-lg">
              <label htmlFor="floor-select" className="block text-sm mb-2 font-medium">
                Select Floor
              </label>
              <select
                id="floor-select"
                onChange={(e) => setFilters((prev) => ({ ...prev, floor: parseInt(e.target.value) || null }))}
                className="w-full bg-white/25 text-white text-sm px-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="">-- Choose Floor --</option>
                {[1, 2, 3, 4].map((floor) => (
                  <option key={floor} value={floor} className="text-black">
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Filter */}
            <div className="bg-black/40 p-3 rounded-lg">
              <div className="text-sm mb-2">Select Area</div>
              <div className="space-y-1">
                {areas.map((area) => (
                  <div
                    key={area}
                    onClick={() => setFilters((prev) => ({ ...prev, area }))}
                    className={`bg-white/25 px-3 py-1.5 rounded cursor-pointer text-sm hover:border-2 hover:border-orange-500 ${filters.area === area ? "border-orange-500 border-2" : ""}`}
                  >
                    {area} sq.ft
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-1/2 border border-white px-3 py-2 rounded-lg text-sm bg-white/10 hover:border-orange-500"
              >
                <RotateCcw className="w-4 h-4 inline-block mr-1" /> Reset
              </button>
              <button className="w-full sm:w-1/2 bg-orange-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">
                Available
              </button>
            </div>
          </div>
        )}
      </div>

      <Archismlogo />
    </div>
  );
};

export default NavigatorPanel;
