import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { MailIcon, PhoneIcon, LockIcon, UserIcon } from "lucide-react";
import apiClient from "@/api/apiClient";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [backendErrors, setBackendErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setBackendErrors({});
    setIsLoading(true);

    try {
      const res = await apiClient.post("/auth/register", data); // ✅ apiClient
      toast.success(res.data.status_message || "Inscription réussie ✅");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error) {
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error("Erreur serveur, veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 font-poppins">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-green-700">Créer un compte</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Suivez vos dépenses avec{" "}
            <span className="font-semibold">ExpenseTrack Cameroun</span>
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Nom complet */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom complet
            </label>
            <div className="relative flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                {...register("name", {
                  required: "Veuillez saisir un nom",
                  minLength: {
                    value: 5,
                    message: "Le nom doit comporter au moins 5 caractères",
                  },
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
            </div>
            {(errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )) ||
              (backendErrors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {backendErrors.name[0]}
                </p>
              ))}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Adresse email
            </label>
            <div className="relative flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                {...register("email", {
                  required: "Veuillez saisir une adresse email",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Adresse email invalide",
                  },
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
            </div>
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

          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Téléphone
            </label>
            <div className="relative flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="phone"
                type="tel"
                placeholder="6xxxxxxxx"
                {...register("phone", {
                  required: "Veuillez saisir un numéro",
                  pattern: {
                    value: /^6(2|5|6|7|8|9)\d{7}$/,
                    message: "Numéro invalide (ex: 6xxxxxxxx)",
                  },
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
            </div>
            {(errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )) ||
              (backendErrors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {backendErrors.phone[0]}
                </p>
              ))}
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe
            </label>
            <div className="relative flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <LockIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="password"
                type="password"
                placeholder="Mot de passe sécurisé"
                {...register("password", {
                  required: "Veuillez saisir un mot de passe",
                  minLength: {
                    value: 8,
                    message: "Au moins 8 caractères requis",
                  },
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
            </div>
            {(errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )) ||
              (backendErrors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {backendErrors.password[0]}
                </p>
              ))}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium mb-1"
            >
              Confirmer mot de passe
            </label>
            <div className="relative flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <LockIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="password_confirmation"
                type="password"
                placeholder="Confirmez votre mot de passe"
                {...register("password_confirmation", {
                  validate: (val) =>
                    val === watch("password") || "Les mots de passe diffèrent",
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
            </div>
            {(errors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password_confirmation.message}
              </p>
            )) ||
              (backendErrors.password_confirmation && (
                <p className="text-sm text-red-500 mt-1">
                  {backendErrors.password_confirmation[0]}
                </p>
              ))}
          </div>

          {/* Termes */}
          <div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "Vous devez accepter les conditions",
                })}
                className="mt-1 text-green-600"
              />
              <span>
                J'accepte les{" "}
                <Link to="/terms" className="text-green-700 hover:underline">
                  termes et conditions
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-red-500 mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 text-sm disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        {/* Lien connexion */}
        <div className="mt-6 text-center text-sm">
          Déjà un compte ?{" "}
          <Link
            to="/auth/login"
            className="text-green-700 font-medium hover:underline"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
