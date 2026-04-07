import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import LocationModal from "./LocationModal";

const BottomNavBar = () => {
  const location = useLocation();
  const { showModal, setShowModal, requestLocation } = useGeolocation();
  const [localShowModal, setLocalShowModal] = useState(false);

  const handleSearchClick = () => {
    setLocalShowModal(true);
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-3xl">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center transition-all ${
            location.pathname === "/"
              ? "bg-teal-100/50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-100 rounded-2xl px-5 py-2"
              : "text-slate-400 dark:text-slate-500 px-5 py-2"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                location.pathname === "/" ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            home
          </span>
          <span className="text-[10px] font-semibold font-label uppercase tracking-widest mt-1">
            Home
          </span>
        </Link>

        <Link
          to="/maps"
          className={`flex flex-col items-center justify-center transition-all ${
            location.pathname === "/maps"
              ? "bg-teal-100/50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-100 rounded-2xl px-5 py-2"
              : "text-slate-400 dark:text-slate-500 px-5 py-2"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                location.pathname === "/maps" ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            map
          </span>
          <span className="text-[10px] font-semibold font-label uppercase tracking-widest mt-1">
            Maps
          </span>
        </Link>

        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 transition-all cursor-pointer hover:text-slate-600 dark:hover:text-slate-400"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-semibold font-label uppercase tracking-widest mt-1">
            Search
          </span>
        </button>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center transition-all ${
            location.pathname === "/profile"
              ? "bg-teal-100/50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-100 rounded-2xl px-5 py-2"
              : "text-slate-400 dark:text-slate-500 px-5 py-2"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                location.pathname === "/profile" ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            person
          </span>
          <span className="text-[10px] font-semibold font-label uppercase tracking-widest mt-1">
            Profile
          </span>
        </Link>
      </nav>

      <LocationModal
        open={localShowModal}
        onClose={() => setLocalShowModal(false)}
        onRetryGeo={requestLocation}
      />
    </>
  );
};

export default BottomNavBar;
