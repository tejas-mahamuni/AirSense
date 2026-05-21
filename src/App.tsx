import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import React, { Suspense, lazy, useEffect } from "react";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";

const Index = lazy(() => import("./pages/Index.tsx"));
const Maps = lazy(() => import("./pages/Maps.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    try {
      const storeStr = localStorage.getItem("airsense_store");
      if (storeStr) {
        const store = JSON.parse(storeStr);
        let changed = false;
        
        if (store && store.state) {
          // 1. Clean active location if it points to Ahilyanagar or has invalid coordinates
          if (store.state.location) {
            const locName = String(store.state.location.city || '').toLowerCase();
            const lat = Number(store.state.location.lat);
            const lng = Number(store.state.location.lng);
            
            if (locName.includes("ahilya") || (lat === 0 && lng === 0)) {
              store.state.location = {
                city: "Ahmednagar",
                lat: 19.0948,
                lng: 74.7480
              };
              changed = true;
            }
          }
          
          // 2. Clean searchHistory
          if (Array.isArray(store.state.searchHistory)) {
            const originalLength = store.state.searchHistory.length;
            store.state.searchHistory = store.state.searchHistory.filter(
              (c: string) => !/ahilya/i.test(c)
            );
            if (store.state.searchHistory.length !== originalLength) {
              changed = true;
            }
          }
          
          // 3. Clean watchlist
          if (Array.isArray(store.state.watchlist)) {
            const originalLength = store.state.watchlist.length;
            store.state.watchlist = store.state.watchlist.filter(
              (c: string) => !/ahilya/i.test(c)
            );
            if (store.state.watchlist.length !== originalLength) {
              changed = true;
            }
          }
        }
        
        if (changed) {
          localStorage.setItem("airsense_store", JSON.stringify(store));
          window.location.reload();
        }
      }
    } catch (e) {
      console.error("Store migration error:", e);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
