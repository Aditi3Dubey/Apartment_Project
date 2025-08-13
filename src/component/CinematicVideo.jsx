import { useState, useEffect } from "react";
import RotateLock from "./RotateLock";
import Sidebar from "./Sidebar";
import Archismlogo from "./Archismlogo";

export default function CinematicVideo({
  fromPreview = false,
  playedVideo,
  setPlayedVideo,
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (fromPreview && playedVideo) {
      setShowVideo(true);
    }
  }, [fromPreview, playedVideo]);

  return (
    <RotateLock>
      <div className="min-h-screen bg-black text-white relative">
        {/* Sidebar only in non-preview mode */}
        {!fromPreview && (
          <div className="fixed top-0 left-0 z-50">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="relative overflow-hidden transition-all duration-300 pt-1 sm:pl-0 lg:pl-64">
          {/* Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.shutterstock.com/shutterstock/videos/1097592099/thumb/1.jpg?ip=x480')] bg-cover bg-center blur-sm" />
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                showVideo ? "bg-[#776b67]/70" : "bg-black/40"
              }`}
            />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex items-center justify-end min-h-screen px-4 sm:px-8 md:px-16">
            <div
              className="w-full h-full max-w-[68rem]"
            >
              <div className="relative w-full h-[90vh] max-h-[90vh] mx-auto rounded-xl overflow-hidden shadow-2xl transition-all duration-500">
                {!showVideo ? (
                  <>
                    <img
                      src="https://www.shutterstock.com/shutterstock/videos/1097592099/thumb/1.jpg?ip=x480"
                      alt="Exterior"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <button
                        onClick={() => {
                          setShowVideo(true);
                          setPlayedVideo(true);
                        }}
                        className="bg-[#353331d0] text-white text-lg sm:text-xl px-6 py-3 rounded-md tracking-wide shadow-lg"
                      >
                        EXTERIOR
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/2v_7UH_nLv4?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1"
                        title="Cinematic Apartment Video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Archismlogo/>
      </div>
    </RotateLock>
  );
}
