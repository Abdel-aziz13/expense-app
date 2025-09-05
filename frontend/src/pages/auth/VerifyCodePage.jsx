import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const VerifyCodePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await apiClient.post("/auth/verify-code", {
        email,
        code: data.code,
      });
      toast.success("Code vérifié avec succès !");
      navigate(
        `/auth/reset-password?email=${encodeURIComponent(email)}&code=${
          data.code
        }`
      );
    } catch (err) {
      setError("code", {
        message: err.response?.data?.message || "Code invalide",
      });
      toast.error(err.response?.data?.message || "Code invalide");
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("Code renvoyé avec succès !");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors du renvoi du code"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-br from-green-50 to-green-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-green-700">
            Code de vérification
          </h2>
          <p className="text-gray-600 text-sm mt-1">Code envoyé à {email}</p>
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="Entrez le code reçu"
            {...register("code", { required: "Code requis" })}
            className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 ${
              errors.code
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-500"
            }`}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* Bouton Vérification */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 text-sm disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          {isSubmitting ? "Vérification..." : "Vérifier le code"}
        </button>

        {/* Bouton Renvoi */}
        <button
          type="button"
          onClick={resendCode}
          disabled={isResending}
          className="w-full mt-2 flex items-center justify-center text-green-700 border border-green-700 py-2 rounded-md hover:bg-green-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          {isResending ? "Renvoi en cours..." : "Renvoyer le code"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCodePage;
