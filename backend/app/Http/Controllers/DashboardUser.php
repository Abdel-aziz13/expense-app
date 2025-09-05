<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardUser extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Récupère le mois et l'année demandés, ou ceux du jour
        $month = $request->input('month') ?: Carbon::now()->month;
        $year  = $request->input('year') ?: Carbon::now()->year;

        // Mois précédent
        $datePrecedent = Carbon::create($year, $month, 1)->subMonth();
        $monthPrev = $datePrecedent->month;
        $yearPrev  = $datePrecedent->year;

        // Dépenses du mois sélectionné
        $totalDepenses = Expense::whereHas('category', fn($q) => $q->where('type', 'depense'))
            ->whereMonth('spent_at', $month)
            ->whereYear('spent_at', $year)
            ->where('user_id', $userId)
            ->sum('amount');

        // Dépenses du mois précédent
        $depensesPrecedent = Expense::whereHas('category', fn($q) => $q->where('type', 'depense'))
            ->whereMonth('spent_at', $monthPrev)
            ->whereYear('spent_at', $yearPrev)
            ->where('user_id', $userId)
            ->sum('amount');

        // Revenus du mois sélectionné
        $totalRevenus = Expense::whereHas('category', fn($q) => $q->where('type', 'revenu'))
            ->whereMonth('spent_at', $month)
            ->whereYear('spent_at', $year)
            ->where('user_id', $userId)
            ->sum('amount');

        // Revenus du mois précédent
        $revenusPrecedent = Expense::whereHas('category', fn($q) => $q->where('type', 'revenu'))
            ->whereMonth('spent_at', $monthPrev)
            ->whereYear('spent_at', $yearPrev)
            ->where('user_id', $userId)
            ->sum('amount');

        // Nombre total de transactions du mois sélectionné
        $totalTransactions = Expense::whereMonth('spent_at', $month)
            ->whereYear('spent_at', $year)
            ->where('user_id', $userId)
            ->count();

        // Transactions de la semaine courante
        $startWeek = Carbon::now()->startOfWeek();
        $endWeek   = Carbon::now()->endOfWeek();
        $transactionsSemaine = Expense::whereBetween('spent_at', [$startWeek, $endWeek])
            ->where('user_id', $userId)
            ->count();

        // Données pour les graphiques
        $financeData = $this->getMonthlyFinanceData($userId, $year);
        $categoryData = $this->getCategoryData($userId, $month, $year);

        return response()->json([
            'total_depenses'      => $totalDepenses,
            'depensesPrecedent'   => $depensesPrecedent,
            'total_revenus'       => $totalRevenus,
            'revenusPrecedent'    => $revenusPrecedent,
            'total_transactions'  => $totalTransactions,
            'transactions_semaine' => $transactionsSemaine,
            'financeData'         => $financeData,
            'categoryData'        => $categoryData,
        ]);
    }

    // Graphique barres (12 mois)
    private function getMonthlyFinanceData($userId, $year)
    {
        $results = DB::table('expenses')
            ->join('categories', 'expenses.category_id', '=', 'categories.id')
            ->select(
                DB::raw('MONTH(expenses.spent_at) as month'),
                DB::raw('YEAR(expenses.spent_at) as year'),
                DB::raw('SUM(CASE WHEN categories.type = "revenu" THEN expenses.amount ELSE 0 END) as revenus'),
                DB::raw('SUM(CASE WHEN categories.type = "depense" THEN expenses.amount ELSE 0 END) as depenses')
            )
            ->where('expenses.user_id', $userId)
            ->whereYear('expenses.spent_at', $year)
            ->groupBy(DB::raw('YEAR(expenses.spent_at), MONTH(expenses.spent_at)'))
            ->orderBy('month')
            ->get();

        $financeData = [];
        $resultsByMonth = $results->keyBy('month');
        for ($month = 1; $month <= 12; $month++) {
            $data = $resultsByMonth->get($month);
            $revenus = $data ? (float) $data->revenus : 0;
            $depenses = $data ? (float) $data->depenses : 0;
            $benefice = $revenus - $depenses;
            $moisNom = Carbon::create($year, $month, 1)->locale('fr')->isoFormat('MMM YYYY');
            $financeData[] = [
                'mois' => $moisNom,
                'revenus' => $revenus,
                'depenses' => $depenses,
                'benefice' => $benefice
            ];
        }
        return $financeData;
    }

    // Graphique pie (catégories du mois sélectionné)
    private function getCategoryData($userId, $month, $year)
    {
        $categories = Expense::select(
            'categories.name',
            'categories.color',
            DB::raw('SUM(expenses.amount) as value')
        )
            ->join('categories', 'expenses.category_id', '=', 'categories.id')
            ->where('expenses.user_id', $userId)
            ->where('categories.type', 'depense')
            ->whereMonth('expenses.spent_at', $month)
            ->whereYear('expenses.spent_at', $year)
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderBy('value', 'desc')
            ->get();

        return $categories->map(fn($cat) => [
            'name' => $cat->name,
            'value' => (float) $cat->value,
            'color' => $cat->color ?? '#8884d8',
        ]);
    }
}
