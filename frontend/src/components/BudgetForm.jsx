import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import apiClient from "@/api/apiClient";

const BudgetForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  // Charger catégories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.categories;
    },
  });

  // Charger stats globales
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await apiClient.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/home`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

  // Charger budgets existants
  const { data: statsBudgets } = useQuery({
    queryKey: ["statsBudgets"],
    queryFn: async () => {
      const res = await apiClient.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/budgets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: user_id || "",
      category_id: "",
      amount: "",
      period: "monthly",
      alert_threshold: 80,
    },
  });

  const amount = watch("amount") ? parseFloat(watch("amount")) : 0;
  const balance = stats
    ? (stats.total_revenus || 0) - (stats.total_depenses || 0)
    : 0;
  const totalBudgets = statsBudgets?.totalBudgets || 0;
  const availableBalance = balance - totalBudgets;
  const remainingAfterBudget = availableBalance - amount;
  const percentUsed =
    availableBalance > 0
      ? Math.min(((amount / availableBalance) * 100).toFixed(2), 100)
      : 0;

  const onSubmit = async (data) => {
    if (amount > availableBalance) {
      toast.error("Montant supérieur au solde disponible ❌");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/budgets`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Budget créé avec succès");
      queryClient.invalidateQueries([
        "budgets",
        "statsBudgets",
        "dashboardStats",
      ]);
      reset();
      navigate("/user/budgets");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du budget");
    }
  };

  if (!stats || !categories || !statsBudgets)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-green-400 dark:text-green-300">
          Chargement...
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
            Nouveau Budget
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300">
            Ajoutez vos budgets pour mieux gérer vos finances
          </p>

          <Card className="w-full mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
            <CardContent className="pt-6">
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Catégorie */}
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-100">
                    Catégorie
                  </Label>
                  <Controller
                    name="category_id"
                    control={control}
                    rules={{ required: "Veuillez choisir une catégorie" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              <div className="flex items-center gap-2">
                                {cat.color && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                )}
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-red-500 text-sm">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>

                {/* Montant */}
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-100">
                    Montant (FCFA)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    {...register("amount", {
                      required: "Le montant est obligatoire",
                    })}
                    className="dark:bg-gray-700 dark:text-gray-100"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">
                      {errors.amount.message}
                    </p>
                  )}

                  {amount > 0 && (
                    <div className="text-sm mt-2 space-y-1 text-gray-800 dark:text-gray-100">
                      <p>
                        Solde disponible avant ce budget :{" "}
                        <b>{availableBalance.toLocaleString()} FCFA</b>
                      </p>
                      <p>
                        Après ce budget :{" "}
                        <b
                          className={
                            remainingAfterBudget < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {remainingAfterBudget.toLocaleString()} FCFA
                        </b>
                      </p>
                      <p>
                        Vous utilisez <b>{percentUsed}%</b> du solde disponible.
                      </p>
                      {remainingAfterBudget < 0 && (
                        <p className="text-red-600 font-semibold">
                          Attention : Ce budget dépasse votre solde disponible !
                        </p>
                      )}
                      {percentUsed >= 80 && percentUsed < 100 && (
                        <p className="text-orange-600 font-semibold">
                          Alerte : Vous avez utilisé plus de 80% de votre solde.
                          Surveillez vos dépenses.
                        </p>
                      )}
                      {percentUsed === 100 && (
                        <p className="text-red-600 font-semibold">
                          Vous avez atteint la limite de votre solde disponible.
                        </p>
                      )}
                      {amount < 1000 && (
                        <p className="text-gray-500">
                          Conseil : Pensez à regrouper vos petites dépenses pour
                          mieux suivre votre budget.
                        </p>
                      )}
                      {amount > 100000 && (
                        <p className="text-blue-600 font-semibold">
                          Info : Ce budget est élevé. Vérifiez qu’il correspond
                          bien à vos besoins.
                        </p>
                      )}
                      {percentUsed < 50 && (
                        <p className="text-green-600">
                          Votre budget est bien maîtrisé pour ce mois.
                        </p>
                      )}
                      {/* Message spécifique Cameroun */}
                      <p className="text-gray-600">
                        Astuce : Pour les paiements mobiles (Orange Money, MTN
                        Mobile Money), vérifiez vos frais de transaction.
                      </p>
                    </div>
                  )}
                </div>

                {/* Période */}
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-100">
                    Période
                  </Label>
                  <Controller
                    name="period"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Seuil d'alerte */}
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-100">
                    Seuil d&apos;alerte (%)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    {...register("alert_threshold", {
                      required: "Le seuil est obligatoire",
                    })}
                    className="dark:bg-gray-700 dark:text-gray-100"
                  />
                  {errors.alert_threshold && (
                    <p className="text-red-500 text-sm">
                      {errors.alert_threshold.message}
                    </p>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex flex-col md:flex-row gap-2 col-span-full mt-4">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                  >
                    Créer le Budget
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/user/budgets")}
                    className="w-full md:w-auto"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
