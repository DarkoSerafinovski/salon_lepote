<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UslugaFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

  public function rules(): array
{
    return [
        'naziv' => 'nullable|string|max:50',
        'kategorija' => 'nullable|string|in:sminkanje,manikir', 
        'max_cena' => 'nullable|numeric|min:0',
        'sort_by' => 'nullable|string|in:naziv,cena,trajanje_usluge',
        'order' => 'nullable|string|in:asc,desc',
        'page' => 'nullable|integer|min:1'
    ];
}


public function messages(): array
{
    return [
        'naziv.string' => 'Filter za naziv mora biti tekstualnog formata.',
        'naziv.max' => 'Filter za naziv ne može biti duži od 50 karaktera.',

        'kategorija.string' => 'Kategorija mora biti tekst.',
        'kategorija.in' => 'Dozvoljene kategorije za filtriranje su: sminkanje ili manikir.',

        'max_cena.numeric' => 'Maksimalna cena mora biti broj.',
        'max_cena.min' => 'Maksimalna cena ne može biti manja od 0.',

        'sort_by.string' => 'Polje za sortiranje mora biti tekst.',
        'sort_by.in' => 'Možete sortirati samo po poljima: naziv, cena ili trajanje_usluge.',

      
        'order.string' => 'Redosled mora biti tekst.',
        'order.in' => 'Redosled može biti samo "asc" (rastući) ili "desc" (opadajući).',

       
        'page.integer' => 'Broj stranice mora biti ceo broj.',
        'page.min' => 'Broj stranice mora biti najmanje 1.',
    ];
}
}