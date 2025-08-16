import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingDown, Wallet, CheckCircle } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AjouterDepense = () => {
  const [type, setType] = useState("depense");
  const [categories, setCategories] = useState({ depense: [], revenu: [] });
  const [backendErrors, setBackendErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.category; // On retourne directement le tableau de catégories
    },
    staleTime: 5 * 60 * 1000, // 5 minutes de cache
    onError: () => console.log("Erreur lors du chargement des catégories"),
  });

  const categoriesToShow = categoriesData
    ? categoriesData.filter((c) => c.type === type)
    : [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (payload) =>
      axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/transaction`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    onError: (error) => {
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error("Erreur serveur, veuillez réessayer.");
      }
    },
    onSuccess: (response) => {
      reset();
      setBackendErrors({});
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(response.data.status_message);
    },
  });

  const onSubmit = (data) => {
    const payload = {
      category_id: Number(data.category_id),
      amount: data.amount,
      spent_at: data.spent_at,
      payment_method: data.payment_method,
      note: data.note,
    };
    mutation.mutate(payload);
  };

  const getSubmitButtonText = () => {
    if (mutation.isLoading) return "Sauvegarde...";
    if (mutation.isSuccess) return "Ajouté avec succès !";
    return `Ajouter ${type === "depense" ? "la dépense" : "le revenu"}`;
  };

  const getSubmitButtonVariant = () => {
    if (mutation.isSuccess) return "success";
    if (mutation.isError) return "destructive";
    return "default";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-green-600">
            Nouvelle Transaction
          </h2>
          <p className="text-lg text-muted-foreground">
            Ajoutez vos dépenses et revenus
          </p>
          <div className="flex justify-center items-center p-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                  <Plus className="h-5 w-5" />
                  Nouvelle Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={type}
                  onValueChange={(val) => {
                    setType(val);
                    reset();
                    setSubmitStatus("idle");
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="depense"
                      className="flex items-center gap-2"
                    >
                      <TrendingDown className="h-4 w-4" />
                      Dépense
                    </TabsTrigger>
                    <TabsTrigger
                      value="revenu"
                      className="flex items-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      Revenu
                    </TabsTrigger>
                  </TabsList>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 mt-6"
                  >
                    {/* Montant & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Montant (FCFA) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          {...register("amount", {
                            required: "Le montant est requis",
                            min: {
                              value: 0.01,
                              message: "Le montant doit être positif",
                            },
                          })}
                          placeholder="0"
                          className="w-full"
                        />

                        {(errors.amount && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.amount.message}
                          </p>
                        )) ||
                          (backendErrors.amount && (
                            <p className="text-sm text-red-500 mt-1">
                              {backendErrors.amount[0]}
                            </p>
                          ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spent_at">Date *</Label>
                        <Input
                          id="spent_at"
                          type="date"
                          {...register("spent_at", {
                            required: "La date est obligatoire",
                          })}
                          defaultValue={new Date().toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full"
                        />
                        {(errors.spent_at && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.spent_at.message}
                          </p>
                        )) ||
                          (backendErrors.spent_at && (
                            <p className="text-sm text-red-500 mt-1">
                              {backendErrors.spent_at[0]}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* Catégorie & Mode de paiement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Catégorie */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select
                          value={watch("category_id") || ""}
                          onValueChange={(val) =>
                            setValue("category_id", val, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriesToShow.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  {cat.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {(errors.category_id && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.category_id.message}
                          </p>
                        )) ||
                          (backendErrors.category_id && (
                            <p className="text-sm text-red-500 mt-1">
                              {backendErrors.category_id[0]}
                            </p>
                          ))}
                      </div>

                      {/* Mode de paiement */}
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">
                          {type === "depense"
                            ? "Mode de paiement *"
                            : "Source de fond *"}
                        </Label>
                        <Select
                          value={watch("payment_method") || ""}
                          onValueChange={(val) =>
                            setValue("payment_method", val, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                type === "depense"
                                  ? "Sélectionner un mode de paiement"
                                  : "Sélectionner une source de fond"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(type === "depense"
                              ? [
                                  "Espèces",
                                  "Carte bancaire",
                                  "Mobile Money",
                                  "Chèque",
                                ]
                              : [
                                  "Salaire",
                                  "Investissement",
                                  "Prêt",
                                  "Autres sources",
                                ]
                            ).map((option) => (
                              <SelectItem key={option} value={option}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" />
                                  {option}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {(errors.payment_method && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.payment_method.message}
                          </p>
                        )) ||
                          (backendErrors.payment_method && (
                            <p className="text-sm text-red-500 mt-1">
                              {backendErrors.payment_method[0]}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="note">Description *</Label>
                      <Textarea
                        id="note"
                        {...register("note")}
                        placeholder="Description de la transaction..."
                        rows={3}
                      />
                    </div>

                    {/* Bouton */}
                    <Button
                      type="submit"
                      className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200"
                      disabled={mutation.isLoading || mutation.isSuccess}
                      variant={getSubmitButtonVariant()}
                    >
                      {mutation.isSuccess && (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {getSubmitButtonText()}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterDepense;
