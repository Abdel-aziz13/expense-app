import React from "react";

const AssistantIA = () => {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            Assistant IA<span class="text-2xl">🤖</span>
          </h2>
          <p class="text-lg text-muted-foreground">
            Fonctionnalité en cours de développement
          </p>
        </div>
        <div class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
          <div class="text-6xl mb-4">🚧</div>
          <h3 class="text-xl font-semibold mb-2">
            Assistant IA - Bientôt Disponible
          </h3>
          <p class="text-muted-foreground max-w-md mx-auto">
            L'assistant IA pour les suggestions budgétaires intelligentes sera
            disponible dans une prochaine mise à jour.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantIA;
