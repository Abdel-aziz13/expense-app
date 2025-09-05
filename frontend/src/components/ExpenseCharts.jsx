import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartIcon, BarChart3 } from "lucide-react";

// Tooltip personnalisé pour le PieChart
const PieTooltip = ({ active, payload, categoryData }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p style={{ color: data.payload.color }}>
          {data.value.toLocaleString()} FCFA (
          {((data.value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip personnalisé pour le BarChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded p-2 text-sm">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} FCFA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Composant principal
const ExpenseCharts = ({ monthlyData = [], categoryData = [] }) => {
  // Trier les données par année puis par mois
  const sortedData = [...monthlyData].sort((a, b) => {
    if (a.year === b.year) return a.month - b.month;
    return a.year - b.year;
  });

  // Prendre les 6 derniers mois
  const lastSixMonthsData = sortedData.slice(-6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Répartition par Catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" /> Répartition par Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<PieTooltip categoryData={categoryData} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>Aucune dépense pour cette période</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Évolution sur les 6 derniers mois */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Évolution (6 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lastSixMonthsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
                <Bar dataKey="revenus" fill="#10b981" name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseCharts;
