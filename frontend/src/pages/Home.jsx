import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";

// Fonction pour formater les montants en FCFA
const formatCurrency = (value) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const Home = () => {
  const token = localStorage.getItem("token");

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/home`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onError: (err) => console.error("Erreur chargement dashboard :", err),
  });

  if (isLoading) {
    return (
      <div className="text-center py-10">Chargement du tableau de bord...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Erreur lors du chargement du tableau de bord
      </div>
    );
  }

  const isPositiveBalance =
    (stats.total_revenus || 0) - (stats.total_depenses || 0) >= 0;
  const balance = (stats.total_revenus || 0) - (stats.total_depenses || 0);

  return (
    <div className="space-y-6 pt-[24px]">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Tableau de Bord
        </h2>
        <p className="text-lg text-muted-foreground">
          Vue d&apos;ensemble de vos finances personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dépenses */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Dépenses ce mois
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(stats.total_depenses)}
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Revenus ce mois
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(stats.total_revenus)}
            </div>
          </CardContent>
        </Card>

        {/* Solde */}
        <Card
          className={`bg-gradient-to-br ${
            isPositiveBalance
              ? "from-blue-50 to-blue-100 border-blue-200"
              : "from-orange-50 to-orange-100 border-orange-200"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                isPositiveBalance ? "text-blue-800" : "text-orange-800"
              }`}
            >
              Solde
            </CardTitle>
            <Wallet
              className={`h-4 w-4 ${
                isPositiveBalance ? "text-blue-600" : "text-orange-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isPositiveBalance ? "text-blue-900" : "text-orange-900"
              }`}
            >
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Transactions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats.total_transactions}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
