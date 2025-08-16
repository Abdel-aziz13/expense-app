import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [backendErrors, setBackendErrors] = useState({});
  const navigate = useNavigate();
  const onSubmit = (data) => {
    setBackendErrors({});
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, data)
      .then((response) => {
        toast.success(response.data.status_message || "Inscription réussie !");
        setTimeout(() => navigate("/login"), 1500);
        // console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          setBackendErrors(validationErrors);
        } else {
          toast.error("Erreur serveur, veuillez réessayer.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-2">
          Créer un compte
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Suivez vos dépenses facilement avec{" "}
          <span className="font-semibold">ExpenseTrack Cameroun</span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Nom complet */}
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium">
              Nom complet
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="Entrez votre nom complet"
              {...register("name", {
                required: "Veuillez saisir un nom",
                minLength: {
                  value: 5,
                  message: "Le nom doit comporter au moins 5 caractères",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.name || backendErrors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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
            <label htmlFor="signup-email" className="block text-sm font-medium">
              Adresse email
            </label>
            <input
              id="signup-email"
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

          {/* Téléphone */}
          <div>
            <label htmlFor="signup-phone" className="block text-sm font-medium">
              Numéro de téléphone
            </label>
            <input
              id="signup-phone"
              type="tel"
              placeholder="Ex: 6xxxxxxxx"
              {...register("phone", {
                required: "Veuillez saisir un numéro de téléphone",
                pattern: {
                  value: /^6(2|5|6|7|8|9)\d{7}$/,
                  message: "Numéro invalide (ex: 6xxxxxxxx)",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.phone || backendErrors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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
              htmlFor="signup-password"
              className="block text-sm font-medium"
            >
              Mot de passe
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="Créez un mot de passe sécurisé"
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
                  ? " focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirmez votre mot de passe"
              {...register("password_confirmation", {
                validate: (value) =>
                  value === watch("password") ||
                  "Les mots de passe ne correspondent pas",
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
                errors.password_confirmation ||
                backendErrors.password_confirmation
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
            />
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

          {/* Accepter les termes */}
          <div>
            <label
              htmlFor="signup-terms"
              className="flex items-start space-x-2 text-sm"
            >
              <input
                type="checkbox"
                id="signup-terms"
                {...register("terms", {
                  required: "Vous devez accepter les termes et conditions",
                })}
                className="mt-1 focus:ring-green-500"
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
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-lg"
          >
            S'inscrire
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-green-700 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
