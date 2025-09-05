import React from "react";
import { Skeleton } from "./ui/skeleton";
import StatCardSkeleton from "./StatCardSkeleton";
import ChartSkeleton from "./ChartSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 pt-6 px-4 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Header Skeleton */}
        <div className="md:text-left text-center">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        {/* Filtres Skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-8 py-5 flex flex-col sm:flex-row gap-6 items-end border dark:border-gray-700">
          <div className="flex flex-col space-y-2 w-full sm:w-auto">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="flex flex-col space-y-2 w-full sm:w-auto">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Charts Skeleton */}
      <ChartSkeleton />
    </div>
  );
};

export default DashboardSkeleton;
