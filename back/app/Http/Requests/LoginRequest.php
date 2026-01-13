<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

   public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6',
        ];
    }


    public function messages(): array
    {
        return [
            'email.required' => 'Email adresa je obavezna.',
            'email.email' => 'Format email adrese nije validan.',
            'email.exists' => 'Korisnik sa ovom email adresom ne postoji u našem sistemu.',
            'password.required' => 'Lozinka je obavezna.',
            'password.min' => 'Lozinka mora imati najmanje 6 karaktera.',
        ];
    }
}
