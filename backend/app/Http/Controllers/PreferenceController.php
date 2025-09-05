<?php

namespace App\Http\Controllers;

use App\Models\Preference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PreferenceController extends Controller
{
    // Récupérer les préférences de l’utilisateur connecté
    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'currency' => $user->currency,
            'language' => $user->language,
        ]);
    }

    // Mettre à jour les préférences
    public function store(Request $request)
    {
        $request->validate([
            'language' => 'required|in:fr,en',
            'currency' => 'required|in:FCFA,EUR,USD',
        ]);

        $user = Auth::user();
        $user->update([
            'language' => $request->language,
            'currency' => $request->currency,
        ]);

        return response()->json([
            'message' => 'Préférences mises à jour avec succès',
            'data' => $user,
        ]);
    }
}
