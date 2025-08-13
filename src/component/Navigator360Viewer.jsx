// Navigator360Viewer.jsx

import { useEffect, useRef, useState, useCallback } from "react";

import RotateLock from "./RotateLock";

const totalFrames = 22;

const frameNames = Array.from({ length: totalFrames }, (_, i) =>
  String(i).padStart(4, "0")
);

export default function Navigator360Viewer({
  filters,

  isFullScreen,

  onApartmentClick,

  onLoadComplete,
}) {
  const [index, setIndex] = useState(0);

  const [loadedFrames, setLoadedFrames] = useState(new Set());

  const [allAssetsLoaded, setAllAssetsLoaded] = useState(false);

  const svgRefs = useRef([]); // references to <object> elements

  const imgRefs = useRef([]);

  const containerRef = useRef(null);

  const apartmentsRef = useRef([]);

  const svgHandlersRef = useRef({}); // per-frame storage for cleanup // central drag state used by shared handlers

  const dragState = useRef({
    active: false,

    pointerId: null,

    startX: 0,

    startY: 0,

    lastX: 0,

    moved: false,

    source: null, // 'container' or 'svg'
  });

  const DRAG_THRESHOLD = 6; // tune between 4-12 if needed // prevent horizontal scroll overall while viewer mounted

  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX;

    const prevBodyOverflowX = document.body.style.overflowX;

    document.documentElement.style.overflowX = "hidden";

    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = prevHtmlOverflowX;

      document.body.style.overflowX = prevBodyOverflowX;
    };
  }, []); // ---------------- preload images + warm svg cache ----------------

  useEffect(() => {
    let mounted = true;

    const preloadAssets = async () => {
      try {
        const imagePromises = frameNames.map(
          (frameName, i) =>
            new Promise((resolve) => {
              const img = new Image();

              img.src = `/Images 1/Cliffton_O1.${frameName}.png`;

              img.onload = () => {
                imgRefs.current[i] = img;

                setLoadedFrames((prev) => {
                  const s = new Set(prev);

                  s.add(i);

                  return s;
                });

                resolve();
              };

              img.onerror = () => resolve(); // don't break on single error
            })
        ); // warm SVGs using hidden object nodes

        const svgPromises = frameNames.map(
          (frameName, i) =>
            new Promise((resolve) => {
              const object = document.createElement("object");

              object.data = `/svg_02/Cliffton_O1.${frameName}.svg`;

              object.type = "image/svg+xml";

              const tmp = document.createElement("div");

              tmp.style.position = "absolute";

              tmp.style.visibility = "hidden";

              tmp.style.pointerEvents = "none";

              tmp.appendChild(object);

              document.body.appendChild(tmp);

              const cleanup = () => {
                try {
                  tmp.remove();
                } catch {}
              };

              object.onload = () => {
                setLoadedFrames((prev) => {
                  const s = new Set(prev);

                  s.add(i + totalFrames);

                  return s;
                });

                cleanup();

                resolve();
              };

              object.onerror = () => {
                cleanup();

                resolve();
              };
            })
        );

        await Promise.all([...imagePromises, ...svgPromises]);

        if (!mounted) return;

        setAllAssetsLoaded(true);

        onLoadComplete?.(true);
      } catch (err) {
        console.error("Preload error", err);

        onLoadComplete?.(false);
      }
    };

    preloadAssets();

    return () => {
      mounted = false;
    };
  }, [onLoadComplete]); // ---------------- load apartment metadata once -------------------

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())

      .then((d) => {
        apartmentsRef.current = d?.Sheet1 || [];
      })

      .catch((err) => {
        console.error("Failed reading /data.json", err);

        apartmentsRef.current = [];
      });
  }, []); // ---------------- shared drag handlers (callable from container or svg doc) ----------------

  const startDrag = useCallback(
    (clientX, clientY, pointerId, source = "container") => {
      dragState.current.active = true;

      dragState.current.pointerId = pointerId;

      dragState.current.startX = clientX;

      dragState.current.startY = clientY;

      dragState.current.lastX = clientX;

      dragState.current.moved = false;

      dragState.current.source = source;
    },
    []
  );

  const moveDrag = useCallback(
    (clientX, clientY, preventDefaultIfDragging = true) => {
      if (!dragState.current.active) return;

      const dx = clientX - dragState.current.startX;

      const dy = clientY - dragState.current.startY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!dragState.current.moved && dist > DRAG_THRESHOLD) {
        dragState.current.moved = true;
      }

      if (dragState.current.moved) {
        const deltaX = clientX - dragState.current.lastX;

        if (Math.abs(deltaX) > 2) {
          dragState.current.lastX = clientX;

          setIndex(
            (prev) => (prev + (deltaX > 0 ? 1 : -1) + totalFrames) % totalFrames
          );
        }

        if (preventDefaultIfDragging) {
          // prevent page scrolling while dragging

          try {
            // nothing to call here; callers should call preventDefault on original event
          } catch {}
        }
      }
    },
    []
  );

  const endDrag = useCallback(() => {
    dragState.current.active = false;

    dragState.current.pointerId = null;

    dragState.current.moved = false;

    dragState.current.source = null;
  }, []); // ---------------- container pointer handlers (for when pointer starts outside object) ---------------

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return; // set container to block page scrolling gestures

    container.style.touchAction = "none";

    const onPointerDown = (ev) => {
      if (!allAssetsLoaded) return;

      if (ev.pointerType === "mouse" && ev.button !== 0) return; // If the pointerdown target is inside an <object> element, we won't start here; // but pointerdown on <object> does not reach container anyway — svg doc handlers cover those.

      startDrag(ev.clientX, ev.clientY, ev.pointerId, "container"); // attach move/up on window so dragging outside stays smooth

      const onMove = (e) => {
        moveDrag(e.clientX, e.clientY);

        if (e.cancelable) e.preventDefault();
      };

      const onUp = (e) => {
        // if not moved, let click go through (we don't suppress click)

        // cleanup

        window.removeEventListener("pointermove", onMove, { passive: false });

        window.removeEventListener("pointerup", onUp);

        endDrag();
      };

      window.addEventListener("pointermove", onMove, { passive: false });

      window.addEventListener("pointerup", onUp); // attempt pointer capture so we stay authoritative

      try {
        container.setPointerCapture?.(ev.pointerId);
      } catch {}
    };

    container.addEventListener("pointerdown", onPointerDown);

    return () => {
      try {
        container.removeEventListener("pointerdown", onPointerDown);
      } catch {}
    };
  }, [allAssetsLoaded, startDrag, moveDrag, endDrag]); // ---------------- attach handlers INSIDE each SVG document (object.contentDocument) ---------------- // this attaches: apartment click handlers + pointer handlers inside svg doc so drags that start inside svg work

  const cleanupSvgHandlersForFrame = useCallback((frameIdx) => {
    const info = svgHandlersRef.current[frameIdx];

    if (!info) return;

    try {
      info.docListeners?.forEach(({ target, name, fn, opts }) => {
        target.removeEventListener(name, fn, opts);
      });

      info.elListeners?.forEach(({ el, name, fn, opts }) => {
        el.removeEventListener(name, fn, opts);
      });
    } catch (e) {
      // ignore
    }

    delete svgHandlersRef.current[frameIdx];
  }, []);

  const attachLogicToFrame = useCallback(
    (frameIdx) => {
      const objectEl = svgRefs.current[frameIdx];

      if (!objectEl) return; // cleanup any previous handlers for this frame

      cleanupSvgHandlersForFrame(frameIdx);

      const tryAttach = () => {
        let svgDoc;

        try {
          svgDoc = objectEl.contentDocument;
        } catch (err) {
          svgDoc = null;
        }

        if (!svgDoc) {
          // If not available yet, try again shortly

          setTimeout(() => tryAttach(), 40);

          return;
        }

        const info = { docListeners: [], elListeners: [] };

        try {
          // ensure svg doc doesn't handle default touch gestures

          try {
            svgDoc.documentElement.style.touchAction = "none";
          } catch {} // hide all apartment groups then selectively show matches

          const allEls = svgDoc.querySelectorAll("[id^='Apartment_']");

          allEls.forEach((el) => {
            el.style.visibility = "hidden";

            el.style.cursor = "default";

            el.style.pointerEvents = "none"; // children also not interactive by default

            el.querySelectorAll("*").forEach(
              (c) => (c.style.pointerEvents = "none")
            );
          });

          const apartments = apartmentsRef.current || [];

          apartments.forEach((apt) => {
            const rawId = apt["Apartment ID"] ?? apt["ApartmentId"] ?? apt.id;

            if (!rawId) return;

            const svgId = rawId.startsWith("Apartment_")
              ? rawId
              : `Apartment_${rawId}`;

            const el = svgDoc.getElementById(svgId);

            if (!el) return;

            const isMatch =
              (!filters?.floor || apt.Floor === filters.floor) &&
              (!filters?.bedroom || apt.Bedroom === filters.bedroom) &&
              (!filters?.area || apt["Area Filter"] === filters.area);

            if (!isMatch) return; // enable interaction on the group and children

            el.style.visibility = "visible";

            el.style.cursor = "pointer";

            el.style.pointerEvents = "auto";

            el.querySelectorAll("*").forEach((c) => {
              c.style.pointerEvents = "auto";

              c.style.cursor = "pointer";
            });

            const onClick = (ev) => {
              try {
                ev.stopPropagation(); // show loading immediately

                onApartmentClick?.({ loading: true, id: rawId }); // fetch details

                fetch("/apartmentsDetails.json")
                  .then((r) => r.json())

                  .then((full) => {
                    const detailed = (full?.apartments || []).find(
                      (a) => a["Apartment ID"] === rawId
                    );

                    if (detailed)
                      onApartmentClick?.({ ...detailed, loading: false });
                    else onApartmentClick?.({ loading: false, id: rawId });
                  })

                  .catch((err) => {
                    console.error("apartmentsDetails fetch error", err);

                    onApartmentClick?.({ loading: false, id: rawId });
                  });
              } catch (e) {
                console.error("SVG click handler error", e);
              }
            }; // attach click and pointerup as fallback

            el.addEventListener("click", onClick);

            el.addEventListener("pointerup", onClick);

            el.addEventListener("touchstart", (t) => t.stopPropagation(), {
              passive: true,
            });

            info.elListeners.push({
              el,
              name: "click",
              fn: onClick,
              opts: false,
            });

            info.elListeners.push({
              el,
              name: "pointerup",
              fn: onClick,
              opts: false,
            });
          }); // ---------- drag listeners INSIDE svgDoc ---------- // Drag should start only when initial pointerdown is NOT on an apartment element

          const svgRoot = svgDoc.documentElement;

          const onDocPointerDown = (ev) => {
            // ignore right-clicks

            if (ev.pointerType === "mouse" && ev.button !== 0) return; // if pointerdown started on an apartment group, don't begin drag

            const aptHit =
              ev.target && ev.target.closest?.("[id^='Apartment_']");

            if (aptHit) {
              // don't start drag; let click handlers handle this tap

              return;
            } // start shared drag using client coords

            startDrag(ev.clientX, ev.clientY, ev.pointerId, "svg"); // attach move/up on svgDoc so we receive events even if pointer stays inside svg doc

            const onDocMove = (eMove) => {
              // call moveDrag directly with client coords

              moveDrag(eMove.clientX, eMove.clientY);

              if (eMove.cancelable) eMove.preventDefault();
            };

            const onDocUp = (eUp) => {
              // cleanup listeners

              try {
                svgDoc.removeEventListener("pointermove", onDocMove, {
                  passive: false,
                });

                svgDoc.removeEventListener("pointerup", onDocUp);

                svgDoc.removeEventListener("pointercancel", onDocUp);
              } catch {} // if not moved, clicks/taps still occur normally

              endDrag();
            };

            svgDoc.addEventListener("pointermove", onDocMove, {
              passive: false,
            });

            svgDoc.addEventListener("pointerup", onDocUp);

            svgDoc.addEventListener("pointercancel", onDocUp); // attempt pointer capture on the svg root (may or may not be supported)

            try {
              svgRoot.setPointerCapture?.(ev.pointerId);
            } catch (err) {}
          };

          svgDoc.addEventListener("pointerdown", onDocPointerDown, {
            passive: true,
          });

          info.docListeners.push({
            target: svgDoc,
            name: "pointerdown",
            fn: onDocPointerDown,
            opts: { passive: true },
          }); // Note: move/up listeners are attached on-demand inside pointerdown and removed inside onDocUp (per-start)

          svgHandlersRef.current[frameIdx] = info;
        } catch (err) {
          console.error("attachLogicToFrame error", err);
        }
      };

      tryAttach();
    },

    [
      filters,
      startDrag,
      moveDrag,
      endDrag,
      onApartmentClick,
      cleanupSvgHandlersForFrame,
    ]
  );

  const handleObjectLoad = useCallback(
    (i) => {
      attachLogicToFrame(i);
    },

    [attachLogicToFrame]
  ); // re-apply attachments when filters change or when all assets are loaded

  useEffect(() => {
    if (!allAssetsLoaded) return;

    frameNames.forEach((_, i) => {
      const objectEl = svgRefs.current[i];

      if (objectEl) attachLogicToFrame(i);
    });
  }, [filters, allAssetsLoaded, attachLogicToFrame]); // cleanup on unmount

  useEffect(() => {
    return () => {
      frameNames.forEach((_, idx) => cleanupSvgHandlersForFrame(idx));
    };
  }, [cleanupSvgHandlersForFrame]); // ---------------- loading UI ----------------

  if (!allAssetsLoaded) {
    const progress = Math.round((loadedFrames.size / (totalFrames * 2)) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {progress}%
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
            Loading 360° Experience
          </h2>
        </div>
      </div>
    );
  } // ---------------- render frames ----------------

  return (
    <RotateLock>
      <div
        ref={containerRef}
        className="fixed inset-0 w-screen h-screen select-none overflow-hidden"
      >
        {frameNames.map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 w-full h-full  ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={`/Images 1/Cliffton_O1.${frameNames[i]}.png`}
              alt={`frame ${i} blur`}
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
              draggable={false}
              ref={(el) => (imgRefs.current[i] = el)}
            />
            <img
              src={`/Images 1/Cliffton_O1.${frameNames[i]}.png`}
              alt={`frame ${i}`}
              className="absolute inset-0 w-full h-full object-contain z-10"
              draggable={false}
            />
            <object
              key={`svg-${i}`}
              data={`/svg_02/Cliffton_O1.${frameNames[i]}.svg`}
              type="image/svg+xml"
              ref={(el) => (svgRefs.current[i] = el)}
              className="absolute inset-0 w-full h-full object-contain z-20"
              onLoad={() => handleObjectLoad(i)}
              style={{ pointerEvents: "auto" }}
            />
          </div>
        ))}
      </div>
    </RotateLock>
  );
}
