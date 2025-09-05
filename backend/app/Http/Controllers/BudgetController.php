<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Events\BudgetNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())
            ->where('type', 'depense')
            ->orderBy('name', 'asc')
            ->get();

        $budgets = Budget::with('category')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        $totalBudgets = Budget::where('user_id', Auth::id())
            ->sum('amount');

        return response()->json([
            'category' => $categories,
            'budgets' => $budgets,
            'totalBudgets' => $totalBudgets,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'period' => 'required|in:weekly,monthly',
            'alert_threshold' => 'nullable|numeric|min:0|max:100',
        ]);

        $userId = Auth::id();

        // Vérifier si un budget existe déjà pour cet utilisateur, catégorie et période
        $budget = Budget::where('user_id', $userId)
            ->where('category_id', $request->category_id)
            ->where('period', $request->period)
            ->first();

        if ($budget) {
            // Si le budget existe déjà, on augmente seulement le montant
            $budget->amount += $request->amount;
            $budget->alert_threshold = $request->alert_threshold ?? $budget->alert_threshold;
            $budget->save();
        } else {
            // Sinon, on crée un nouveau budget
            $budget = Budget::create([
                'user_id' => $userId,
                'category_id' => $request->category_id,
                'amount' => $request->amount,
                'period' => $request->period,
                'spent' => 0,
                'alert_threshold' => $request->alert_threshold ?? 0,
            ]);
        }




        return response()->json([
            'message' => 'Budget créé avec succès',
            'budget' => $budget,
        ], 201);
    }

    public function destroy(Budget $budget)
    {
        if ($budget->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $budget->delete();

        return response()->json(['message' => 'Budget supprimé avec succès']);
    }
}
