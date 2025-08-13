import { useEffect, useState, useRef } from "react";
import RotateLock from "./RotateLock";

const totalFrames = 150;
const imageList = Array.from(
  { length: totalFrames },
  (_, i) => `/Camera_01/Cliffton_O1.${String(i).padStart(4, "0")}.png`
);

export default function FullScreen360Viewer() {
  const [index, setIndex] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    setIsGrabbing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    if (Math.abs(deltaX) > 5) {
      setIndex(
        (prev) => (prev + (deltaX > 0 ? 1 : -1) + totalFrames) % totalFrames
      );
      lastX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsGrabbing(false);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    lastX.current = e.touches[0].clientX;
    setIsGrabbing(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].clientX - lastX.current;
    if (Math.abs(deltaX) > 5) {
      setIndex(
        (prev) => (prev + (deltaX > 0 ? 1 : -1) + totalFrames) % totalFrames
      );
      lastX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setIsGrabbing(false);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <RotateLock>
      <div className="absolute inset-0 z-0 select-none w-full h-full min-h-[100dvh] overflow-hidden">
        {/* Blurred background */}
        <img
          src={imageList[index]}
          alt="Background Blur"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
          draggable={false}
        />

        {/* Foreground crisp image */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 px-2 sm:px-4 md:px-6 lg:px-8 ${
            isGrabbing ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <img
            src={imageList[index]}
            alt="360 View"
            className="w-full h-auto max-h-full object-contain"
            draggable={false}
          />
        </div>
      </div>
    </RotateLock>
  );
}
