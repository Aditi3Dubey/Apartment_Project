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

export default function Sidebar({ activeTab, setActiveTab, contentRef }) {
  const [isOpen, setIsOpen] = useState(true);
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

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const enterFullscreen = async () => {
    if (contentRef?.current?.requestFullscreen) {
      await contentRef.current.requestFullscreen();
      setIsFullscreen(true);
      setIsOpen(true); // ✅ Keep sidebar open in fullscreen
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);
      if (!full) setIsOpen(window.innerWidth >= 640); // Restore based on screen size
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!isFullscreen) setIsOpen(!mobile); // Collapse sidebar on small screens if not fullscreen
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFullscreen]);

  return (
    <>
      {/* Floating reopen button (for all modes) */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-full cursor-pointer hover:bg-black/90 transition flex items-center gap-2 shadow-md"
        >
          <div className="bg-cyan-300 p-2 rounded-full">
            <Building2 className="text-black w-5 h-5" />
          </div>
          <div className="bg-white p-1 rounded-full">
            <ChevronRight className="text-black w-4 h-4" />
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isOpen && (
        <div
          className={`fixed top-4 left-4 bottom-4 z-40 bg-black/70 backdrop-blur-md text-white p-4 
          rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between w-56`}
        >
          <div>
            {/* Logo & Collapse Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-300 p-2 rounded-full">
                  <Building2 className="text-black w-5 h-5" />
                </div>
                <span className="text-sm font-semibold">Aurora Visuals</span>
              </div>
              <div
                onClick={() => setIsOpen(false)}
                className="hidden sm:block ml-auto bg-white text-black rounded-full p-1 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    if (item.label === "Preview") {
                      enterFullscreen();
                    } else if (isMobile) {
                      setIsOpen(false);
                    }
                  }}
                  isOpen={isOpen}
                />
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
            <span className="w-2 h-2 bg-red-600 rounded-full ml-auto mr-2" />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
        active ? "bg-[#292929]" : "hover:bg-[#1a1a1a]"
      } gap-4`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
  );
}
