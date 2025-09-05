import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { Target, Trash2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "@/api/apiClient";

export default function Budgets() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      if (!token) throw new Error("Token manquant");
      const res = await apiClient.get("/user/budgets");
      return res.data;
    },
  });

  const budgets = data?.budgets || [];

  const deleteBudget = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/user/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["budgets"]);
      toast.success("Budget supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const calculateBudgetUsage = (budget) => {
    const amount = Number(budget.amount) || 0;
    const spent = Number(budget.spent) || 0;
    const percentage = amount > 0 ? (spent / amount) * 100 : 0;
    return {
      spent,
      amount,
      percentage,
      isOverBudget: spent > amount,
      isNearLimit: percentage >= 80 && spent <= amount,
    };
  };

  const getBudgetColor = (percentage, isOverBudget) =>
    isOverBudget ? "bg-red-500" : "bg-green-500";

  // 🔹 Loader centralisé
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">
            Initialisation de l&apos;application...
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
            Chargement des données utilisateur
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 dark:text-red-400">
        Erreur lors du chargement des budgets
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
            Gestion des Budgets
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300">
            Définissez et suivez vos objectifs financiers
          </p>
        </div>

        <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Target className="h-5 w-5" />
                Gestion des Budgets
              </CardTitle>
              <Link to="/user/budgets/ajouter">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Ajouter un budget
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 w-full">
            {budgets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun budget configuré</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {budgets.map((budget) => {
                  const usage = calculateBudgetUsage(budget);
                  const categoryName =
                    budget.category?.name || "Sans catégorie";

                  return (
                    <div key={budget.id} className="space-y-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: budget.color || "#6b7280",
                            }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-100">
                              {categoryName}
                            </h4>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              {budget.period === "monthly"
                                ? "Mensuel"
                                : "Hebdomadaire"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto justify-between">
                          <div className="text-right">
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {usage.spent.toFixed(0)} FCFA /{" "}
                              {usage.amount.toFixed(0)} FCFA
                            </p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              {usage.percentage.toFixed(1)}% utilisé
                            </p>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Supprimer ce budget ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le budget{" "}
                                  <span className="font-medium">
                                    {categoryName}
                                  </span>{" "}
                                  sera définitivement supprimé.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBudget.mutate(budget.id)}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <Progress
                        value={Math.min(usage.percentage, 100)}
                        className={`h-2 ${getBudgetColor(
                          usage.percentage,
                          usage.isOverBudget
                        )}`}
                      />

                      {usage.isOverBudget && (
                        <Alert className="border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900">
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <AlertDescription className="text-red-800 dark:text-red-300">
                            Budget dépassé ! Vous avez dépensé{" "}
                            {(usage.spent - usage.amount).toFixed(0)} FCFA de
                            plus que prévu.
                          </AlertDescription>
                        </Alert>
                      )}

                      {usage.isNearLimit && !usage.isOverBudget && (
                        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900">
                          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <AlertDescription className="text-orange-800 dark:text-orange-300">
                            Attention ! Vous approchez de votre limite de budget
                            ({usage.percentage.toFixed(2)}% utilisé).
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
