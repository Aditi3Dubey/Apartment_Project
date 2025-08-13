import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RotateLock from "./RotateLock";
import Sidebar from "./Sidebar"; // ✅ Keeps layout consistent in /exterior route
import Archismlogo from "./Archismlogo";

const galleryImages = [
  "https://media.istockphoto.com/id/1338058166/photo/land-or-landscape-of-green-field-in-aerial-view-and-home-or-house-icon.jpg?s=612x612&w=0&k=20&c=c-VlOIv3Y18NyZ5qLDZbaNNcapXo2U3yctzf8KkltN0=",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_coV5BrhFD0QrQvUgzb_EjxA6ju3uPWA4RtuCICaaWLdpa7OLTzslqLtXex9H0_OZEVA&usqp=CAU",
  "https://i.pinimg.com/736x/d9/02/6f/d9026f16db8c85be44bdf4a4cd6d743e.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu5OBpJAj_MMKlkZi_D18lQB6PwYnDMTXtQw&s",
  "https://st.hzcdn.com/simgs/pictures/exteriors/3bhk-bungalow-design-plan-plot-size-35-x40-north-facing-1500-sqft-house-styler-img~d84142590f2a8794_4-1466-1-e016194.jpg",
];

export default function ExteriorGalleryPage({ isFullScreen = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isFullScreen) return; // 🔒 Skip screen lock logic when in Preview mode

    const handleOrientation = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      if (isPortrait && window.innerWidth < 640) {
        document.documentElement.requestFullscreen?.();
        screen.orientation?.lock("landscape").catch(() => {});
      }
    };

    handleOrientation();
    window.addEventListener("resize", handleOrientation);
    return () => window.removeEventListener("resize", handleOrientation);
  }, [isFullScreen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <RotateLock>
        {/* ✅ Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm "
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/1338058166/photo/land-or-landscape-of-green-field-in-aerial-view-and-home-or-house-icon.jpg?s=612x612&w=0&k=20&c=c-VlOIv3Y18NyZ5qLDZbaNNcapXo2U3yctzf8KkltN0=')",
            zIndex: -1,
            scale:3,
          }}
        />
      <div className="flex min-h-screen  overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 ml-0 lg:ml-64 px-2 sm:px-6 md:px-8 py-4 sm:py-6 w-full">
          {/* Main Image */}
          <div className="relative w-full max-w-screen-lg aspect-video h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={galleryImages[currentIndex]}
              alt="Gallery"
              className="w-full h-full object-cover transition duration-300"
            />
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-2.5 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-2.5 rounded-full shadow-lg"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center justify-start gap-3 overflow-x-auto mt-4 w-full max-w-screen-lg px-1 sm:px-2 pb-2 scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-transparent">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`w-20 h-14 sm:w-24 sm:h-16 object-cover cursor-pointer rounded-md border-2 transition-all duration-300 shadow-sm ${
                  i === currentIndex
                    ? "border-orange-500 scale-105 ring-2 ring-orange-400"
                    : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
        <Archismlogo/>
      </div>
    </RotateLock>
  );
}
