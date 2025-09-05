import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const StatCardSkeleton = () => {
  return (
    <Card className="hover:scale-105 transform transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-1" />
      </CardContent>
    </Card>
  );
};

export default StatCardSkeleton;
