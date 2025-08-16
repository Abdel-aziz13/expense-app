// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function ResetPassword() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [backendErrors, setBackendErrors] = useState({});
//   const navigate = useNavigate();
//   const onSubmit = (data) => {
//     setBackendErrors({});
//     axios
//       .post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, data)
//       .then((response) => {
//         toast.success(response.data.status_message);
//         setTimeout(() => navigate("/login"), 1500);
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 422) {
//           setBackendErrors(error.response.data.errors);
//         } else if (error.response && error.response.status === 404) {
//           toast.error(error.response.data.message);
//         } else {
//           toast.error("Erreur serveur, veuillez réessayer.");
//         }
//       });
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
//       <div className="bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] rounded-lg p-8 w-full max-w-md">
//         <div className="mb-6 text-center">
//           <h2 className="text-2xl font-semibold text-green-700 mb-2">
//             Réinitialiser le mot de passe
//           </h2>
//           <p className="text-sm text-gray-600 mb-6">
//             Entrez le code et le nouveau mot de passe.
//           </p>
//         </div>

//         <form className="space-y-5">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={data.email}
//               readOnly
//               {...register("email", {
//                 required: "Veuillez saisir une adresse email",
//                 pattern: {
//                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                   message: "Adresse email invalide",
//                 },
//               })}
//               className={`w-full mt-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2`}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="verification_code"
//               className="block text-sm font-medium"
//             >
//               Code de vérification
//             </label>
//             <input
//               type="text"
//               name="verification_code"
//               value={data.verification_code}
//               className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
//                 errors.verification_code ? "ring-red-500" : "ring-green-500"
//               }`}
//               onChange={(e) => setData("verification_code", e.target.value)}
//             />
//             {errors.verification_code && (
//               <p className="text-sm text-red-500 mt-1">
//                 {errors.verification_code}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="new_password" className="block text-sm font-medium">
//               Nouveau mot de passe
//             </label>
//             <input
//               type="password"
//               name="new_password"
//               value={data.new_password}
//               className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
//                 errors.new_password ? "ring-red-500" : "ring-green-500"
//               }`}
//               onChange={(e) => setData("new_password", e.target.value)}
//             />
//             {errors.new_password && (
//               <p className="text-sm text-red-500 mt-1">{errors.new_password}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="new_password_confirmation"
//               className="block text-sm font-medium"
//             >
//               Confirmer le mot de passe
//             </label>
//             <input
//               type="password"
//               name="new_password_confirmation"
//               value={data.new_password_confirmation}
//               className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
//                 errors.new_password_confirmation
//                   ? "ring-red-500"
//                   : "ring-green-500"
//               }`}
//               onChange={(e) =>
//                 setData("new_password_confirmation", e.target.value)
//               }
//             />
//             {errors.new_password_confirmation && (
//               <p className="text-sm text-red-500 mt-1">
//                 {errors.new_password_confirmation}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={processing}
//             className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm"
//           >
//             {processing ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [backendErrors, setBackendErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("token"));
  console.log(user);

  const onSubmit = (data) => {
    setBackendErrors({});
    setProcessing(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, data)
      .then((response) => {
        toast.success(response.data.status_message);
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((error) => {
        setProcessing(false);
        if (error.response?.status === 422) {
          setBackendErrors(error.response.data.errors || {});
        } else if (error.response?.status === 404) {
          toast.error(error.response.data.status_message);
        } else {
          toast.error("Erreur serveur, veuillez réessayer.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Réinitialiser le mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Entrez le code et le nouveau mot de passe.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Code de vérification */}
          <div>
            <label
              htmlFor="verification_code"
              className="block text-sm font-medium"
            >
              Code de vérification
            </label>
            <input
              type="text"
              id="verification_code"
              {...register("verification_code", {
                required: "Le code est requis",
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.verification_code ? "ring-red-500" : "ring-green-500"
              }`}
            />
            {errors.verification_code && (
              <p className="text-sm text-red-500 mt-1">
                {errors.verification_code.message}
              </p>
            )}
            {backendErrors.verification_code && (
              <p className="text-sm text-red-500 mt-1">
                {backendErrors.verification_code}
              </p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="new_password"
              {...register("new_password", {
                required: "Mot de passe requis",
                minLength: {
                  value: 6,
                  message:
                    "Le mot de passe doit contenir au moins 6 caractères",
                },
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.new_password ? "ring-red-500" : "ring-green-500"
              }`}
            />
            {errors.new_password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.new_password.message}
              </p>
            )}
            {backendErrors.new_password && (
              <p className="text-sm text-red-500 mt-1">
                {backendErrors.new_password}
              </p>
            )}
          </div>

          {/* Confirmation */}
          <div>
            <label
              htmlFor="new_password_confirmation"
              className="block text-sm font-medium"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="new_password_confirmation"
              {...register("new_password_confirmation", {
                required: "Veuillez confirmer le mot de passe",
                validate: (value) =>
                  value === watch("new_password") ||
                  "Les mots de passe ne correspondent pas",
              })}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                errors.new_password_confirmation
                  ? "ring-red-500"
                  : "ring-green-500"
              }`}
            />
            {errors.new_password_confirmation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.new_password_confirmation.message}
              </p>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm"
          >
            {processing ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
