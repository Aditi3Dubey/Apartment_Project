import React, { useState, useCallback } from "react";
import { RotateCcw, X, ChevronDown, ChevronLeft } from "lucide-react";
import { Listbox } from "@headlessui/react";
import Navigator360Viewer from "./Navigator360Viewer";
import ApartmentDetailPanel from "./ApartmentDetailPanel";
import RotateLock from "./RotateLock";
import Archismlogo from "./Archismlogo";

const NavigatorPanel = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [filters, setFilters] = useState({ floor: null, bedroom: null, area: null });
  const [viewerIsLoading, setViewerIsLoading] = useState(true);

  const bedrooms = ["2 Bedroom", "3 Bedroom"];
  const areas = ["500-1000", "1000-1500"];
  const floorOptions = [1, 2, 3, 4];

  const handleReset = useCallback(() => {
    setFilters({ floor: null, bedroom: null, area: null });
    setSelectedApartment(null);
  }, []);

  const handleApartmentClick = useCallback((apartmentData) => {
    setSelectedApartment(apartmentData);
  }, []);

  const handlePanelClose = useCallback(() => {
    setSelectedApartment(null);
  }, []);

  const handleViewerLoadComplete = useCallback((success) => {
    setViewerIsLoading(false);
    if (success) {
      setIsOpen(true);
    }
  }, []);

  return (
    <RotateLock>
      <div className="relative h-[100dvh] w-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Navigator360Viewer
            filters={filters}
            onApartmentClick={handleApartmentClick}
            onLoadComplete={handleViewerLoadComplete}
          />
        </div>

        {viewerIsLoading && (
          <div className="absolute inset-0 z-40 bg-black bg-opacity-70 flex items-center justify-center text-white text-xl">
            Loading 360 Tour...
          </div>
        )}

        {isOpen && !selectedApartment && !viewerIsLoading && (
          <div className="fixed right-2 top-3 bottom-3 w-[90vw] max-w-[300px] sm:w-[240px] bg-black/60 text-white p-4 rounded-xl backdrop-blur-lg z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out transform translate-x-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Navigator</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 sm:scrollbar-none scrollbar-thin scrollbar-thumb-white/60 scrollbar-track-white/10">
              {/* Bedroom Filter */}
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-sm mb-2 font-medium">Bedroom</div>
                <div className="flex gap-2 flex-wrap">
                  {bedrooms.map((br) => (
                    <div
                      key={br}
                      onClick={() => setFilters((prev) => ({ ...prev, bedroom: br }))}
                      className={`px-3 py-1.5 rounded text-sm cursor-pointer bg-white/20 text-center transition-all hover:border-2 hover:border-orange-500 ${filters.bedroom === br ? "border-orange-500 border-2" : ""}`}
                    >
                      {br}
                    </div>
                  ))}
                </div>
              </div>
              {/* Floor Filter */}
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-sm mb-2 font-medium">Select Floor</div>
                <Listbox
                  value={filters.floor}
                  onChange={(val) => setFilters((prev) => ({ ...prev, floor: val }))}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full bg-white/20 text-white text-sm px-4 py-2 pr-10 rounded-lg text-left backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      {filters.floor ? `Floor ${filters.floor}` : "-- Choose Floor --"}
                    </Listbox.Button>
                    <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-white pointer-events-none h-4 w-4" />
                    <Listbox.Options className="absolute mt-1 w-full bg-neutral-700 text-white rounded-lg shadow-lg z-50 max-h-60 overflow-auto text-sm">
                      {floorOptions.map((floor) => (
                        <Listbox.Option
                          key={floor}
                          value={floor}
                          className={({ active }) => `cursor-pointer px-4 py-2 ${active ? "bg-orange-500" : "bg-transparent"}`}
                        >
                          Floor {floor}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              {/* Area Filter */}
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-sm mb-2 font-medium">Select Area</div>
                <div className="space-y-2">
                  {areas.map((area) => (
                    <div
                      key={area}
                      onClick={() => setFilters((prev) => ({ ...prev, area }))}
                      className={`bg-white/20 px-3 py-1.5 rounded text-sm cursor-pointer transition-all hover:border-2 hover:border-orange-500 ${filters.area === area ? "border-orange-500 border-2" : ""}`}
                    >
                      {area} sq.ft
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-1/2 border border-white px-3 py-2 rounded-lg text-sm bg-white/10 hover:border-orange-500 transition-all"
              >
                <RotateCcw className="w-4 h-4 inline-block mr-1" /> Reset
              </button>
              <button className="w-full sm:w-1/2 bg-orange-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all">
                Available
              </button>
            </div>
          </div>
        )}

        <ApartmentDetailPanel
          isOpen={!!selectedApartment}
          onClose={handlePanelClose}
          selectedApartment={selectedApartment}
        />

        {!isOpen && !viewerIsLoading && (
          <button
            onClick={() => setIsOpen(true)}
            title="Open Navigator Panel"
            className="fixed top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30 backdrop-blur-md hover:bg-orange-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {!isOpen && !viewerIsLoading && <Archismlogo />}
      </div>
    </RotateLock>
  );
};

export default NavigatorPanel;