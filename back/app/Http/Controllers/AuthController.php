<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

   
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
          
            if (in_array($request->type, ['sminkerka', 'manikirka'])) {
                $vlasnica = Auth::guard('sanctum')->user();
                if (!$vlasnica || !$vlasnica->isVlasnica() ) {
                    return response()->json(['success' => false, 'message' => 'Samo vlasnica dodaje radnice.'], 403);
                }
            }

           
            $result = $this->authService->registerUser($request->validated());

            return response()->json([
                'success' => true,
                'data' => $result['user'],
                'access_token' => $result['token'],
                'token_type' => $result['token'] ? 'Bearer' : null
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        
        if (!Auth::attempt($request->validated())) {
            return response()->json(['success' => false], 401);
        }

        $user = Auth::user(); 
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'type' => $user->type
        ]);
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();
        return response()->json(['message' => 'Uspesno ste se izlogovali!!!!']);
    }
}