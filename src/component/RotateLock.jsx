// RotateLock.jsx
import React, { useEffect, useState } from "react";
 
const RotateLock = ({ children }) => {
  const [showRotateMsg, setShowRotateMsg] = useState(false);
 
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowRotateMsg(isMobile && isPortrait);
    };
 
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
 
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);
 
  if (showRotateMsg) {
    return (
      <div className="fixed inset-0 bg-black text-white z-[9999] flex flex-col items-center justify-center text-center px-4">
        <div className="text-2xl font-semibold mb-2">Please Rotate Your Device</div>
        <div className="text-sm opacity-70">This section is best viewed in landscape mode.</div>
      </div>
    );
  }
 
  return children;
};
 
export default RotateLock;
 
 