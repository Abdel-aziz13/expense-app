import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  // Largeurs différentes pour chaque colonne pour plus de réalisme
  const columnWidths = [
    "w-24", // Date
    "w-32", // Catégorie
    "w-48", // Description
    "w-28", // Montant
    "w-32", // Méthode de paiement
    "w-20", // Actions
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Skeleton Header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3 text-left">
                <Skeleton className={`h-4 ${columnWidths[index] || "w-24"}`} />
              </th>
            ))}
          </tr>
        </thead>

        {/* Skeleton Body */}
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                  {colIndex === 1 ? (
                    // Badge skeleton pour la catégorie
                    <Skeleton className="h-6 w-20 rounded-full" />
                  ) : colIndex === 3 ? (
                    // Skeleton pour le montant (plus étroit)
                    <Skeleton className="h-4 w-16" />
                  ) : colIndex === columns - 1 ? (
                    // Skeleton pour les actions (boutons)
                    <div className="flex space-x-1">
                      <Skeleton className="h-6 w-6 rounded" />
                    </div>
                  ) : (
                    // Skeleton standard pour les autres colonnes
                    <Skeleton
                      className={`h-4 ${columnWidths[colIndex] || "w-24"}`}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
