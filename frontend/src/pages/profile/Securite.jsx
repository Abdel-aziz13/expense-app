import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function Securite() {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState(null);

  // Hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Mutation React Query
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Réponse mutation :", res.data);

      return res.data;
    },
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.status_message });
      reset();
    },
    onError: (err) => {
      if (err.response) {
        setMessage({
          type: "error",
          text: err.response.data.status_message || "Erreur serveur",
        });
      }
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Sécurité</h3>

      {/* Message de succès ou erreur */}
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Mot de passe actuel */}
        <div>
          <label className="block text-gray-700">Mot de passe actuel</label>
          <input
            type="password"
            {...register("current_password", { required: "Requis" })}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            placeholder="Entrez votre mot de passe actuel"
          />
          {errors.current_password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.current_password.message}
            </p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-gray-700">Nouveau mot de passe</label>
          <input
            type="password"
            {...register("new_password", {
              required: "Requis",
              minLength: {
                value: 6,
                message: "Au moins 6 caractères",
              },
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            placeholder="Entrez votre nouveau mot de passe"
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.new_password.message}
            </p>
          )}
        </div>

        {/* Confirmation */}
        <div>
          <label className="block text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            {...register("new_password_confirmation", {
              required: "Requis",
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            placeholder="Confirmez votre nouveau mot de passe"
          />
          {errors.new_password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.new_password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isLoading
            ? "Mise à jour..."
            : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </section>
  );
}
