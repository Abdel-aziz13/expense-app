import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oups ! La page que vous recherchez n'existe pas.
      </p>
      <Link
        to="/auth/login"
        className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
