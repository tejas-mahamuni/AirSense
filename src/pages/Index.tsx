import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import HeroCard from "@/components/dashboard/HeroCard";
import AQIWeatherToggle from "@/components/dashboard/AQIWeatherToggle";
import PollutantBars from "@/components/dashboard/PollutantBars";
import HealthRecommendations from "@/components/dashboard/HealthRecommendations";
import InsightEngine from "@/components/dashboard/InsightEngine";
import HourlyCarousel from "@/components/dashboard/HourlyCarousel";
import SeasonalContext from "@/components/dashboard/SeasonalContext";
import IndoorEstimator from "@/components/dashboard/IndoorEstimator";
import WeatherGrid from "@/components/dashboard/WeatherGrid";
import WindCompass from "@/components/dashboard/WindCompass";
import ActionImpactCalculator from "@/components/dashboard/ActionImpactCalculator";
import AQISimulator from "@/components/dashboard/AQISimulator";
import CompareCities from "@/components/dashboard/CompareCities";
import Watchlist from "@/components/dashboard/Watchlist";
import LearningHub from "@/components/dashboard/LearningHub";
import PopularCities from "@/components/dashboard/PopularCities";
import EnvironmentalCorrelation from "@/components/dashboard/EnvironmentalCorrelation";
import AQILegend from "@/components/dashboard/AQILegend";
import LocationModal from "@/components/layout/LocationModal";
import { useAppStore } from "@/store/useAppStore";
import { useGeolocation } from "@/hooks/useGeolocation";

const Index = () => {
  const { activeTab, location } = useAppStore();
  const { loading, showModal, setShowModal, requestLocation } =
    useGeolocation();

  // If loading and we don't have a location yet, show detector
  if (loading && !location) {
    return (
      <AppLayout>
        <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto font-body flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-headline text-lg">
              Detecting your location...
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // If not loading but still no location (e.g. denied), show modal
  if (!location) {
    return (
      <AppLayout>
        <LocationModal
          open={true}
          onClose={() => {}}
          onRetryGeo={requestLocation}
        />
        <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto font-body flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-on-surface-variant font-headline text-lg">
              Please select your location...
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Final Dashboard Render
  return (
    <AppLayout>
      <LocationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onRetryGeo={requestLocation}
      />
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto font-body">
        {/* Toggle */}
        <AQIWeatherToggle />

        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1 font-headline">
            {activeTab === "aqi"
              ? "🌫️ Air Quality"
              : activeTab === "weather"
                ? "🌤️ Weather"
                : "🔬 Environmental Insights"}
          </h1>
          <p className="text-on-surface-variant font-medium text-sm font-body">
            Live data for {location?.city || "your area"}
          </p>
        </div>

        {activeTab === "aqi" ? (
          /* ════════ AQI TAB ════════ */
          <div className="space-y-10">
            {/* Hero + Seasonal Context row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <HeroCard />
              <div className="lg:col-span-4 flex flex-col gap-6">
                <SeasonalContext />
                <IndoorEstimator />
              </div>
            </div>

            {/* Pollutant Breakdown */}
            <PollutantBars />

            {/* Health Recommendations */}
            <HealthRecommendations />

            {/* Insight Engine */}
            <InsightEngine />

            {/* Popular Cities */}
            <PopularCities />

            {/* Pollution Correlation Chart */}
            <EnvironmentalCorrelation />

            {/* Hourly Forecast */}
            <HourlyCarousel />

            {/* Scale Legend */}
            <AQILegend />
          </div>
        ) : activeTab === "weather" ? (
          /* ════════ WEATHER TAB ════════ */
          <div className="space-y-10">
            {/* Weather Grid */}
            <WeatherGrid />

            {/* Wind Compass + Hourly side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WindCompass />
              <div>
                <HourlyCarousel />
              </div>
            </div>
          </div>
        ) : (
          /* ════════ TOOLS/INSIGHTS TAB ════════ */
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AQISimulator />
              <ActionImpactCalculator />
            </div>

            <CompareCities />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <Watchlist />
              <LearningHub />
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
};

export default Index;
