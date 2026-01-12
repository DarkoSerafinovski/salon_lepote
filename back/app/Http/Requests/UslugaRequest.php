<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Exceptions\HttpResponseException;
class UslugaRequest extends FormRequest
{
    public function authorize(): bool
    {
        
        return Auth::check() && Auth::user()->isVlasnica();
    }


  

    public function rules(): array
    {
        return [
            'naziv' => 'required|string|max:255|unique:usluge,naziv',
            'kategorija' => 'required|string|in:sminkanje,manikir',
            'trajanje_usluge' => 'required|integer|min:15|max:480',
            'cena' => 'required|numeric|min:0',
            'opis' => 'nullable|string|max:1000',
        ];
    }


    public function messages(): array
{
    return [
       
        'naziv.required' => 'Morate uneti naziv usluge.',
        'naziv.string' => 'Naziv usluge mora biti tekst.',
        'naziv.max' => 'Naziv usluge može imati najviše 255 karaktera.',
        'naziv.unique' => 'Usluga sa tim nazivom već postoji u sistemu.',

        
        'kategorija.required' => 'Izbor kategorije je obavezan.',
        'kategorija.string' => 'Kategorija mora biti tekstualnog tipa.',
        'kategorija.in' => 'Izabrana kategorija nije validna. Izaberite: sminkanje ili manikir.',

       
        'trajanje_usluge.required' => 'Morate definisati trajanje usluge.',
        'trajanje_usluge.integer' => 'Trajanje usluge mora biti broj minuta (ceo broj).',
        'trajanje_usluge.min' => 'Minimalno trajanje usluge je 15 minuta.',
        'trajanje_usluge.max' => 'Maksimalno trajanje usluge je 480 minuta.',

       
        'cena.required' => 'Cena je obavezno polje.',
        'cena.numeric' => 'Cena mora biti brojčana vrednost.',
        'cena.min' => 'Cena ne može biti manja od 0.',

     
        'opis.string' => 'Opis mora biti tekst.',
        'opis.max' => 'Opis može imati najviše 1000 karaktera.',
    ];
}
}