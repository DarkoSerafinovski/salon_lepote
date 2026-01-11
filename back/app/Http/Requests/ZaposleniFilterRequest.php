<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
class ZaposleniFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
         return Auth::check() && Auth::user()->isVlasnica();
    }

    public function rules(): array
    {
        return [
            'ime' => 'nullable|string|max:50',
            'prezime' => 'nullable|string|max:50',
            'email' => 'nullable|string',
            'type' => 'nullable|in:sminkerka,manikirka',
            'min_staz' => 'nullable|integer|min:0',
            'sort_by' => 'nullable|in:ime,prezime,email,type,radni_staz',
            'order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:50'
        ];
    }


        public function messages(): array
    {
        return [
            'ime.string' => 'Filter za ime mora biti tekstualnog formata.',
            'ime.max' => 'Ime za pretragu ne može biti duže od 50 karaktera.',
            'prezime.string' => 'Filter za prezime mora biti tekstualnog formata.',
            'prezime.max' => 'Prezime za pretragu ne može biti duže od 50 karaktera.',

            'email.string' => 'Email za pretragu mora biti tekst.',
            'type.in' => 'Tip zaposlenog može biti samo: sminkerka ili manikirka.',

        
            'min_staz.integer' => 'Minimalni radni staž mora biti ceo broj.',
            'min_staz.min' => 'Radni staž za filtriranje ne može biti negativan broj.',

        
            'sort_by.in' => 'Dozvoljena polja za sortiranje su: ime, prezime, email, type ili radni_staz.',
            'order.in' => 'Smer sortiranja mora biti "asc" (rastući) ili "desc" (opadajući).',

        
            'per_page.integer' => 'Broj rezultata po stranici mora biti broj.',
            'per_page.min' => 'Minimalan broj rezultata po stranici je 1.',
            'per_page.max' => 'Maksimalan broj rezultata po stranici je 50.',
        ];
    }
}