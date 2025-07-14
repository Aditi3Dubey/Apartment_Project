import { useEffect, useRef, useState } from "react";
import Sidebar from "./component/Sidebar";
import NavigatorPanel from "./component/NavigatorPanel";
import { Info } from "lucide-react";
import LocationPanel from "./component/LocationPanel";
import Virtualtour from "./component/Virtualtour";
import Gallary from "./component/Gallery";
import Archismlogo from "./component/Archismlogo";
import FullScreen360Viewer from "./component/FullScreen360Viewer";
import Loader from "./component/Loader";
import image1 from "./assets/Interior.jpg";
import image2 from "./assets/Esterior.jpg";
import floor from "./assets/floorplan.png";
import situation from "./assets/situation.png";
import CinematicVideo from "./component/CinematicVideo";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [lastRealTab, setLastRealTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (activeTab !== "Preview") {
      setLastRealTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const loadAllAssets = async () => {
      const pngImages = [];
      const svgImages = [];

      for (let i = 0; i < 150; i++) {
        pngImages.push(`/Camera_01/Cliffton_O1.${String(i).padStart(4, "0")}.png`);
      }

      for (let i = 0; i < 22; i++) {
        svgImages.push(`/svg_02/Cliffton_O1.${String(i).padStart(4, "0")}.svg`);
      }

      pngImages.push(
        image1,
        image2,
        "https://i.pinimg.com/736x/91/6a/d1/916ad15dff10cdf9087b58f4fc2c6673.jpg",
        "https://balancedarchitecture.com/wp-content/uploads/2021/11/EXISTING-FIRST-FLOOR-PRES-scaled-e1635965923983.jpg",
        "https://www.houseplans.net/uploads/plans/28196/floorplans/28196-1-1200.jpg?v=093022132212",
        "https://www.pkrestates.com/wp-content/uploads/2020/05/Little-India-Aerial-View.jpg",
        floor,
        situation
      );

      const totalAssets = pngImages.length + svgImages.length;
      let loadedAssets = 0;

      const trackProgress = () => {
        loadedAssets++;
        setProgress(Math.round((loadedAssets / totalAssets) * 100));
      };

      const preloadTrackedImages = pngImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            trackProgress();
            resolve();
          };
          img.onerror = () => {
            trackProgress();
            resolve();
          };
          img.src = src;
        });
      });

      const preloadTrackedSVGs = svgImages.map((src) => {
        return new Promise((resolve) => {
          fetch(src)
            .then(() => {
              trackProgress();
              resolve();
            })
            .catch(() => {
              trackProgress();
              resolve();
            });
        });
      });

      await Promise.all([...preloadTrackedImages, ...preloadTrackedSVGs]);
      setIsLoaded(true);
    };

    loadAllAssets();
  }, []);

  if (!isLoaded) return <Loader progress={progress} />;

  const renderTab = (tab) => {
    switch (tab) {
      case "Navigator":
        return <NavigatorPanel />;
      case "Location":
        return <LocationPanel />;
      case "Virtual Tour":
        return <Virtualtour />;
      case "Gallery":
        return <Gallary />;
      case "Overview":
        return <FullScreen360Viewer />;
      default:
        return null;
    }
  };

  // Show Night Mode toggle in fullscreen modes only
  const isFullScreenContent =
    (lastRealTab === "Overview" && (activeTab === "Overview" || activeTab === "Preview")) ||
    (lastRealTab === "Cinematic Video" && activeTab === "Preview");

  const tabs = [
    "Overview",
    "Navigator",
    "Location",
    "Virtual Tour",
    "Gallery",
    "Cinematic Video",
  ];

  return (
    <div>
      <div className="relative w-screen h-screen overflow-hidden select-none">
        <div className="relative z-10 flex h-full overflow-hidden" ref={contentRef}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            toggleOpen={() => setIsSidebarOpen((prev) => !prev)}
            contentRef={contentRef}
          />

          <div className="flex-1 relative">
            {isFullScreenContent && (
              <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 flex items-center gap-2 text-sm z-20 shadow-md rounded-lg">
                <span>Night Mode</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-400 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
                    <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
                <Info className="w-5 h-5 ml-2 text-white/80" />
              </div>
            )}

            <div className="absolute inset-0 w-full h-full">
              {tabs.map((tab) => {
                const isVisible =
                  activeTab === tab || (activeTab === "Preview" && lastRealTab === tab);

                return (
                  <div
                    key={tab}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isVisible ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    {tab === "Cinematic Video" && activeTab === "Preview" && lastRealTab === "Cinematic Video" ? (
                      <CinematicVideo key="cinematic-preview" />
                    ) : tab === "Cinematic Video" && activeTab === "Cinematic Video" ? (
                      <CinematicVideo key="cinematic-tab" />
                    ) : (
                      renderTab(tab)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Archismlogo />
    </div>
  );
}

export default App;
