import React, { useState, useEffect } from "react";

const AssistantIA = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simule un chargement (ex: récupération des données)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // 1.5s
    return () => clearTimeout(timer);
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">
            Initialisation de l&apos;assistant IA...
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
            Chargement des fonctionnalités
          </p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
            Assistant IA <span className="text-2xl">🤖</span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300">
            Fonctionnalité en cours de développement
          </p>
        </div>

        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
            Assistant IA - Bientôt Disponible
          </h3>
          <p className="text-muted-foreground dark:text-gray-300 max-w-md mx-auto">
            L'assistant IA pour les suggestions budgétaires intelligentes sera
            disponible dans une prochaine mise à jour.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantIA;
