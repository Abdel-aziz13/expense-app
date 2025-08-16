<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        $utilisateur = User::where('role', 'user')->get();

        return response()->json([
            'utilisateur' => $utilisateur
        ]);
    }
}
