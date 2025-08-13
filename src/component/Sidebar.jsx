import {
  Building2,
  Eye,
  Locate,
  Video,
  GalleryVerticalEnd,
  VideoOff,
  Maximize2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  contentRef,
  isOpen,
  toggleOpen,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { icon: <Eye />, label: "Overview" },
    { icon: <Building2 />, label: "Navigator" },
    { icon: <Locate />, label: "Location" },
    { icon: <Video />, label: "Virtual Tour" },
    { icon: <GalleryVerticalEnd />, label: "Gallery" },
    { icon: <VideoOff />, label: "Cinematic Video" },
    { icon: <Maximize2 />, label: "Preview" },
  ];

  const enterFullscreen = async () => {
    if (contentRef?.current?.requestFullscreen) {
      await contentRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed top-3 left-3 z-50 bg-black/80 text-white px-2 py-1 rounded-full hover:bg-black/90 transition flex items-center gap-1 sm:gap-2 shadow-md"
        >
          <div className="bg-cyan-300 p-1 sm:p-2 rounded-full">
            <Building2 className="text-black w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="bg-white p-1 rounded-full">
            <ChevronRight className="text-black w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside
          className={`fixed top-3 left-3 bottom-3 z-40 bg-black/70 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 flex flex-col 
            ${isMobile ? "w-36" : "w-48 lg:w-56"}`}
        >
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-cyan-300 p-1 sm:p-2 rounded-full">
                <Building2 className="text-black w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold">
                Aurora Visuals
              </span>
            </div>
            <button
              onClick={toggleOpen}
              className="ml-auto bg-white text-black rounded-full p-1"
            >
              <ChevronLeft size={isMobile ? 14 : 16} />
            </button>
          </div>

          {/* Scrollable Menu Section */}
          <div className="flex-1 overflow-y-auto pr-1 mt-2 sm:mt-3">
            <nav className="flex flex-col gap-1 sm:gap-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    if (isMobile) toggleOpen();
                  }}
                  isMobile={isMobile}
                />
              ))}
            </nav>
          </div>

          {/* Fixed Logout at Bottom */}
          <div className="mt-3 border-t border-white/20 pt-2 sm:pt-3">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-sm">Logout</span>
              <span className="w-2 h-2 bg-red-600 rounded-full ml-auto mr-1 sm:mr-2" />
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

function SidebarItem({ icon, label, active, onClick, isMobile }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
        active ? "bg-[#292929]" : "hover:bg-[#1a1a1a]"
      } gap-2 sm:gap-3`}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5">{icon}</div>
      <span className="text-[10px] sm:text-sm whitespace-nowrap">{label}</span>
    </div>
  );
}
