import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon, Loader2, LockIcon, MailIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/api/apiClient";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [backendErrors, setBackendErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle mot de passe visible/masqué
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Soumission du formulaire
  const onSubmit = async (data) => {
    setBackendErrors({});
    setIsLoading(true);

    try {
      const res = await apiClient.post("/auth/login", data); // ✅ utilisation d’apiClient
      const token = res.data.access_token;

      login(token); // ✅ Contexte

      const decoded = jwtDecode(token);
      const role = decoded.role || "user";

      // toast.success("Connexion réussie 🚀");
      toast.success("Utilisateur connecté avec succès !");
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (error) {
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else if (error.response?.status === 403) {
        toast.error(error.response.data.message || "Identifiants invalides");
      } else {
        toast.error("Erreur serveur, veuillez réessayer");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-green-700">Connexion</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Heureux de vous revoir 👋
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
            {backendErrors.email && (
              <p className="text-sm text-red-500 mt-1">
                {backendErrors.email[0]}
              </p>
            )}
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
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                {...register("password", {
                  required: "Veuillez saisir un mot de passe",
                  minLength: {
                    value: 8,
                    message: "Le mot de passe doit avoir au moins 8 caractères",
                  },
                })}
                className="w-full text-sm border-0 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
            {backendErrors.password && (
              <p className="text-sm text-red-500 mt-1">
                {backendErrors.password[0]}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-green-600" /> Se
              souvenir de moi
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-green-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Lien inscription */}
        <div className="mt-6 text-center text-sm">
          Pas de compte ?{" "}
          <Link
            to="/auth/register"
            className="text-green-700 font-medium hover:underline"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
