import React, { useRef, useState, useEffect, useCallback } from "react";

const TOTAL_FRAMES = 30;
const DRAG_THRESHOLD = 5; // Pixels to distinguish a click from a drag

const ProductSpin = ({ areaId = "02", onClose }) => {
  const [index, setIndex] = useState(0);
  const [plotData, setPlotData] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const imageCache = useRef([]);
  const svgCache = useRef([]);
  const overlayRef = useRef(null);
  const dragLayerRef = useRef(null);

  const isDragging = useRef(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const lastX = useRef(0);

  const getImagePath = (i) =>
    `/Area/A_${areaId}/Seq_Tulsi_${areaId}.${String(i).padStart(4, "0")}.png`;

  const getSVGPath = (i) =>
    `/Svg/Svg_${areaId}/Seq_Tulsi_${areaId}.${String(i).padStart(4, "0")}.svg`;

  // Preload all assets with progress tracking
  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = TOTAL_FRAMES * 2;
    const updateProgress = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / totalAssets) * 100));
      if (loadedCount === totalAssets) {
        setIsLoaded(true);
      }
    };

    const loadAssets = async () => {
      const imagePromises = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = getImagePath(i);
          img.onload = () => {
            imageCache.current[i] = img;
            updateProgress();
            resolve();
          };
        })
      );

      const svgPromises = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
        fetch(getSVGPath(i))
          .then((res) => res.text())
          .then((svgText) => {
            const parsed = new DOMParser().parseFromString(
              svgText,
              "image/svg+xml"
            );
            const svg = parsed.documentElement;
            // A common issue is inline width/height. Remove them for responsiveness.
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute(
              "viewBox",
              svg.getAttribute("viewBox") || "0 0 1920 1080"
            );
            svgCache.current[i] = svg;
            updateProgress();
          })
      );

      Promise.all([...imagePromises, ...svgPromises]).catch(console.error);
    };

    loadAssets();
  }, [areaId]);

  // Fetch plot data
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setPlotData(data))
      .catch(console.error);
  }, []);

  // Update SVG overlay and event listeners whenever the index changes
  useEffect(() => {
    if (!isLoaded || !svgCache.current[index] || !overlayRef.current) return;

    const container = overlayRef.current;
    container.innerHTML = "";
    const svgClone = svgCache.current[index].cloneNode(true);

    svgClone
      .querySelectorAll("path, polygon, rect, circle, ellipse")
      .forEach((path) => {
        const id = path.id;
        if (id && plotData.length > 0) {
          const match = plotData.find((p) => p.id === id);
          if (match) {
            path.style.cursor = "pointer";
            path.onclick = (e) => {
              e.stopPropagation();
              setSelectedPlot(match);
            };
          }
        }
      });
    container.appendChild(svgClone);
  }, [index, isLoaded, plotData]);

  // Main Event Handling Logic for Drag and Click
  const handleStart = useCallback((e) => {
    isDragging.current = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startPosition.current = { x: clientX, y: clientY };
    lastX.current = clientX;
  }, []);

  const handleMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const totalMovement = Math.sqrt(
      Math.pow(clientX - startPosition.current.x, 2) +
        Math.pow(clientY - startPosition.current.y, 2)
    );

    if (totalMovement > DRAG_THRESHOLD) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      if (e.cancelable) e.preventDefault();
      const delta = clientX - lastX.current;
      if (Math.abs(delta) > 2) {
        setIndex(
          (prev) => (prev + (delta > 0 ? 1 : -1) + TOTAL_FRAMES) % TOTAL_FRAMES
        );
        lastX.current = clientX;
      }
    }
  }, []);

  const handleEnd = useCallback((e) => {
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const totalMovement = Math.sqrt(
      Math.pow(endX - startPosition.current.x, 2) +
        Math.pow(endY - startPosition.current.y, 2)
    );

    // CRITICAL: Forward the click event
    if (!isDragging.current && totalMovement < DRAG_THRESHOLD) {
      const dragLayer = dragLayerRef.current;
      dragLayer.style.pointerEvents = "none";
      const elementAtPoint = document.elementFromPoint(endX, endY);
      if (elementAtPoint && overlayRef.current?.contains(elementAtPoint)) {
        elementAtPoint.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: endX,
            clientY: endY,
          })
        );
      }
      dragLayer.style.pointerEvents = "auto";
    }
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const dragLayer = dragLayerRef.current;
    if (!dragLayer || !isLoaded) return;

    dragLayer.addEventListener("mousedown", handleStart);
    dragLayer.addEventListener("mousemove", handleMove);
    dragLayer.addEventListener("mouseup", handleEnd);
    dragLayer.addEventListener("touchstart", handleStart, { passive: false });
    dragLayer.addEventListener("touchmove", handleMove, { passive: false });
    dragLayer.addEventListener("touchend", handleEnd);

    return () => {
      dragLayer.removeEventListener("mousedown", handleStart);
      dragLayer.removeEventListener("mousemove", handleMove);
      dragLayer.removeEventListener("mouseup", handleEnd);
      dragLayer.removeEventListener("touchstart", handleStart);
      dragLayer.removeEventListener("touchmove", handleMove);
      dragLayer.removeEventListener("touchend", handleEnd);
    };
  }, [isLoaded, handleStart, handleMove, handleEnd]);

  // Loading UI and Main View
  return (
    <div className="absolute inset-0 select-none">
      {!isLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <div className="text-xl">Loading... {loadingProgress}%</div>
        </div>
      ) : (
        <>
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <img
              src={imageCache.current[index]?.src}
              alt="Blurred"
              className="w-full h-full object-cover filter blur-md scale-105"
            />
          </div>

          {/* Foreground Image */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <img
              src={imageCache.current[index]?.src}
              alt={`Frame ${index}`}
              className="w-full h-full object-contain absolute"
              draggable={false}
            />
          </div>

          {/* SVG Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-20 w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:absolute [&>svg]:inset-0 [&>svg]:object-contain"
          />

          {/* Drag Layer - The invisible surface that handles all mouse and touch events */}
          <div
            ref={dragLayerRef}
            className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
            style={{ background: "transparent" }}
          ></div>

          {/* Selected Plot Info Panel */}
          {selectedPlot && (
            <div className="fixed top-4 right-4 w-64 bg-black/80 backdrop-blur-md text-white z-50 p-4 rounded-xl shadow-xl overflow-auto space-y-2">
              <div className="flex justify-between items-start mb-2">
                <strong className="text-lg">Plot Details</strong>
                <button
                  onClick={() => setSelectedPlot(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="bg-black/40 p-3 rounded-lg space-y-2">
                <div className="font-bold text-lg">{selectedPlot.name}</div>
                <p>
                  {selectedPlot.bhk} | {selectedPlot.facing}
                </p>
                <p>
                  <span className="font-semibold">Area:</span>{" "}
                  {selectedPlot.area} sqft
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₹
                  {selectedPlot.mrp?.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      selectedPlot.availability === "Available"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {selectedPlot.availability}
                  </span>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSpin;