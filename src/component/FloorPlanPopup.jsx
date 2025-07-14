import React from "react";
import { X, Maximize } from "lucide-react";

const VillaDetailsPanel = () => {
  const randomBg =
    "https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg";
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${randomBg})` }}
    >
      <div
        className="fixed right-4 top-28 w-[300px] h-[550px]  bg-black/30 text-white p-6 rounded-xl backdrop-blur-sm z-50 overflow-y-auto"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Villa Number - 9</div>
          <button>
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm bg-black/40 p-5 rounded-lg backdrop-blur-sm">
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

        {/* Image */}
        <div className="my-6 bg-black/40 p-5 rounded-lg backdrop-blur-sm">
          <img
            src="https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg"
            alt="Villa layout"
            className="rounded-lg object-cover w-full h-32"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center gap-4 ">
          <button className="flex items-center gap-2 w-1/2 justify-center py-2 rounded-lg bg-black/40  text-sm">
            Floor Plan <Maximize className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 w-1/2 justify-center py-2 rounded-lg bg-black/40 text-sm">
            3D Layout <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VillaDetailsPanel;
