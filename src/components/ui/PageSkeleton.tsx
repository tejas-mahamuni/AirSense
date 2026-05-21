import React from 'react';
import AppLayout from '../layout/AppLayout';

const PageSkeleton: React.FC = () => {
  return (
    <AppLayout>
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto font-body">
        {/* Toggle skeleton */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-64 bg-surface-container-highest rounded-full animate-pulse" />
        </div>

        {/* Header skeleton */}
        <div className="mb-10 space-y-4">
          <div className="h-10 w-48 bg-surface-container-highest rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-surface-container rounded-lg animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="h-[400px] w-full bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 animate-pulse" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="h-[180px] w-full bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 animate-pulse" />
              <div className="h-[180px] w-full bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PageSkeleton;
