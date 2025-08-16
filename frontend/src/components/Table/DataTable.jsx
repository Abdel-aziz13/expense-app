// DataTable.jsx
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import ActionDropdown from "./ActionDropdown";
import PaginationSelection from "./PaginationSelection";
import PaginationArea from "./PaginationArea";

// petit helper pour mocker des données
const makeData = (n = 57) => {
  const names = [
    "Alice Dupont",
    "Jean Mbarga",
    "Marie Ndi",
    "Paul Ngu",
    "Sophie Ken",
    "Marc T.",
    "Linda K.",
    "Eric O.",
  ];
  const roles = ["admin", "user"];
  return new Array(n).fill(0).map((_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    balance: Math.round(Math.random() * 200000),
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
  }));
};

export default function DataTable() {
  const [data, setData] = useState(() => makeData(57));
  const [sorting, setSorting] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue(),
        size: 40,
      },
      {
        accessorKey: "name",
        header: "Nom",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "balance",
        header: "Solde",
        cell: (info) =>
          new Intl.NumberFormat("fr-CM", { minimumFractionDigits: 0 }).format(
            info.getValue()
          ) + " FCFA",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionDropdown
            row={row}
            onCopy={() => handleCopy(row)}
            onDelete={() => handleDelete(row)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  });

  // actions
  const handleCopy = (row) => {
    const text = JSON.stringify(row.original, null, 2);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // tu peux utiliser toast ici
        console.log("Copié dans le presse-papiers :", row.original);
      })
      .catch(() => console.warn("Impossible de copier"));
  };

  const handleDelete = (row) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    setData((prev) => prev.filter((r) => r.id !== row.original.id));
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sort = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          canSort ? "cursor-pointer select-none" : ""
                        }`}
                        onClick={() =>
                          canSort ? header.column.toggleSorting() : null
                        }
                        role={canSort ? "button" : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <span className="text-xs text-gray-500">
                            {sort === "asc" ? "▲" : sort === "desc" ? "▼" : "↕"}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-gray-700 align-middle"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <PaginationSelection table={table} />
        <PaginationArea table={table} />
      </div>
    </div>
  );
}
