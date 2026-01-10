<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetSlobodniTerminiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isKlijent();
    }

    public function rules(): array
    {
        return [
            'usluga_id' => 'required|integer|exists:usluge,id',
            'datum' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'usluga_id.required' => 'Identifikator usluge je obavezan.',
            'usluga_id.exists' => 'Izabrana usluga ne postoji.',
            'datum.required' => 'Morate izabrati datum.',
            'datum.after_or_equal' => 'Ne možete gledati termine za prošlost.',
        ];
    }
}