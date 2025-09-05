import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PaginationSelection = ({ pageSize, onPageSizeChange }) => {
  const options = [3, 5, 10, 15];

  return (
    <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Rows per page
      </span>

      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((value) => (
            <SelectItem key={value} value={value.toString()}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaginationSelection;
