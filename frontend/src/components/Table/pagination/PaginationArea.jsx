import React from "react";
import PaginationSelection from "./PaginationSelection";
import { Button } from "@/components/ui/button";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const PaginationArea = ({ table }) => {
  return (
    <div className="w-full border-t bg-white px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Sélection du nombre d'éléments par page */}
      <PaginationSelection
        pageSize={table.getState().pagination.pageSize}
        onPageSizeChange={table.setPageSize}
      />

      {/* Navigation */}
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
        <span className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <BiFirstPage className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <GrFormPrevious className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <GrFormNext className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <BiLastPage className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationArea;
