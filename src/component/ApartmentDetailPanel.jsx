import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const ApartmentDetailPanel = ({ isOpen, onClose, selectedApartment }) => {
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setFadeKey((prev) => prev + 1);
  }, [selectedApartment]);

  if (!selectedApartment) return null;

  return (
    <div
      className={`fixed right-2 top-3 bottom-3 w-[90vw] max-w-[300px] sm:w-[240px] bg-black/60 text-white rounded-xl backdrop-blur-lg z-50 transform transition-all duration-300 ease-in-out
      ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
    >
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 pb-2 px-4 pt-4 ">
          <div className="flex justify-between items-center">
            <h2 className="text-sm sm:text-base font-semibold text-center">
              <span className="text-orange-500 text-xl text-center">
                Apartment Details
              </span>{" "}
              {selectedApartment["Apartment ID"]}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          key={fadeKey}
          className="flex-1 overflow-y-auto px-4 space-y-4 sm:scrollbar-none scrollbar-thin scrollbar-thumb-white/60 scrollbar-track-white/10"
        >
          {selectedApartment.loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-white text-sm">Loading apartment details...</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm mt-2 pb-24 bg-white/10 rounded-xl p-2">
              <div className="p-2 rounded-lg">
                <strong>Floor:</strong> {selectedApartment.Floor}
              </div>
              <div className="p-2 rounded-lg">
                <strong>Bedroom:</strong> {selectedApartment.Bedroom}
              </div>
              <div className="p-2 rounded-lg">
                <strong>Area:</strong> {selectedApartment.Area} sqft
              </div>
              <div className="p-2 rounded-lg">
                <strong>Status:</strong> {selectedApartment.Status || "Available"}
              </div>
              <div className="p-2 rounded-lg">
                <strong>Price:</strong>{" "}
                {selectedApartment.Price
                  ? `₹${selectedApartment.Price}`
                  : "Contact for pricing"}
              </div>
              {selectedApartment.Description && (
                <div className="bg-white/10 p-3 rounded-lg">
                  <strong>Description:</strong>
                  <p className="mt-1 text-white/80">{selectedApartment.Description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {!selectedApartment.loading && (
          <div className="sticky bottom-0 z-20 px-4 pb-4 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  console.log("Floor Plan clicked for:", selectedApartment["Apartment ID"])
                }
                className="flex-1 bg-orange-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all"
              >
                Floor Plan
              </button>
              <button
                onClick={() =>
                  console.log("3D Layout clicked for:", selectedApartment["Apartment ID"])
                }
                className="flex-1 bg-orange-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all"
              >
                3D Layout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentDetailPanel;