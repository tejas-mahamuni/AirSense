import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import AQIMap from "@/components/dashboard/AQIMap";

const Maps = () => {
  return (
    <AppLayout>
      <main className="relative h-screen w-full pt-16 pb-28 md:pb-0 font-body md:overflow-hidden">
        {/* Full-screen Leaflet Map */}
        <div className="absolute inset-0 pt-16 pb-28 md:pb-0">
          <AQIMap />
        </div>

        {/* Floating AQI Scale Legend (Bottom Center) */}
        <div className="absolute bottom-32 md:bottom-12 left-1/2 -translate-x-1/2 z-[1000] hidden sm:block">
          <div className="bg-surface-container-lowest/90 glass-panel px-6 py-3 rounded-full shadow-2xl border border-outline-variant/10 flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
              AQI Scale
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#4CAF50" }}
                ></div>
                <span className="text-[11px] font-semibold font-label">
                  Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#FFD60A" }}
                ></div>
                <span className="text-[11px] font-semibold font-label">
                  Moderate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#FF9F0A" }}
                ></div>
                <span className="text-[11px] font-semibold font-label">
                  Sensitive
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#FF453A" }}
                ></div>
                <span className="text-[11px] font-semibold font-label">
                  Unhealthy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#BF5AF2" }}
                ></div>
                <span className="text-[11px] font-semibold font-label">
                  Hazardous
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Maps;
