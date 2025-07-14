import React, { useState } from "react";
import { X, Maximize } from "lucide-react";
import floor from "../assets/floorplan.png";
import situationPlan from "../assets/situation.png";
import Archismlogo from "./Archismlogo";

const VillaDetailsPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const backgroundURL =
    "https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg";

  return (
    <>
      {/* Background Panel */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundURL})` }}
      >
        {/* Right Panel */}
        {isPanelOpen && (
          <div
            className="fixed right-2 top-16 sm:top-8 
            w-[50%] xs:w-[42%] sm:w-[300px] 
            h-auto sm:h-[550px] 
            bg-black/30 text-white p-4 sm:p-6 
            rounded-xl backdrop-blur-sm z-10 
            overflow-y-auto max-h-[calc(100vh-140px)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-base sm:text-lg font-semibold">
                Villa Number - 9
              </div>
              <button onClick={() => setIsPanelOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-4 text-sm bg-black/40 p-4 sm:p-5 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Villa type</span>
                <span className="font-medium">Type A</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Zone</span>
                <span className="font-medium">197</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Builtup Area</span>
                <span className="font-medium">298.26 sq.m</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Land Area</span>
                <span className="font-medium">230 sq.m</span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="my-6 bg-black/40 p-4 sm:p-5 rounded-lg backdrop-blur-sm">
              <img
                src="https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg"
                alt="Villa layout"
                className="rounded-lg object-cover w-full h-32"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 w-full sm:w-1/2 justify-center py-2 rounded-lg bg-black/40 text-sm"
              >
                Floor Plan <Maximize className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 w-full sm:w-1/2 justify-center py-2 rounded-lg bg-black/40 text-sm">
                3D Layout <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[1200px] h-[90vh] rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden relative">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 z-10"
            >
              <X size={24} />
            </button>

            {/* Left Image */}
            <div className="sm:w-2/3 w-full h-1/2 sm:h-full bg-gray-100 flex justify-center items-center p-4">
              <img
                src={floor}
                alt="Floor Plan"
                className="w-full max-w-[700px] object-contain h-full"
              />
            </div>

            {/* Right Info */}
            <div className="sm:w-1/3 w-full h-1/2 sm:h-full bg-white p-4 sm:p-8 flex flex-col justify-between border-t sm:border-t-0 sm:border-l">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-4">Demo</h2>

                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex justify-between border-b pb-1">
                    <span>Villa Number</span>
                    <span className="font-medium">9</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Zone</span>
                    <span className="font-medium">197</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Villa Floor</span>
                    <span className="font-medium">Ground</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Builtup Area</span>
                    <span className="font-medium">298.26 sq.m</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Land Area</span>
                    <span className="font-medium">230 sq.m</span>
                  </div>
                </div>
              </div>

              {/* Situation Plan */}
              <div className="mt-4">
                <img
                  src={situationPlan}
                  alt="Situation Plan"
                  className="w-full rounded border"
                />
                <p className="text-center text-xs text-gray-500 mt-2">
                  Situation Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Archismlogo />
    </>
  );
};

export default VillaDetailsPanel;
