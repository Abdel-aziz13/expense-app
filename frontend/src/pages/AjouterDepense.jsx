// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, TrendingDown, Wallet, CheckCircle } from "lucide-react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Traduction from "@/lib/Traduction";
// import { useLanguage } from "@/context/LanguageContext";
// import apiClient from "@/api/apiClient";
// import { AlertDescription } from "@/components/ui/alert";

// const AjouterDepense = () => {
//   const [type, setType] = useState("depense"); // "depense" ou "revenu"
//   const token = localStorage.getItem("token");
//   const queryClient = useQueryClient();
//   const { lang } = useLanguage();

//   // react-hook-form
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       amount: "",
//       spent_at: new Date().toISOString().split("T")[0],
//       category_id: "",
//       payment_method: "",
//       note: "",
//     },
//   });

//   // Récupération des catégories
//   const { data: categoriesData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await apiClient.get(
//         `${import.meta.env.VITE_BACKEND_URL}/user/category`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data.category;
//     },
//   });

//   const categoriesToShow = categoriesData
//     ? categoriesData.filter((c) => c.type === type)
//     : [];

//   // Mutation pour ajouter transaction
//   const mutation = useMutation({
//     mutationFn: (payload) =>
//       apiClient.post(
//         `${import.meta.env.VITE_BACKEND_URL}/user/transaction`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       ),
//     onError: (error) => {
//       if (error.response?.status === 422) {
//         toast.error(Traduction[lang].form_error);
//       } else {
//         toast.error(Traduction[lang].server_error);
//       }
//     },
//     onSuccess: (response) => {
//       reset({
//         amount: "",
//         spent_at: new Date().toISOString().split("T")[0],
//         category_id: "",
//         payment_method: "",
//         note: "",
//       });
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       toast.success(response.data.status_message);
//     },
//   });

//   const onSubmit = (data) => {
//     mutation.mutate({
//       category_id: Number(data.category_id),
//       amount: data.amount,
//       spent_at: data.spent_at,
//       payment_method: data.payment_method,
//       note: data.note,
//     });
//   };

//   // Texte du bouton
//   const getSubmitButtonText = () => {
//     if (mutation.isLoading) return Traduction[lang].saving;
//     if (mutation.isSuccess) return Traduction[lang].success;
//     return type === "depense"
//       ? Traduction[lang].add_expense
//       : Traduction[lang].add_income;
//   };

//   const paymentOptions =
//     type === "depense"
//       ? Traduction[lang].payment_methods
//       : Traduction[lang].income_sources;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-2xl mx-auto space-y-6">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
//             {Traduction[lang].new_transaction}
//           </h2>
//           <p className="text-lg text-muted-foreground dark:text-gray-300">
//             {Traduction[lang].add_transactions}
//           </p>
//         </div>

//         <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-2xl font-semibold dark:text-gray-100">
//               <Plus className="h-5 w-5" /> {Traduction[lang].new_transaction}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Tabs
//               key={type}
//               value={type}
//               onValueChange={(val) => {
//                 setType(val);
//                 reset({
//                   amount: "",
//                   spent_at: new Date().toISOString().split("T")[0],
//                   category_id: "",
//                   payment_method: "",
//                   note: "",
//                 });
//               }}
//             >
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger
//                   value="depense"
//                   className="flex items-center gap-2"
//                 >
//                   <TrendingDown className="h-4 w-4" />
//                   {Traduction[lang].expense}
//                 </TabsTrigger>
//                 <TabsTrigger value="revenu" className="flex items-center gap-2">
//                   <Wallet className="h-4 w-4" /> {Traduction[lang].income}
//                 </TabsTrigger>
//               </TabsList>

//               {/* ✅ Message succès inline */}
//               {mutation.isSuccess && (
//                 <div className="mt-4 border border-green-200 bg-green-50 p-2 rounded flex items-center gap-2 text-sm">
//                   <CheckCircle className="h-4 w-4 text-green-600" />
//                   <AlertDescription className="text-green-800">
//                     {Traduction[lang].success}
//                   </AlertDescription>
//                 </div>
//               )}

//               <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="space-y-4 mt-6"
//               >
//                 {/* Montant & Date */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="amount" className="dark:text-gray-200">
//                       {Traduction[lang].amount} *
//                     </Label>
//                     <Input
//                       id="amount"
//                       type="number"
//                       {...register("amount", { required: true, min: 0.01 })}
//                       placeholder="0"
//                       className="w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
//                     />
//                     {errors.amount && (
//                       <p className="text-red-500 text-sm">
//                         {Traduction[lang].amount_required}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="spent_at" className="dark:text-gray-200">
//                       {Traduction[lang].date} *
//                     </Label>
//                     <Input
//                       id="spent_at"
//                       type="date"
//                       {...register("spent_at", { required: true })}
//                       max={new Date().toISOString().split("T")[0]}
//                       className="w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
//                     />
//                     {errors.spent_at && (
//                       <p className="text-red-500 text-sm">
//                         {Traduction[lang].date_required}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Catégorie & Paiement */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-200">
//                       {Traduction[lang].category} *
//                     </Label>
//                     <Select
//                       key={`category-${watch("category_id") || ""}`}
//                       value={watch("category_id") || ""}
//                       onValueChange={(val) => setValue("category_id", val)}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue
//                           placeholder={Traduction[lang].select_category}
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categoriesToShow.map((cat) => (
//                           <SelectItem
//                             key={`cat-${cat.id}`}
//                             value={String(cat.id)}
//                           >
//                             <div className="flex items-center gap-2">
//                               <div
//                                 className="w-3 h-3 rounded-full"
//                                 style={{ backgroundColor: cat.color }}
//                               />
//                               {cat.name}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-200">
//                       {type === "depense"
//                         ? Traduction[lang].payment_method
//                         : Traduction[lang].income_source}{" "}
//                       *
//                     </Label>
//                     <Select
//                       key={`payment-${watch("payment_method") || ""}`}
//                       value={watch("payment_method") || ""}
//                       onValueChange={(val) => setValue("payment_method", val)}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue
//                           placeholder={Traduction[lang].select_payment_method}
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {paymentOptions.map((option) => (
//                           <SelectItem key={`pay-${option}`} value={option}>
//                             {option}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Note */}
//                 <div className="space-y-2">
//                   <Label className="dark:text-gray-200">
//                     {Traduction[lang].description}
//                   </Label>
//                   <Textarea
//                     {...register("note")}
//                     placeholder={Traduction[lang].description_placeholder}
//                     rows={3}
//                     className="w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
//                   />
//                 </div>

//                 {/* Bouton */}
//                 <Button
//                   type="submit"
//                   className="w-full py-2 rounded-md bg-green-600 hover:bg-green-800 flex items-center justify-center gap-2"
//                   disabled={mutation.isLoading || mutation.isSuccess}
//                 >
//                   {mutation.isLoading && (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   )}
//                   {mutation.isSuccess && (
//                     <CheckCircle className="h-4 w-4 text-white" />
//                   )}
//                   {mutation.isLoading
//                     ? Traduction[lang].saving // "Sauvegarde..."
//                     : mutation.isSuccess
//                     ? Traduction[lang].success // "Succès !"
//                     : getSubmitButtonText()}{" "}
//                 </Button>
//               </form>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, TrendingDown, Wallet } from "lucide-react";
import { AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import apiClient from "@/api/apiClient";

// Fonction pour récupérer les catégories depuis l'API
const fetchCategories = async () => {
  const res = await apiClient.get("/user/category");
  return Array.isArray(res.data.category) ? res.data.category : [];
};

const defaultPaymentMethods = ["Espèces", "Carte bancaire", "Mobile money"];
const defaultIncomeSources = ["Salaire", "Vente", "Autre"];

const AjouterDepense = () => {
  const [type, setType] = useState("depense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const options =
    type === "depense" ? defaultPaymentMethods : defaultIncomeSources;

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setPaymentMethod("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setSubmitStatus("idle");
    setErrors({});
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = {};

      // Validation
      if (!amount || parseFloat(amount) <= 0)
        newErrors.amount = "Le montant est requis et doit être supérieur à 0";
      if (!category) newErrors.category = "La catégorie est requise";
      if (!paymentMethod)
        newErrors.paymentMethod =
          type === "depense"
            ? "Le moyen de paiement est requis"
            : "La source de revenu est requise";
      if (!description.trim())
        newErrors.description = "La description est requise";
      if (!date) newErrors.date = "La date est requise";

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setSubmitStatus("error");
        return;
      }

      // Envoi
      try {
        setIsSubmitting(true);
        setSubmitStatus("idle");

        const payload = {
          amount: parseFloat(amount),
          category_id: parseInt(category),
          payment_method: paymentMethod,
          note: description,
          spent_at: date,
        };

        await apiClient.post("/user/transaction", payload);

        // Succès
        setSubmitStatus("success");
        setTimeout(resetForm, 5000); // Réinitialise après 5s
      } catch (err) {
        console.error("Erreur transaction:", err.response?.data || err);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [amount, category, paymentMethod, description, date, type]
  );

  const getSubmitButtonText = () => {
    if (isSubmitting) return "Sauvegarde...";
    if (submitStatus === "success") return "Ajouté avec succès !";
    return `Ajouter ${type === "depense" ? "la dépense" : "le revenu"}`;
  };

  const getSubmitButtonVariant = () => {
    if (submitStatus === "success") return "default";
    if (submitStatus === "error") return "destructive";
    return "default";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Nouvelle Transaction
        </h2>
        <p className="text-lg text-muted-foreground">
          Ajoutez vos dépenses et revenus
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Plus className="h-5 w-5" /> Nouvelle Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(val) => {
              setType(val);
              resetForm();
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="depense"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <TrendingDown className="h-4 w-4" /> Dépense
              </TabsTrigger>
              <TabsTrigger
                value="revenu"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Wallet className="h-4 w-4" /> Revenu
              </TabsTrigger>
            </TabsList>

            {submitStatus === "success" && (
              <div className="mt-4 border border-green-200 bg-green-50 p-2 rounded flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Transaction ajoutée avec succès !
                </AlertDescription>
              </div>
            )}

            <TabsContent value={type}>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {/* Montant & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Montant (FCFA) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setSubmitStatus("idle");
                      }}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm">{errors.amount}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSubmitStatus("idle");
                      }}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm">{errors.date}</p>
                    )}
                  </div>
                </div>

                {/* Catégorie & Paiement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Catégorie *</Label>
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        setCategory(val);
                        setSubmitStatus("idle");
                      }}
                    >
                      <SelectTrigger className="w-full text-sm px-3 py-2">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="text-sm">
                        {categories
                          .filter((cat) => cat.type === type)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>
                      {type === "depense"
                        ? "Moyen de paiement *"
                        : "Source de revenu *"}
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(val) => {
                        setPaymentMethod(val);
                        setSubmitStatus("idle");
                      }}
                    >
                      <SelectTrigger className="w-full text-sm px-3 py-2">
                        <SelectValue
                          placeholder={
                            type === "depense"
                              ? "Sélectionner un moyen de paiement"
                              : "Sélectionner une source de revenu"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((opt, idx) => (
                          <SelectItem key={idx} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label>Description *</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setSubmitStatus("idle");
                    }}
                    rows={3}
                    placeholder="Description de la transaction..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600"
                  disabled={isSubmitting || submitStatus === "success"}
                  variant={getSubmitButtonVariant()}
                >
                  {submitStatus === "success" && (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {getSubmitButtonText()}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterDepense;
