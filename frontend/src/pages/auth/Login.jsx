import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState({});

  // Si déjà connecté → redirection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setBackendErrors({});
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data)
      .then((response) => {
        const { access_token, user, status_message } = response.data;

        // Sauvegarde token + role
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", user.role);

        toast.success(status_message || "Connexion réussie !");

        // Redirection selon le role
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1200);
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setBackendErrors(error.response.data.errors);
        } else if (error.response && error.response.status === 403) {
          toast.error(error.response.data.message || "Identifiants invalides.");
        } else {
          toast.error("Erreur serveur, veuillez réessayer.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Titre */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Connexion
          </h2>
          <p className="text-sm text-gray-600">Heureux de vous revoir !</p>
        </div>

        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre adresse email"
              {...register("email", {
                required: "Veuillez saisir une adresse email",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Adresse email invalide",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.email || backendErrors.email
                  ? "focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              {...register("password", {
                required: "Veuillez saisir un mot de passe",
                minLength: {
                  value: 8,
                  message:
                    "Le mot de passe doit comporter au moins 8 caractères",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.password || backendErrors.password
                  ? "focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Se souvenir de moi
            </label>
            <Link
              to="/forgot-password"
              className="text-green-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm"
          >
            Se connecter
          </button>
        </form>

        {/* Lien inscription */}
        <div className="mt-6 text-center text-sm">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-green-700 hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
