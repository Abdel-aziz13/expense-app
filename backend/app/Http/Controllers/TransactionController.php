<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Expense;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return response()->json([
            'transactions' => Expense::with('category')->latest()->get()
        ]);
    }

    public function store(TransactionRequest $request)
    {


        try {
            $transaction = new Expense();
            $transaction->category_id = $request->category_id;
            $transaction->amount = $request->amount;
            $transaction->spent_at = $request->spent_at;
            $transaction->payment_method = $request->payment_method;
            $transaction->note = $request->note;
            $transaction->user_id = auth()->id();
            $transaction->save();

            return response()->json([
                'status_code' => 201,
                'status_message' => 'Transaction ajoutée avec succès',
                'transaction' => $transaction,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Error creating transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        // Récupérer la transaction et vérifier que l'utilisateur est propriétaire
        $transaction = Expense::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction non trouvée ou accès refusé.'
            ], 404);
        }

        try {
            $transaction->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impossible de supprimer la transaction.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
