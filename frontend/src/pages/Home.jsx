import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import ExpenseCharts from "@/components/expenseCharts";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import apiClient from "@/api/apiClient";

// 📌 Format en FCFA
const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(value || 0);

// 📌 Fonction pour calculer la tendance en %
const calculerTendance = (actuel, precedent) => {
  if (!precedent || precedent === 0) return 0;
  return ((actuel - precedent) / precedent) * 100;
};

// 📌 Mois disponibles
const months = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Fév" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Avr" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aoû" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Déc" },
];

const Home = () => {
  const token = localStorage.getItem("token");
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 📌 Requête API
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats", selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/home`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: selectedMonth, year: selectedYear },
        }
      );
      return res.data;
    },
    onError: (err) => console.error("Erreur chargement dashboard :", err),
  });

  // 📌 Handlers filtres
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  // 📌 Label du mois sélectionné
  const monthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "Mois";

  // 📌 Loading & erreurs
  // if (isLoading) return <DashboardSkeleton />;
  // if (error)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
  //       Erreur lors du chargement du tableau de bord
  //     </div>
  //   );

  // Remplacer uniquement la partie loading/error
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">
            Chargement du tableau de bord...
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
            Récupération des données utilisateur
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400 text-lg">
          Erreur lors du chargement du tableau de bord
        </p>
      </div>
    );

  // 📌 Calculs
  const balance = (stats?.total_revenus || 0) - (stats?.total_depenses || 0);
  const isPositiveBalance = balance >= 0;
  const tendanceRevenus = calculerTendance(
    stats?.total_revenus,
    stats?.revenusPrecedent
  );
  const tendanceDepenses = calculerTendance(
    stats?.total_depenses,
    stats?.depensesPrecedent
  );

  return (
    <div className="space-y-6 pt-6 px-4 md:px-8 lg:px-16 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Titre */}
        <div className="md:text-left text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Tableau de Bord
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Vue d&apos;ensemble de vos finances personnelles
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-8 py-5 flex flex-col sm:flex-row gap-6 items-end border dark:border-gray-700">
          {/* Mois */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Mois
            </label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Année */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Année
            </label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
            >
              {Array.from({ length: currentYear - 2019 + 1 }, (_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dépenses */}
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:scale-105 transform transition">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
              Dépenses en {monthLabel} {selectedYear}
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-300">
              {formatCurrency(stats.total_depenses)}
            </div>
            {/* <p
              className={`text-sm mt-1 ${
                tendanceDepenses < 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {tendanceDepenses.toFixed(2)}% vs mois dernier
            </p> */}
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:scale-105 transform transition">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Revenus de {monthLabel} {selectedYear}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(stats.total_revenus)}
            </div>
            {/* <p
              className={`text-sm mt-1 ${
                tendanceRevenus < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {tendanceRevenus.toFixed(2)}% vs mois dernier
            </p> */}
          </CardContent>
        </Card>

        {/* Solde */}
        <Card
          className={`hover:scale-105 transform transition border ${
            isPositiveBalance
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
              : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
          }`}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                isPositiveBalance
                  ? "text-blue-800 dark:text-blue-200"
                  : "text-orange-800 dark:text-orange-200"
              }`}
            >
              Solde de {monthLabel} {selectedYear}
            </CardTitle>
            <Wallet
              className={`h-5 w-5 ${
                isPositiveBalance
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isPositiveBalance
                  ? "text-blue-900 dark:text-blue-300"
                  : "text-orange-900 dark:text-orange-300"
              }`}
            >
              {formatCurrency(balance)}
            </div>
            {/* <p
              className={`text-sm mt-1 ${
                isPositiveBalance
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {isPositiveBalance ? "Situation saine" : "Attention au budget"}
            </p> */}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:scale-105 transform transition">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Transactions de {monthLabel} {selectedYear}
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {stats.total_transactions}
            </div>
            {/* <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              {stats.transactions_semaine
                ? `+${stats.transactions_semaine} cette semaine`
                : "+0 cette semaine"}
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="mt-6">
        <ExpenseCharts
          monthlyData={stats.financeData}
          categoryData={stats.categoryData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};

export default Home;
