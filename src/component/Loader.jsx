// component/Loader.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1117] text-white font-sans">
      {/* Glowing Ring Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-cyan-400 opacity-60" />
        <div className="absolute inset-3 rounded-full bg-[#0d1117]" />
        <Loader2 className="w-8 h-8 absolute top-1/2 left-1/2 text-cyan-400 animate-pulse -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-wider text-cyan-300 animate-pulse mb-4">
        Loading Your Experience
      </h1>

      {/* Progress Bar */}
      <div className="w-72 h-4 bg-white/10 rounded-full overflow-hidden shadow-lg mb-2">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Percent Text */}
      <div className="text-sm text-white/80 font-mono">{progress}%</div>

      {/* Animated Loading Dots */}
      <div className="mt-6 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>

      {/* Optional Tip */}
      <p className="mt-4 text-xs text-white/40 tracking-wider">
        Preparing immersive visuals...
      </p>
    </div>
  );
};

export default Loader;
