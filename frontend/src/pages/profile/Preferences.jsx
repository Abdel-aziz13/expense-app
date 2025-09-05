import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";

function Preferences() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const { lang, changeLanguage } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { currency: "FCFA", language: lang || "fr" },
  });

  // 🔹 Récupération des préférences depuis le backend
  const { data, isLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Remplir le formulaire avec les préférences récupérées
      reset({
        currency: data.currency || "FCFA",
        language: data.language || "fr",
      });
    },
  });

  // 🔹 Mutation pour mettre à jour les préférences
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/preferences`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      toast.success("Préférences enregistrées !");
      queryClient.invalidateQueries(["preferences"]);

      // 🔹 Mettre à jour la langue immédiatement
      if (variables.language) {
        changeLanguage(variables.language);
      }
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        toast.error(
          "Erreur de validation : " + JSON.stringify(error.response.data.errors)
        );
      } else {
        toast.error("Erreur lors de l’enregistrement");
      }
    },
  });

  const onSubmit = (formData) => mutation.mutate(formData);

  if (isLoading) return <p>Chargement...</p>;

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Préférences</h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-gray-700">Devise</label>
          <select
            {...register("currency")}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          >
            <option value="FCFA">Franc CFA (FCFA)</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar US ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Langue</label>
          <select
            {...register("language")}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || mutation.isLoading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isLoading
            ? "Enregistrement..."
            : "Enregistrer les préférences"}
        </button>
      </form>
    </section>
  );
}

export default Preferences;
