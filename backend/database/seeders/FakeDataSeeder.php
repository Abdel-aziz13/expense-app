<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Expense;
use App\Models\Budget;
use Carbon\Carbon;

class FakeDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'abdel@gmail.com')->first();

        if (!$user) {
            $this->command->info("Utilisateur standard non trouvé, veuillez exécuter UserSeeder.");
            return;
        }

        $admin = User::where('role', 'admin')->first();
        $categories = Category::where('user_id', $admin->id)->get();

        if ($categories->isEmpty()) {
            $this->command->info("Aucune catégorie trouvée. Veuillez exécuter CategorySeeder d'abord.");
            return;
        }

        // Boucle sur chaque mois depuis janvier 2025 jusqu'à aujourd'hui
        $startMonth = Carbon::create(2025, 1, 1);
        $endMonth = Carbon::today()->startOfMonth();

        for ($month = $startMonth->copy(); $month->lte($endMonth); $month->addMonth()) {
            $daysInMonth = $month->daysInMonth;
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $month->copy()->day($day);

                // Dépenses
                for ($i = 0; $i < rand(1, 3); $i++) {
                    $expenseCategory = $categories->where('type', 'depense')->random();
                    Expense::create([
                        'user_id' => $user->id,
                        'category_id' => $expenseCategory->id,
                        'amount' => rand(500, 5000),
                        'currency' => 'XAF',
                        'payment_method' => ['Cash', 'Mobile Money', 'Carte'][array_rand(['Cash', 'Mobile Money', 'Carte'])],
                        'note' => 'Dépense factice',
                        'spent_at' => $date->toDateString(),
                    ]);
                }

                // Revenus
                for ($i = 0; $i < rand(0, 2); $i++) {
                    $incomeCategory = $categories->where('type', 'revenu')->random();
                    Expense::create([
                        'user_id' => $user->id,
                        'category_id' => $incomeCategory->id,
                        'amount' => rand(1000, 10000),
                        'currency' => 'XAF',
                        'payment_method' => null,
                        'note' => 'Revenu factice',
                        'spent_at' => $date->toDateString(),
                    ]);
                }
            }
        }

        // Budgets mensuels pour chaque catégorie de dépenses
        foreach ($categories->where('type', 'depense') as $category) {
            Budget::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'amount' => rand(5000, 50000),
                'alert_threshold' => rand(50, 90),
                'period' => 'monthly',
                'spent' => 0,
            ]);
        }

        $this->command->info("Données factices créées pour l'utilisateur {$user->name} !");
    }
}
