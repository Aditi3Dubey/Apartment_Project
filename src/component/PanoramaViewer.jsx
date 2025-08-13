import React, { useEffect, useRef } from "react";

const PanoramaViewer = ({ imagePath, onClose }) => {
  const panoRef = useRef();

  useEffect(() => {
    if (window.pannellum && panoRef.current) {
      window.pannellum.viewer(panoRef.current, {
        type: "equirectangular",
        panorama: imagePath,
        autoLoad: true,
        showZoomCtrl: false,
        showFullscreenCtrl: false, // hides fullscreen icon only
        autoRotate: -2,
      });
    }
  }, [imagePath]);

  return (
    <div className="relative w-full h-full">
      <div ref={panoRef} className="w-full h-full" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black text-white px-4 py-1 rounded z-50"
      >
        Close
      </button>
    </div>
  );
};

export default PanoramaViewer;
