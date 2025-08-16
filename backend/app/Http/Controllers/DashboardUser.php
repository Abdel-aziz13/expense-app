<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Income;

class DashboardUser extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear  = Carbon::now()->year;


        // Total dépenses du mois
        $totalDepenses = Expense::whereHas('category', function ($query) {
            $query->where('type', 'depense');
        })
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');


        // Total revenus du mois
        $totalRevenus = Expense::whereHas('category', function ($query) {
            $query->where('type', 'revenu');
        })
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');

        // Nombre total de transactions (dépenses + revenus)
        $totalTransactions = Expense::whereHas('category', function ($query) {
            $query->whereIn('type', ['depense', 'revenu']);
        })
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        return response()->json([
            'total_depenses'     => $totalDepenses,
            'total_revenus'      => $totalRevenus,
            'total_transactions' => $totalTransactions,
            'mois'               => Carbon::now()->format('F Y')
        ], 200);
    }
}
