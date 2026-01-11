<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

   
    public function rules(): array
    {
        return [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'type' => 'required|string|in:klijent,sminkerka,manikirka',
            'radni_staz' => 'required_if:type,sminkerka,manikirka|nullable|integer|min:0',
            'tip_tehnike' => 'required_if:type,sminkerka|nullable|string',
            'broj_manikir_sertifikata' => 'required_if:type,manikirka|nullable|string',
            'tip_tretmana' => 'required_if:type,manikirka|nullable|string',
        ];
    }



    public function messages(): array
{
    return [
       
        'ime.required' => 'Ime je obavezno polje.',
        'ime.string' => 'Ime mora biti tekstualnog formata.',
        'ime.max' => 'Ime ne može biti duže od 255 karaktera.',
        
        'prezime.required' => 'Prezime je obavezno polje.',
        'prezime.string' => 'Prezime mora biti tekstualnog formata.',
        'prezime.max' => 'Prezime ne može biti duže od 255 karaktera.',

       
        'email.required' => 'Email adresa je obavezna.',
        'email.email' => 'Format email adrese nije validan.',
        'email.unique' => 'Ova email adresa je već zauzeta.',
        'email.max' => 'Email ne može biti duži od 255 karaktera.',

       
        'password.required' => 'Lozinka je obavezna.',
        'password.min' => 'Lozinka mora imati najmanje 8 karaktera.',

      
        'type.required' => 'Tip korisnika je obavezan.',
        'type.in' => 'Izabrani tip korisnika nije validan (dozvoljeni: klijent, sminkerka, manikirka).',

        
        'radni_staz.required_if' => 'Radni staž je obavezan za šminkerke i manikirke.',
        'radni_staz.integer' => 'Radni staž mora biti ceo broj.',
        'radni_staz.min' => 'Radni staž ne može biti negativan broj.',

       
        'tip_tehnike.required_if' => 'Polje tip tehnike je obavezno za šminkerke.',

       
        'broj_manikir_sertifikata.required_if' => 'Broj sertifikata je obavezan za manikirke.',
        'tip_tretmana.required_if' => 'Tip tretmana je obavezan za manikirke.',
    ];
}
}