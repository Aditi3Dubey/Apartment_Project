import { useEffect, useRef, useState } from "react";
import Sidebar from "./component/Sidebar";
import NavigatorPanel from "./component/NavigatorPanel";
import ApartmentDetailPanel from "./component/ApartmentDetailPanel";
import { Info } from "lucide-react";
import LocationPanel from "./component/LocationPanel";
import Virtualtour from "./component/Virtualtour";
import Gallary from "./component/Gallery";
import Archismlogo from "./component/Archismlogo";
import FullScreen360Viewer from "./component/FullScreen360Viewer";
import Loader from "./component/Loader";
import CinematicVideo from "./component/CinematicVideo";
import image1 from "./assets/Interior.jpg";
import image2 from "./assets/Exterior.jpg";
import floor from "./assets/floorplan.png";
import situation from "./assets/situation.png";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ExteriorGalleryPage from "./component/ExteriorGalleryPage";
import "leaflet/dist/leaflet.css";
import RotateLock from "./component/RotateLock";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [lastRealTab, setLastRealTab] = useState("Overview");
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clickedExterior, setClickedExterior] = useState(false);
  const [playedVideo, setPlayedVideo] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const contentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const screenIsSmall = window.innerWidth < 768;
      setIsSidebarOpen(!screenIsSmall);
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
    const handleFsChange = () => {
      setIsPreviewFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

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
      const totalAssets = pngImages.length + svgImages.length + 1;
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
      const first360 = new Image();
      first360.onload = () => {
        trackProgress();
        setIsLoaded(true);
      };
      first360.onerror = () => {
        trackProgress();
        setIsLoaded(true);
      };
      first360.src = `/Camera_01/Cliffton_O1.0000.png`;
    };
    loadAllAssets();
  }, []);

  const handleTabClick = (tab) => {
    if (tab === "Preview") {
      if (!document.fullscreenElement && contentRef.current?.requestFullscreen) {
        contentRef.current.requestFullscreen();
        setRefreshKey((prev) => ({ ...prev, Navigator: Date.now() }));
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      return;
    }

    setIsPreviewFullscreen(false);
    if (location.pathname === "/exterior") navigate("/");

    if (tab === "Cinematic Video") {
      setPlayedVideo(false);
      setClickedExterior(false);
    }

    setSelectedApartment(null);
    setRefreshKey((prev) => ({ ...prev }));
    setActiveTab(tab);
  };

  const renderTab = (tab) => {
    const isFull = isPreviewFullscreen && tab === activeTab;
    if (tab === "Navigator") {
      return selectedApartment ? (
        <ApartmentDetailPanel
          apartment={selectedApartment}
          onBack={() => setSelectedApartment(null)}
        />
      ) : (
        <NavigatorPanel
          key={refreshKey[tab]}
          isFullScreen={isFull}
          activeTab={activeTab}
          onApartmentClick={(apt) => setSelectedApartment(apt)}
        />
      );
    }
    switch (tab) {
      case "Location":
        return <LocationPanel onCategorySelect={setSelectedCategory} key={refreshKey[tab]} />;
      case "Virtual Tour":
        return <Virtualtour key={refreshKey[tab]} />;
      case "Gallery":
        return <Gallary key={refreshKey[tab]} navigate={navigate} />;
      case "Overview":
        return <FullScreen360Viewer key={refreshKey[tab]} isFullScreen={isFull} />;
      case "Exterior":
        return <ExteriorGalleryPage key={refreshKey[tab]} isFullScreen={isFull} />;
      default:
        return null;
    }
  };

  const tabs = [
    "Overview",
    "Navigator",
    "Location",
    "Virtual Tour",
    "Gallery",
    "Cinematic Video",
    "Exterior",
  ];

  return !isLoaded ? (
    <Loader progress={progress} />
  ) : (
    <div className="fade-in bg-[#0d1117] w-screen min-h-[100dvh] max-w-screen overflow-hidden">
      <div className="relative w-screen min-h-[100dvh] overflow-hidden select-none">
        <RotateLock>
          <div
            className="relative z-10 flex flex-col sm:flex-row min-h-[100dvh] overflow-hidden"
            ref={contentRef}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabClick}
              isOpen={isSidebarOpen}
              toggleOpen={() => setIsSidebarOpen((prev) => !prev)}
              contentRef={contentRef}
            />
            <div className="flex-1 relative">
              {activeTab === "Overview" && (
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
              <div className="absolute inset-0 w-full min-h-[100dvh]">
                <Routes>
                  <Route
                    path="/exterior"
                    element={<ExteriorGalleryPage isFullScreen={false} />}
                  />
                  <Route
                    path="/*"
                    element={
                      <>
                        {tabs.map((tab) => {
                          const isVisible = tab === activeTab;
                          return (
                            <div
                              key={`${tab}-${isVisible ? refreshKey[tab] : "inactive"}`}
                              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                                isVisible
                                  ? "opacity-100 z-10"
                                  : "opacity-0 z-0 pointer-events-none"
                              }`}
                            >
                              {tab === "Cinematic Video" && isVisible ? (
                                <CinematicVideo
                                  clickedExterior={clickedExterior}
                                  setClickedExterior={setClickedExterior}
                                  playedVideo={playedVideo}
                                  setPlayedVideo={setPlayedVideo}
                                  fromPreview={isPreviewFullscreen}
                                />
                              ) : (
                                renderTab(tab)
                              )}
                            </div>
                          );
                        })}
                      </>
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </RotateLock>
      </div>
    </div>
  );
}

export default App;
