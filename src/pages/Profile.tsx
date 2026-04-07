import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AlertCircle, Trash2, Edit2, Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const {
    location,
    persona,
    setPersona,
    alertThreshold,
    setAlertThreshold,
    watchlist,
    removeFromWatchlist,
    searchHistory,
  } = useAppStore();

  const [editingThreshold, setEditingThreshold] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(alertThreshold);
  const [editingPersona, setEditingPersona] = useState(false);

  const personaOptions: Array<"Normal" | "Asthma" | "Athlete"> = [
    "Normal",
    "Asthma",
    "Athlete",
  ];

  const personaDescriptions: Record<string, string> = {
    Normal:
      "Standard air quality recommendations based on general population guidelines",
    Asthma:
      "Optimized recommendations for asthmatic individuals with lower AQI thresholds",
    Athlete:
      "Tailored for athletes and active individuals with specific performance guidelines",
  };

  const handleSaveThreshold = () => {
    setAlertThreshold(tempThreshold);
    setEditingThreshold(false);
  };

  return (
    <AppLayout>
      <div className="min-h-screen pt-16 pb-28 md:pb-0 bg-gradient-to-b from-surface-container to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* Current Location */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-4">
              <span className="material-symbols-outlined text-teal-600">
                location_on
              </span>
              Current Location
            </h2>
            <div className="bg-teal-50/50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-200/30 dark:border-teal-800/30">
              {location ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-teal-800 dark:text-teal-100">
                    {location.city}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Coordinates: {location.lat.toFixed(4)}°,{" "}
                    {location.lng.toFixed(4)}°
                  </p>
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">
                  No location set. Use auto-detect to set your location.
                </p>
              )}
            </div>
          </div>

          {/* Health Profile / Persona */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-teal-600">
                  person
                </span>
                Health Profile
              </h2>
              {!editingPersona && (
                <button
                  onClick={() => setEditingPersona(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit2
                    size={18}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </button>
              )}
            </div>

            {editingPersona ? (
              <div className="space-y-3">
                {personaOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="persona"
                      value={option}
                      checked={persona === option}
                      onChange={(e) =>
                        setPersona(e.target.value as typeof persona)
                      }
                      className="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {option}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {personaDescriptions[option]}
                      </p>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => setEditingPersona(false)}
                  className="w-full mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save
                </button>
              </div>
            ) : (
              <div className="bg-teal-50/50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-200/30 dark:border-teal-800/30">
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-100 mb-2">
                  {persona}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {personaDescriptions[persona]}
                </p>
              </div>
            )}
          </div>

          {/* Alert Threshold */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <AlertCircle size={20} className="text-orange-500" />
                Alert Threshold
              </h2>
            </div>

            {editingThreshold ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Alert when AQI exceeds:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={tempThreshold}
                      onChange={(e) =>
                        setTempThreshold(parseInt(e.target.value))
                      }
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 min-w-[60px] text-right">
                      {tempThreshold}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Current: {alertThreshold}
                  </p>
                </div>
                <button
                  onClick={handleSaveThreshold}
                  className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save Threshold
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-orange-50/50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200/30 dark:border-orange-800/30">
                <div>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {alertThreshold}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Receive alerts when AQI exceeds this value
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempThreshold(alertThreshold);
                    setEditingThreshold(true);
                  }}
                  className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                >
                  <Edit2 size={18} className="text-orange-600" />
                </button>
              </div>
            )}
          </div>

          {/* Watchlist */}
          {watchlist.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-4">
                <span className="material-symbols-outlined text-teal-600">
                  star
                </span>
                Watchlist ({watchlist.length})
              </h2>
              <div className="space-y-2">
                {watchlist.map((city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">
                      {city}
                    </span>
                    <button
                      onClick={() => removeFromWatchlist(city)}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2
                        size={16}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-4">
                <span className="material-symbols-outlined text-teal-600">
                  history
                </span>
                Search History
              </h2>
              <div className="space-y-2">
                {searchHistory.map((city, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-500">
                      schedule
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {city}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* App Info */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              About AirSense
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AirSense helps you monitor air quality in real-time and make
              informed decisions about outdoor activities.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
              Version 1.0.0 • Data from WAQI and OpenWeather
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
