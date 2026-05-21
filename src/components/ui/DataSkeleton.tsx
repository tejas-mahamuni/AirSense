import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm h-full w-full">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-surface-container rounded-full animate-pulse" />
      <div className="w-16 h-6 bg-surface-container rounded-full animate-pulse" />
    </div>
    <div className="space-y-3">
      <div className="w-1/2 h-8 bg-surface-container-highest rounded-lg animate-pulse" />
      <div className="w-3/4 h-4 bg-surface-container rounded-lg animate-pulse" />
      <div className="w-full h-4 bg-surface-container rounded-lg animate-pulse" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm w-full">
    <div className="w-1/3 h-6 bg-surface-container-highest rounded-lg animate-pulse mb-6" />
    <div className="h-48 w-full bg-surface-container rounded-xl animate-pulse" />
  </div>
);

export const MetricSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest rounded-[1.5rem] p-4 border border-outline-variant/10 shadow-sm">
    <div className="w-8 h-8 bg-surface-container rounded-full animate-pulse mb-3" />
    <div className="w-1/2 h-3 bg-surface-container rounded-sm animate-pulse mb-1" />
    <div className="w-2/3 h-6 bg-surface-container-highest rounded-md animate-pulse" />
  </div>
);
