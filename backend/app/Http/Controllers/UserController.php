<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{

    /**
     * @param \App\Http\Requests\RegisterRequest $request
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = new User();
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->phone = $request->input('phone');
            $user->password = Hash::make($request->input('password'), [
                'rounds' => 12,
            ]);
            $user->role = $request->role ?? 'user';
            $user->currency = $request->currency ?? 'FCFA';
            $user->save();

            return response()->json([
                // 'success' => true,
                'status_code' => 201,
                'status_message' => 'Utilisateur enregistré avec succès',
                'user' => $user,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de l’enregistrement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param \App\Http\Requests\LoginRequest $request
     */

    public function login(LoginRequest $request)
    {
        try {
            // $request->only('email', 'password'))
            // if (Auth::attempt($request->only('email', 'password'))) {

            $email = $request->input('email');
            $password = $request->input('password');
            if (Auth::attempt(['email' => $email, 'password' => $password])) {

                $user = Auth::user();

                $user->tokens()->delete();

                // Creer un nouveau token avec les bonnes permissions
                $abilities = $user->role === 'admin' ? ['admin'] : ['user'];
                $token = $user->createToken('Personal Access Token', $abilities)->plainTextToken;

                return response()->json([
                    'status_message' => 'Utilisateur connecté avec succès',
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => 60 * 60 * 24,
                    'abilities' => $abilities,
                    'status_code' => 200,
                ], 200);
            } else {
                return response()->json([
                    'status_code' => 403,
                    'status_message' => 'Informations non valides',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de l’enregistrement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status_code' => 404,
                'status_message' => 'Utilisateur non trouvé',
            ], 404);
        }

        $code = rand(100000, 999999);

        $user->verification_code = $code;

        $user->save();
        $emailData = [
            'name' => $user->name,
            'email' => $user->email,
            'code' => $user->verification_code,
        ];

        Mail::to($emailData['email'])->send(new ResetPasswordMail($emailData));

        return response()->json([
            'status_code' => 200,
            'status_message' => 'Code de vérification envoyé par email',
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'code' => 'required|integer',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $user = User::where('email', $request->email)
                ->where('verification_code', $request->code)
                ->first();

            if (!$user) {
                return response()->json([
                    'status_code' => 404,
                    'status_message' => 'Code de vérification invalide ou utilisateur non trouvé',
                ], 404);
            }

            $user->password = Hash::make($request->password, [
                'rounds' => 12,
            ]);
            $user->verification_code = null;
            $user->save();

            return response()->json([
                'status_code' => 200,
                'status_message' => 'Mot de passe réinitialisé avec succès',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de la réinitialisation du mot de passe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status_code'    => 404,
                    'status_message' => 'Utilisateur non trouvé',
                ], 404);
            }

            return response()->json([
                'status_code' => 200,
                'user'        => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de la récupération du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status_code' => 403,
                    'status_message' => 'Mot de passe actuel incorrect',
                ], 403);
            }

            $user->password = Hash::make($request->new_password, [
                'rounds' => 12,
            ]);
            $user->save();

            return response()->json([
                'status_code' => 200,
                'status_message' => 'Mot de passe changé avec succès',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors du changement de mot de passe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:users,email,' . $request->user()->id,
                'phone' => 'nullable|string|max:20',
            ]);
            $user = $request->user();

            $oldPhoto = $user->photo;
            if ($request->hasFile('photo')) {
                $request->validate([
                    'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                ]);

                $photoPath = $request->file('photo')->store('profile_photos', 'public');

                $user->photo = $photoPath;
            }

            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->about = $request->about;

            if ($user->save()) {

                // Supprimer l'ancienne photo seulement si elle existe
                if (!empty($oldPhoto) && $oldPhoto !== $user->photo && Storage::disk('public')->exists($oldPhoto)) {
                    Storage::disk('public')->delete($oldPhoto);
                }
            }

            return response()->json([
                'status_code' => 200,
                'status_message' => 'Profil mis à jour avec succès',
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            $user->tokens()->delete();

            return response()->json([
                'status_code' => 200,
                'status_message' => 'Déconnexion réussie',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Erreur lors de la déconnexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
