import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      await apiClient.post("/auth/reset-password", {
        email,
        new_password: data.password,
        new_password_confirmation: data.confirmPassword,
      });

      toast.success("Mot de passe réinitialisé avec succès !");
      navigate("/auth/login");
    } catch (err) {
      if (err.response?.status === 422) {
        Object.entries(err.response.data.errors).forEach(([key, val]) => {
          setError(key, { message: val[0] });
        });
      } else {
        toast.error(err.response?.data?.message || "Erreur");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-green-700 mb-2 text-center">
          Réinitialiser le mot de passe
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Choisissez un nouveau mot de passe
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" value={code} {...register("code")} />

          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Mot de passe requis",
                minLength: { value: 6, message: "Au moins 6 caractères" },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirmation requise",
                validate: (val) =>
                  val === password || "Les mots de passe ne correspondent pas",
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {isSubmitting ? "Envoi en cours..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
