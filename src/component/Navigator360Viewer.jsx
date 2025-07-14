import { useEffect, useState, useRef } from "react";

const totalFrames = 22;
const frameNames = Array.from({ length: totalFrames }, (_, i) =>
  String(i).padStart(4, "0")
);

export default function Navigator360Viewer({ filters }) {
  const [index, setIndex] = useState(0);
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const touchStartX = useRef(0);

  const imagePath = `/Images 1/Cliffton_O1.${frameNames[index]}.png`;
  const svgPath = `/svg_02/Cliffton_O1.${frameNames[index]}.svg`;

  // 🔃 Preload all images and SVGs
  useEffect(() => {
    frameNames.forEach((name) => {
      const img = new Image();
      img.src = `/Images 1/Cliffton_O1.${name}.png`;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = `/svg_02/Cliffton_O1.${name}.svg`;
      document.head.appendChild(link);
    });
  }, []);

  // 🖱️ + 📱 Rotation logic
  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastX.current;
      if (Math.abs(deltaX) > 5) {
        setIndex((prev) => (prev + (deltaX > 0 ? 1 : -1) + totalFrames) % totalFrames);
        lastX.current = e.clientX;
      }
    };

    const handleMouseUp = () => (isDragging.current = false);

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 10) {
        setIndex((prev) => (prev + (deltaX > 0 ? 1 : -1) + totalFrames) % totalFrames);
        touchStartX.current = e.touches[0].clientX;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  // 🖼️ SVG load trigger
  const handleSVGLoad = () => {
    requestAnimationFrame(() => {
      updateSVGVisibility();
    });
  };

  // 🔄 Update visibility when filters or frame changes
  useEffect(() => {
    updateSVGVisibility();
  }, [filters, index]);

  // ✅ Apply filters and add hover tooltip logic
  const updateSVGVisibility = () => {
    const svgDoc = svgRef.current?.contentDocument;
    if (!svgDoc || !filters) return;

    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const apartments = data.Sheet1;

        // 1️⃣ Hide all initially
        const svgElements = svgDoc.querySelectorAll("[id^='Apartment_']");
        svgElements.forEach((el) => {
          el.style.visibility = "hidden";
          el.style.cursor = "default";
          el.onmouseenter = null;
          el.onmousemove = null;
          el.onmouseleave = null;
        });

        // 2️⃣ Show matching apartments with tooltip
        apartments.forEach((apt) => {
          const el = svgDoc.getElementById(apt["Apartment ID"]);
          if (!el) return;

          const isMatch =
            (!filters.floor || apt.Floor === filters.floor) &&
            (!filters.bedroom || apt.Bedroom === filters.bedroom) &&
            (!filters.area || apt["Area Filter"] === filters.area);

          if (isMatch) {
            el.style.visibility = "visible";
            el.style.cursor = "pointer";

            // Tooltip on hover
            el.onmouseenter = (ev) => {
              if (document.getElementById("svg-tooltip")) return;

              const tooltip = document.createElement("div");
              tooltip.id = "svg-tooltip";
              tooltip.innerHTML = `
                <strong>${apt["Apartment ID"]}</strong><br/>
                Floor: ${apt.Floor}<br/>
                Bedroom: ${apt.Bedroom}<br/>
                Area: ${apt.Area} sqft
              `;

              Object.assign(tooltip.style, {
                position: "fixed",
                top: ev.clientY + 15 + "px",
                left: ev.clientX + 15 + "px",
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                pointerEvents: "none",
                zIndex: 9999,
              });

              document.body.appendChild(tooltip);
            };

            el.onmousemove = (ev) => {
              const tooltip = document.getElementById("svg-tooltip");
              if (tooltip) {
                tooltip.style.top = ev.clientY + 15 + "px";
                tooltip.style.left = ev.clientX + 15 + "px";
              }
            };

            el.onmouseleave = () => {
              const tooltip = document.getElementById("svg-tooltip");
              if (tooltip) tooltip.remove();
            };
          }
        });
      });
  };

  // 🖼️ Final JSX
  return (
    <div className="absolute inset-0">
      <img
        src={imagePath}
        alt="Background Blur"
        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
      />
      <img
        src={imagePath}
        alt="360 View"
        className="absolute inset-0 w-full h-full object-contain z-10 select-none"
        draggable={false}
      />
      <object
        data={svgPath}
        type="image/svg+xml"
        className="absolute inset-0 w-full h-full object-contain z-20"
        onLoad={handleSVGLoad}
        ref={svgRef}
      />
    </div>
  );
}
