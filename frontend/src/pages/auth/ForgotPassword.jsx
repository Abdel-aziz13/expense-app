import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/api/apiClient";
import { Loader2 } from "lucide-react";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [backendErrors, setBackendErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setBackendErrors({});
    setProcessing(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: data.email });
      toast.success("Email envoyé avec succès !");
      navigate(`/auth/verify-code?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur serveur, veuillez réessayer.");
      }
    } finally {
      setProcessing(false);
    }
    // axios
    //   .post(
    //     `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password-request`,
    //     data
    //   )
    //   .then((response) => {
    //     toast.success(response.data.status_message);
    //     setTimeout(() => navigate("/reset-password"), 1500);
    //   })
    //   .catch((error) => {
    //     if (error.response && error.response.status === 422) {
    //       setBackendErrors(error.response.data.errors);
    //     } else if (error.response && error.response.status === 404) {
    //       toast.error(error.response.data.message);
    //     } else {
    //       toast.error("Erreur serveur, veuillez réessayer.");
    //     }
    //   });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] rounded-lg p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Mot de passe oublié
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Entrez votre adresse email pour recevoir un lien de rénitialisation.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              {...register("email", {
                required: "Veuillez saisir une adresse email",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Adresse email invalide",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.email || backendErrors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
            {(errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )) ||
              (backendErrors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {backendErrors.email[0]}
                </p>
              ))}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full flex items-center justify-center bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm disabled:opacity-50"
          >
            {processing && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {processing ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/auth/login" className="text-green-700 hover:underline">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
