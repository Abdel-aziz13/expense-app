import React, { useState, useMemo } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaginationArea from "../components/Table/pagination/PaginationArea";
import {
  Search,
  Calendar,
  Tag,
  FileText,
  Coins,
  User,
  ArrowUpDown,
  DownloadIcon,
} from "lucide-react";
import ActionDropdown from "../components/Table/Dropdown/ActionDropdown";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

const Historique = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  // React Query pour recuperer les transactions
  const {
    data: transactions = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/transaction`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.transactions;
    },
    onError: (err) => console.error("Erreur chargement transactions :", err),
  });

  // Comptage des transactions pour chaque onglet
  const tableItems = useMemo(() => {
    const countAll = transactions.length;
    const countDepense = transactions.filter(
      (d) => (d.category?.type || "").toLowerCase().trim() === "depense"
    ).length;
    const countRevenu = transactions.filter(
      (d) => (d.category?.type || "").toLowerCase().trim() === "revenu"
    ).length;

    return [
      { label: "Toutes", value: "all", count: countAll },
      { label: "Dépenses", value: "depense", count: countDepense },
      { label: "Revenus", value: "revenu", count: countRevenu },
    ];
  }, [transactions]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("id", {
      header: () => (
        <span className="flex items-center">
          <User className="mr-2" size={16} /> ID
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("spent_at", {
      header: () => (
        <span className="flex items-center">
          <Calendar className="mr-2" size={16} /> Date
        </span>
      ),
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue()).toLocaleDateString("fr-FR")
          : "",
    }),
    columnHelper.accessor((row) => row.category?.type || "", {
      id: "type",
      header: () => (
        <span className="flex items-center">
          <Tag className="mr-2" size={16} /> Type
        </span>
      ),
      cell: (info) =>
        info.getValue()?.toLowerCase() === "depense" ? "Dépense" : "Revenu",
    }),
    columnHelper.accessor("note", {
      header: () => (
        <span className="flex items-center">
          <FileText className="mr-2" size={16} /> Description
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: () => (
        <span className="flex items-center">
          <Coins className="mr-2" size={16} /> Montant (FCFA)
        </span>
      ),
      cell: (info) =>
        new Intl.NumberFormat("fr-CM", { minimumFractionDigits: 0 }).format(
          info.getValue()
        ),
    }),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionDropdown row={row.original} />,
    },
  ];

  // Filtrage selon onglet actif et recherche globale
  const filteredData = useMemo(() => {
    let filtered = transactions;

    if (activeTab !== "all") {
      filtered = filtered.filter(
        (d) => (d.category?.type || "").toLowerCase().trim() === activeTab
      );
    }

    if (globalFilter) {
      const lower = globalFilter.toLowerCase();
      filtered = filtered.filter((d) => {
        const note = d.note?.toLowerCase() || "";
        const dateStr = d.spent_at
          ? new Date(d.spent_at).toLocaleDateString("fr-FR")
          : "";
        const type = d.category?.type?.toLowerCase() || "";

        return (
          note.includes(lower) ||
          dateStr.includes(lower) ||
          type.includes(lower)
        );
      });
    }

    return filtered;
  }, [transactions, activeTab, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  // Fonction utilitaire pour exporter en CSV
  const exportToCSV = (transactions) => {
    if (!transactions || transactions.length === 0) return;

    const headers = ["Date", "Type", "Description", "Montant"];
    const rows = transactions.map((t) => [
      // t.id,
      t.spent_at ? new Date(t.spent_at).toLocaleDateString("fr-FR") : "",
      t.category?.type?.toLowerCase() === "depense" ? "Dépense" : "Revenu",
      t.note || "",
      t.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    const filteredTransactions =
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter);
    exportToCSV(filteredTransactions);
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-lg font-medium">
          Chargement des transactions...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-lg text-red-600 font-medium">
          Erreur lors du chargement des transactions
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Historique des Transactions
        </h2>
        <p className="text-lg text-muted-foreground">
          Consultez et gérez toutes vos transactions
        </p>
      </div>

      <Card className="m-6 shadow-none">
        <div className="p-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6 w-full"
          >
            <div className="flex items-center justify-between mb-4 max-md:flex-col max-lg:gap-2 max-sm:items-start">
              <TabsList className="h-10 max-sm:flex max-sm:flex-col max-sm:h-[132px] max-sm:w-full">
                {tableItems.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={`flex items-center gap-2 h-8 rounded-md transition-all ${
                      activeTab === item.value
                        ? "bg-primary text-red max-sm:w-full"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                        activeTab === item.value
                          ? "bg-white text-primary"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mb-4 flex items-center gap-4 max-sm:flex-col max-sm:gap-2">
                <div className="relative w-64 max-sm:w-full flex-1">
                  <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Recherche..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>

                {/* <Button
                  className="flex items-center gap-2 max-lg:gap-2 max-sm:w-full bg-green-600 text-white
                 hover:bg-green-700"
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download as CSV</span>
                </Button> */}
                <Button
                  className="flex items-center gap-2 max-lg:gap-2 max-sm:w-full bg-green-600 text-white hover:bg-green-700"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const filteredTransactions =
                      activeTab === "all"
                        ? transactions
                        : transactions.filter(
                            (t) =>
                              (t.category?.type || "").toLowerCase().trim() ===
                              activeTab
                          );
                    exportToCSV(filteredTransactions); // Assure-toi d'avoir une fonction exportToCSV
                  }}
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download as CSV</span>
                </Button>
              </div>
            </div>

            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        scope="col"
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="ml-1" size={14} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="p-3 text-center text-gray-500"
                    >
                      Aucun résultat
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <PaginationArea table={table} />
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Historique;
