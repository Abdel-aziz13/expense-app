import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Tag,
  FileText,
  Coins,
  ArrowUpDown,
  DownloadIcon,
} from "lucide-react";

import PaginationArea from "../components/Table/pagination/PaginationArea";
import Traduction from "@/lib/Traduction";
import { useLanguage } from "@/context/LanguageContext";
import apiClient from "@/api/apiClient";
import ActionDropdown from "../components/Table/Dropdown/ActionDropdown";

const Historique = () => {
  const { lang } = useLanguage();
  const t = Traduction[lang];

  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Fetch transactions
  const {
    data: transactions = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await apiClient.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/transaction`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.transactions;
    },
    onError: (err) => console.error(err),
  });

  // 🔹 Comptage pour onglets
  const tableItems = useMemo(() => {
    const countAll = transactions.length;
    const countDepense = transactions.filter(
      (d) => (d.category?.type || "").toLowerCase() === "depense"
    ).length;
    const countRevenu = transactions.filter(
      (d) => (d.category?.type || "").toLowerCase() === "revenu"
    ).length;

    return [
      { label: t.all || "Toutes", value: "all", count: countAll },
      { label: t.expense || "Dépenses", value: "depense", count: countDepense },
      { label: t.income || "Revenus", value: "revenu", count: countRevenu },
    ];
  }, [transactions, t]);

  const columnHelper = createColumnHelper();

  // 🔹 Colonnes du tableau
  const columns = [
    columnHelper.accessor("spent_at", {
      header: () => (
        <span className="flex items-center">
          <Calendar className="mr-2" size={16} /> {t.date}
        </span>
      ),
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue()).toLocaleDateString(
              lang === "fr" ? "fr-FR" : "en-US"
            )
          : "",
    }),
    columnHelper.accessor(
      (row) => row.category?.name || t.undefined || "Non défini",
      {
        id: "categorie",
        header: () => (
          <span className="flex items-center">
            <Tag className="mr-2" size={16} /> {t.category}
          </span>
        ),
        cell: (info) => {
          const cat = info.row.original.category;
          if (!cat?.name)
            return (
              <Badge variant="secondary">{t.undefined || "Non défini"}</Badge>
            );
          return (
            <Badge
              variant={
                cat.type?.toLowerCase() === "depense"
                  ? "destructive"
                  : "default"
              }
            >
              {cat.name}
            </Badge>
          );
        },
      }
    ),
    columnHelper.accessor("note", {
      header: () => (
        <span className="flex items-center">
          <FileText className="mr-2" size={16} /> {t.description}
        </span>
      ),
      cell: (info) =>
        info.getValue() ? (
          <span className="font-medium">{info.getValue()}</span>
        ) : (
          <span className="text-sm text-muted-foreground italic">
            {t.no_note || "Aucune note"}
          </span>
        ),
    }),
    columnHelper.accessor("amount", {
      header: () => (
        <span className="flex items-center">
          <Coins className="mr-2" size={16} /> {t.amount} (FCFA)
        </span>
      ),
      cell: (info) => {
        const value = Number(info.getValue());
        const type = info.row.original.category?.type?.toLowerCase();
        const formatted = new Intl.NumberFormat(
          lang === "fr" ? "fr-CM" : "en-US",
          { minimumFractionDigits: 0 }
        ).format(value);
        if (type === "depense")
          return <span className="text-red-600 font-bold">- {formatted}</span>;
        if (type === "revenu")
          return (
            <span className="text-green-600 font-bold">+ {formatted}</span>
          );
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor("payment_method", {
      header: () => (
        <span className="flex items-center">
          <FileText className="mr-2" size={16} /> {t.payment_method}
        </span>
      ),
      cell: (info) =>
        info.getValue() ? (
          <span className="font-medium">{info.getValue()}</span>
        ) : (
          <span className="text-sm text-muted-foreground italic">
            {t.payment_methods || "Aucune"}
          </span>
        ),
    }),
    {
      id: "actions",
      header: t.actions || "Actions",
      cell: ({ row }) => <ActionDropdown row={row.original} />,
    },
  ];

  // 🔹 Filtrage
  const filteredData = useMemo(() => {
    let filtered = transactions;
    if (activeTab !== "all")
      filtered = filtered.filter(
        (d) => (d.category?.type || "").toLowerCase() === activeTab
      );
    if (globalFilter) {
      const lower = globalFilter.toLowerCase();
      filtered = filtered.filter((d) => {
        const dateStr = d.spent_at
          ? new Date(d.spent_at).toLocaleDateString(
              lang === "fr" ? "fr-FR" : "en-US"
            )
          : "";
        const categoryName = d.category?.name?.toLowerCase() || "";
        const categoryType = d.category?.type?.toLowerCase() || "";
        const note = d.note?.toLowerCase() || "";
        const amount = d.amount?.toString() || "";
        return [dateStr, categoryName, categoryType, note, amount].some(
          (field) => field.includes(lower)
        );
      });
    }
    return filtered;
  }, [transactions, activeTab, globalFilter, lang]);

  // 🔹 Table React Table
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
    initialState: { pagination: { pageSize: 3 } },
  });

  // 🔹 Export CSV
  const exportToCSV = (data) => {
    if (!data.length) return;
    const headers = [
      t.date,
      t.expense_income || "Type",
      t.description,
      t.amount,
    ];
    const rows = data.map((tr) => [
      tr.spent_at
        ? new Date(tr.spent_at).toLocaleDateString(
            lang === "fr" ? "fr-FR" : "en-US"
          )
        : "",
      tr.category?.type?.toLowerCase() === "depense"
        ? t.expense || "Dépense"
        : t.income || "Revenu",
      tr.note || "",
      tr.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600 font-medium">{t.error_loading}</p>
      </div>
    );

  // 🔹 Nouveau écran de chargement
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Initialisation de l&apos;application...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Chargement des données utilisateur
          </p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t.transaction_history}
        </h2>
        <p className="text-lg text-muted-foreground">{t.transaction_manage}</p>
      </div>

      <Card className="m-6 shadow-none">
        <div className="p-4 md:p-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6 w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              {/* Onglets */}
              <TabsList className="flex flex-row flex-wrap gap-2">
                {tableItems.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={`flex items-center gap-2 h-8 rounded-md transition-all ${
                      activeTab === item.value
                        ? "bg-primary text-black"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                        activeTab === item.value
                          ? "bg-white text-black"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Recherche + Export */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={t.search || "Recherche..."}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <Button
                  className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                  size="sm"
                  onClick={() => exportToCSV(filteredData)}
                >
                  <DownloadIcon className="w-4 h-4" />{" "}
                  <span>{t.download_csv}</span>
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
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
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-3 text-center text-gray-500"
                      >
                        {t.no_results || "Aucun résultat"}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
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
            </div>

            <PaginationArea table={table} />
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Historique;
