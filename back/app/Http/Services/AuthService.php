<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\Zaposleni;
use App\Models\Sminkerka;
use App\Models\Manikirka;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function registerUser(array $data) : array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'ime' => $data['ime'],
                'prezime' => $data['prezime'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'type' => $data['type'],
            ]);

            $isRadnica = in_array($data['type'], ['sminkerka', 'manikirka']);

            if ($isRadnica) {
                Zaposleni::create([
                    'user_id' => $user->id,
                    'radni_staz' => $data['radni_staz'] ?? 0,
                ]);

                match ($data['type']) {
                    'sminkerka' => Sminkerka::create([
                        'user_id' => $user->id, 
                        'tip_tehnike' => $data['tip_tehnike']
                    ]),
                    'manikirka' => Manikirka::create([
                        'user_id' => $user->id,
                        'broj_manikir_sertifikata' => $data['broj_manikir_sertifikata'],
                        'tip_tretmana' => $data['tip_tretmana'],
                    ]),
                };
                
                return ['user' => $user, 'token' => null];
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            return ['user' => $user, 'token' => $token];
        });
    }
}