// component/Loader.jsx
import React from "react";

const Loader = ({ progress }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <div className="text-2xl font-semibold mb-4 animate-pulse">Loading Assets...</div>
      <div className="w-64 h-4 bg-white/20 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-green-500 transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-sm tracking-wider">{progress}%</div>
    </div>
  );
};

export default Loader;
