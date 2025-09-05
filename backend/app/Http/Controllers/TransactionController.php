<?php

namespace App\Http\Controllers;

use App\Events\BudgetNotification;
use App\Http\Requests\TransactionRequest;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    /**
     * Afficher toutes les transactions de l'utilisateur
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $transactions = Expense::with('category')
                ->where('user_id', Auth::id())
                ->latest()
                ->get();

            return response()->json([
                'status' => 'success',
                'transactions' => $transactions
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des transactions', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des transactions'
            ], 500);
        }
    }

    /**
     * Ajouter une nouvelle transaction
     *
     * @param TransactionRequest $request
     * @return JsonResponse
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $userId = Auth::id();

        DB::beginTransaction();

        try {
            $transaction = Expense::create([
                'user_id' => $userId,
                'category_id' => $request->category_id,
                'amount' => $request->amount,
                'spent_at' => $request->spent_at,
                'payment_method' => $request->payment_method,
                'note' => $request->note,
            ]);


            // Mettre à jour le budget si une catégorie est spécifiée
            if ($request->category_id) {
                $this->updateBudgetAndNotify($userId, $request->category_id, $request->amount);
            }


            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction ajoutée avec succès',
                'transaction' => $transaction->load('category'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erreur lors de la création de la transaction', [
                'user_id' => $userId,
                'data' => $request->validated(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Erreur lors de la création de la transaction'
            ], 500);
        }
    }

    /**
     * Supprimer une transaction
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $transaction = Expense::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction non trouvée ou accès refusé'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Décrémenter le budget si une catégorie est associée
            if ($transaction->category_id) {
                $this->decrementBudget($user->id, $transaction->category_id, $transaction->amount);
            }

            $transaction->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erreur lors de la suppression de la transaction', [
                'user_id' => $user->id,
                'transaction_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de supprimer la transaction'
            ], 500);
        }
    }

    /**
     * Mettre à jour le budget et déclencher les notifications
     *
     * @param int $userId
     * @param int $categoryId
     * @param float $amount
     * @return void
     */
    protected function updateBudgetAndNotify(int $userId, int $categoryId, float $amount): void
    {
        $budget = Budget::where('user_id', $userId)
            ->where('category_id', $categoryId)
            ->first();

        if (!$budget) {
            return;
        }

        // Mettre à jour le montant dépensé
        $budget->increment('spent', $amount);


        // Calculer les statistiques et déclencher les notifications
        $this->triggerBudgetNotifications($userId, $budget);
    }

    /**
     * Décrémenter le budget lors de la suppression d'une transaction
     *
     * @param int $userId
     * @param int $categoryId
     * @param float $amount
     * @return void
     */
    protected function decrementBudget(int $userId, int $categoryId, float $amount): void
    {
        $budget = Budget::where('user_id', $userId)
            ->where('category_id', $categoryId)
            ->first();

        if ($budget) {
            $budget->spent = max($budget->spent - $amount, 0);
            $budget->save();
        }
    }

    /**
     * Déclencher les notifications liées au budget
     *
     * @param int $userId
     * @param Budget $budget
     * @return void
     */
    protected function triggerBudgetNotifications(int $userId, Budget $budget): void
    {
        $percentUsed = $budget->amount > 0
            ? round(($budget->spent / $budget->amount) * 100, 2)
            : 0;

        // Priorité aux cas graves
        if ($percentUsed >= 100) {
            $this->sendNotification("Vous avez atteint ou dépassé la limite de votre budget pour {$budget->category->name}.");
        } elseif ($percentUsed >= 80) {
            $this->sendNotification("Attention : Vous avez utilisé plus de 80% de votre budget pour {$budget->category->name}.");
        } elseif ($percentUsed < 50) {
            $this->sendNotification("Votre budget pour {$budget->category->name} est bien maîtrisé.");
        }

        // Astuce toujours envoyée
        // $this->sendNotification("💰 Astuce : Vérifiez vos frais pour les paiements mobiles (Orange Money, MTN Mobile Money).");

        Log::info("Pourcentage utilisé: " . $percentUsed);
    }



    /**
     * Envoyer une notification si la condition est remplie
     *
     * @param bool $condition
     * @param string $message
     * @return void
     */
    protected function sendNotificationIfCondition(bool $condition, string $message): void
    {
        if ($condition) {
            $this->sendNotification($message);
        }
    }

    /**
     * Envoyer une notification
     *
     * @param string $message
     * @return void
     */
    protected function sendNotification(string $message): void
    {
        Log::info("Notification envoyée: " . $message);
        event(new BudgetNotification([
            'message' => $message,
            'timestamp' => now(),
            'user_id' => Auth::id()
        ]));
    }

    /**
     * Récupérer les statistiques de l'utilisateur (revenus et dépenses)
     *
     * @param int $userId
     * @return array
     */
    protected function getUserStats(int $userId): array
    {
        $stats = DB::table('expenses')
            ->join('categories', 'expenses.category_id', '=', 'categories.id')
            ->where('expenses.user_id', $userId)
            ->select(
                DB::raw("SUM(CASE WHEN categories.type = 'revenu' THEN expenses.amount ELSE 0 END) as total_revenus"),
                DB::raw("SUM(CASE WHEN categories.type = 'depense' THEN expenses.amount ELSE 0 END) as total_depenses")
            )
            ->first();

        return [
            'total_revenus' => $stats->total_revenus ?? 0,
            'total_depenses' => $stats->total_depenses ?? 0,
        ];
    }
}
