<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\User;

class CategorySeeder extends Seeder
{
    public function run(): void
    {

        // On récupère l'admin créé dans UserSeeder
        $admin = User::where('email', 'admin@local.cm')->first();

        $categories = [
            // Dépenses
            ['name' => 'Nourriture & Boissons', 'type' => 'depense', 'color' => '#FF5733'],
            ['name' => 'Transport', 'type' => 'depense', 'color' => '#FFC300'],
            ['name' => 'Loyer & Logement', 'type' => 'depense', 'color' => '#DAF7A6'],
            ['name' => 'Électricité', 'type' => 'depense', 'color' => '#C70039'],
            ['name' => 'Eau', 'type' => 'depense', 'color' => '#3498DB'],
            ['name' => 'Communication', 'type' => 'depense', 'color' => '#9B59B6'],
            ['name' => 'Santé & Pharmacie', 'type' => 'depense', 'color' => '#E74C3C'],
            ['name' => 'Éducation', 'type' => 'depense', 'color' => '#1ABC9C'],
            ['name' => 'Hygiène & Entretien', 'type' => 'depense', 'color' => '#2ECC71'],
            ['name' => 'Loisirs & Sorties', 'type' => 'depense', 'color' => '#E67E22'],
            ['name' => 'Shopping & Vêtements', 'type' => 'depense', 'color' => '#16A085'],
            ['name' => 'Cadeaux & Événements', 'type' => 'depense', 'color' => '#F39C12'],
            ['name' => 'Voyage & Hébergement', 'type' => 'depense', 'color' => '#8E44AD'],
            ['name' => 'Impôts & Taxes', 'type' => 'depense', 'color' => '#34495E'],
            ['name' => 'Transferts d’argent', 'type' => 'depense', 'color' => '#7F8C8D'],
            ['name' => 'Tontines & Contributions', 'type' => 'depense', 'color' => '#27AE60'],

            // Revenus
            ['name' => 'Salaire', 'type' => 'revenu', 'color' => '#2ECC71'],
            ['name' => 'Prime & Bonus', 'type' => 'revenu', 'color' => '#1ABC9C'],
            ['name' => 'Activité secondaire', 'type' => 'revenu', 'color' => '#3498DB'],
            ['name' => 'Vente de biens / Commerce', 'type' => 'revenu', 'color' => '#F1C40F'],
            ['name' => 'Transfert reçu', 'type' => 'revenu', 'color' => '#E67E22'],
            ['name' => 'Intérêts & Dividendes', 'type' => 'revenu', 'color' => '#9B59B6'],
            ['name' => 'Aides & Dons reçus', 'type' => 'revenu', 'color' => '#E74C3C'],
        ];

        foreach ($categories as $category) {
            Category::create(array_merge($category, [
                'user_id' => $admin->id
            ]));
        }
    }
}
