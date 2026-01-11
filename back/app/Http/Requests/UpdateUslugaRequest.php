<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUslugaRequest extends FormRequest
{
    public function authorize(): bool
    {
       
        return Auth::check() && (Auth::user()->isVlasnica() || Auth::user()->isZaposleni());
    }

    public function rules(): array
    {
        return [
          
            'naziv' => 'required|string|max:255|unique:usluge,naziv,' . $this->route('id'),
            'kategorija' => 'required|string|in:sminkanje,manikir',
            'trajanje_usluge' => 'required|integer|min:15|max:480',
            'cena' => 'required|numeric|min:0',
            'opis' => 'nullable|string|max:1000',
        ];
    }


    public function messages(): array
{
    return [
        'naziv.required' => 'Naziv usluge je obavezan.',
        'naziv.string' => 'Naziv mora biti tekstualnog formata.',
        'naziv.max' => 'Naziv ne može biti duži od 255 karaktera.',
        'naziv.unique' => 'Usluga sa ovim nazivom već postoji.',

       
        'kategorija.required' => 'Morate izabrati kategoriju.',
        'kategorija.string' => 'Kategorija mora biti tekst.',
        'kategorija.in' => 'Kategorija može biti isključivo: sminkanje ili manikir.',

       
        'trajanje_usluge.required' => 'Trajanje usluge je obavezno.',
        'trajanje_usluge.integer' => 'Trajanje mora biti izraženo u minutima (ceo broj).',
        'trajanje_usluge.min' => 'Minimalno trajanje usluge je 15 minuta.',
        'trajanje_usluge.max' => 'Maksimalno trajanje usluge je 480 minuta (8 sati).',

        
        'cena.required' => 'Cena usluge je obavezna.',
        'cena.numeric' => 'Cena mora biti broj (dozvoljene su decimale).',
        'cena.min' => 'Cena ne može biti negativan broj.',

      
        'opis.string' => 'Opis mora biti tekstualnog formata.',
        'opis.max' => 'Opis ne može biti duži od 1000 karaktera.',
    ];
}
}