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
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\Rule;


class UserController extends Controller
{

    /**
     * @param \App\Http\Requests\RegisterRequest $request
     */
    // public function register(RegisterRequest $request)
    // {
    //     try {
    //         $user = new User();
    //         $user->name = $request->input('name');
    //         $user->email = $request->input('email');
    //         $user->phone = $request->input('phone');
    //         $user->password = Hash::make($request->input('password'), [
    //             'rounds' => 12,
    //         ]);
    //         $user->role = $request->role ?? 'user';
    //         $user->currency = $request->currency ?? 'FCFA';
    //         $user->language = $request->language ?? 'fr';
    //         $user->save();

    //         return response()->json([
    //             // 'success' => true,
    //             'status_code' => 201,
    //             'status_message' => 'Utilisateur enregistré avec succès',
    //             'user' => $user,
    //         ], 201);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de l’enregistrement',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    /**
     * @param \App\Http\Requests\LoginRequest $request
     */

    // public function login(LoginRequest $request)
    // {
    //     try {


    //         $email = $request->input('email');
    //         $password = $request->input('password');
    //         if (Auth::attempt(['email' => $email, 'password' => $password])) {

    //             $user = Auth::user();

    //             $user->tokens()->delete();

    //             // Creer un nouveau token avec les bonnes permissions
    //             $abilities = $user->role === 'admin' ? ['admin'] : ['user'];
    //             $token = $user->createToken('Personal Access Token', $abilities)->plainTextToken;

    //             return response()->json([
    //                 'status_message' => 'Utilisateur connecté avec succès',
    //                 'user' => $user,
    //                 'access_token' => $token,
    //                 'token_type' => 'Bearer',
    //                 'expires_in' => 60 * 60 * 24,
    //                 'abilities' => $abilities,
    //                 'status_code' => 200,
    //             ], 200);
    //         } else {
    //             return response()->json([
    //                 'status_code' => 403,
    //                 'status_message' => 'Informations non valides',
    //             ], 403);
    //         }
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de l’enregistrement',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function forgotPassword(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status_code' => 404,
    //             'status_message' => 'Utilisateur non trouvé',
    //         ], 404);
    //     }

    //     $code = rand(100000, 999999);

    //     $user->verification_code = $code;

    //     $user->save();
    //     $emailData = [
    //         'name' => $user->name,
    //         'email' => $user->email,
    //         'code' => $user->verification_code,
    //     ];

    //     Mail::to($emailData['email'])->send(new ResetPasswordMail($emailData));

    //     return response()->json([
    //         'status_code' => 200,
    //         'status_message' => 'Code de vérification envoyé par email',
    //     ], 200);
    // }

    // public function resetPassword(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'email' => 'required|email',
    //             'code' => 'required|integer',
    //             'new_password' => 'required|min:6|confirmed',
    //         ]);

    //         $user = User::where('email', $request->email)
    //             ->where('verification_code', $request->code)
    //             ->first();

    //         if (!$user) {
    //             return response()->json([
    //                 'status_code' => 404,
    //                 'status_message' => 'Code de vérification invalide ou utilisateur non trouvé',
    //             ], 404);
    //         }

    //         $user->password = Hash::make($request->password, [
    //             'rounds' => 12,
    //         ]);
    //         $user->verification_code = null;
    //         $user->save();

    //         return response()->json([
    //             'status_code' => 200,
    //             'status_message' => 'Mot de passe réinitialisé avec succès',
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de la réinitialisation du mot de passe',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function profile(Request $request)
    // {
    //     try {
    //         $user = $request->user();

    //         if ($user->photo) {
    //             $user->photo_url = asset('storage/' . $user->photo);
    //         } else {
    //             $user->photo_url = null;
    //         }

    //         if (!$user) {
    //             return response()->json([
    //                 'status_code'    => 404,
    //                 'status_message' => 'Utilisateur non trouvé',
    //             ], 404);
    //         }

    //         return response()->json([
    //             'status_code' => 200,
    //             'user'        => $user,
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de la récupération du profil',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function changePassword(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'current_password' => 'required',
    //             'new_password' => 'required|min:6|confirmed',
    //         ]);

    //         $user = $request->user();

    //         if (!Hash::check($request->current_password, $user->password)) {
    //             return response()->json([
    //                 'status_code' => 403,
    //                 'status_message' => 'Mot de passe actuel incorrect',
    //             ], 403);
    //         }

    //         $user->password = Hash::make($request->new_password, [
    //             'rounds' => 12,
    //         ]);
    //         $user->save();

    //         return response()->json([
    //             'status_code' => 200,
    //             'status_message' => 'Mot de passe changé avec succès',
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors du changement de mot de passe',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function updateProfile(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'name' => 'nullable|string|max:255',
    //             'email' => 'nullable|email|max:255|unique:users,email,' . $request->user()->id,
    //             'phone' => 'nullable|string|max:20',
    //             'profession' => 'nullable|string|max:20',
    //         ]);
    //         $user = $request->user();

    //         $oldPhoto = $user->photo;
    //         if ($request->hasFile('photo')) {
    //             $request->validate([
    //                 'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //             ]);

    //             $photoPath = $request->file('photo')->store('profile_photos', 'public');

    //             $user->photo = $photoPath;
    //         }

    //         $user->name = $request->name;
    //         $user->email = $request->email;
    //         $user->phone = $request->phone;
    //         $user->about = $request->about;
    //         $user->profession = $request->profession;

    //         if ($user->save()) {

    //             // Supprimer l'ancienne photo seulement si elle existe
    //             if (!empty($oldPhoto) && $oldPhoto !== $user->photo && Storage::disk('public')->exists($oldPhoto)) {
    //                 Storage::disk('public')->delete($oldPhoto);
    //             }
    //         }

    //         return response()->json([
    //             'status_code' => 200,
    //             'status_message' => 'Profil mis à jour avec succès',
    //             'user' => $user,
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de la mise à jour du profil',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function logout(Request $request)
    // {
    //     try {
    //         $user = $request->user();

    //         $user->tokens()->delete();

    //         return response()->json([
    //             'status_code' => 200,
    //             'status_message' => 'Déconnexion réussie',
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status_code' => 500,
    //             'status_message' => 'Erreur lors de la déconnexion',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    /**
     * Enregistrement d'un utilisateur
     */
    public function register(RegisterRequest $request)
    {

        $data = $request->validated();

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'],
            'photo'      => $data['photo'] ?? 'avatars/default.jpg',
            'password' => Hash::make($data['password'],),
            'currency' => $data['currency'] ?? 'FCFA',
            'language' => $data['language'] ?? 'fr',
            'role'     => $data['role'] ?? 'user',
        ]);

        return response()->json([
            'message' => 'Utilisateur enregistré avec succès',
            'user'    => $user
        ], 201);
    }

    /**
     * Connexion
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user = auth('api')->user();
        return $this->respondWithToken($token, $user);
    }

    /**
     * Profil utilisateur
     */
    public function profile()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Mise à jour du profil
     */
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'       => 'nullable|string|max:255',
                'email'      => ['nullable', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
                'phone'      => ['nullable', 'string', 'max:20', Rule::unique('users')->ignore($request->user()->id)],
                'profession' => 'nullable|string|max:255',
                'photo'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = $request->user();
            $oldPhoto = $user->photo;
            $user->fill($request->except(['photo']));

            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('profile_photos', 'public');
                $user->photo = $photoPath;

                if ($oldPhoto && $oldPhoto !== 'avatars/default.png' && Storage::disk('public')->exists($oldPhoto)) {
                    Storage::disk('public')->delete($oldPhoto);
                }
            }

            $user->save();

            return response()->json([
                'status_code'    => 200,
                'status_message' => 'Profil mis à jour avec succès',
                'user'           => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code'    => 500,
                'status_message' => 'Erreur lors de la mise à jour du profil',
                'error'          => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|confirmed|min:6',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status_code'    => 403,
                'status_message' => 'Mot de passe actuel incorrect'
            ], 403);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status_code'    => 200,
            'status_message' => 'Mot de passe changé avec succès'
        ], 200);
    }

    /**
     * Mot de passe oublié
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status_code'    => 404,
                'status_message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $code = rand(100000, 999999);
        $user->verification_code = $code;
        $user->save();

        Mail::to($user->email)->send(new ResetPasswordMail([
            'name' => $user->name,
            'email' => $user->email,
            'code' => $code
        ]));

        return response()->json([
            'status_code'    => 200,
            'status_message' => 'Code de vérification envoyé par email'
        ], 200);
    }

    /**
     * Vérifier le code de réinitialisation
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code'  => 'required|integer',
        ]);

        $user = User::where('email', $request->email)
            ->where('verification_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json([
                'status_code'    => 422,
                'status_message' => 'Code invalide ou expiré'
            ], 422);
        }

        // Code correct, tu peux éventuellement supprimer le code pour sécurité
        $user->verification_code = null;
        $user->save();

        return response()->json([
            'status_code'    => 200,
            'status_message' => 'Code vérifié avec succès'
        ], 200);
    }


    /**
     * Réinitialiser le mot de passe
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'        => 'required|email',
            'new_password' => 'required|confirmed|min:6',
        ]);

        $user = User::where('email', $request->email)
            ->where('verification_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json([
                'status_code'    => 404,
                'status_message' => 'Code invalide ou utilisateur non trouvé'
            ], 404);
        }

        $user->password = Hash::make($request->new_password);
        $user->verification_code = null;
        $user->save();

        return response()->json([
            'status_code'    => 200,
            'status_message' => 'Mot de passe réinitialisé avec succès'
        ], 200);
    }

    /**
     * Déconnexion
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * Rafraîchir le token JWT
     */
    public function refresh()
    {
        $token = auth('api')->refresh();
        $user  = auth('api')->user();
        return $this->respondWithToken($token, $user);
    }

    /**
     * Réponse standard avec JWT
     */
    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'abilities'    => $user->role === 'admin' ? ['admin'] : ['user'],
            'user'         => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'role' => $user->role ?? 'user',
                'currency' => $user->currency,
                'language' => $user->language
            ]
        ]);
    }
}
