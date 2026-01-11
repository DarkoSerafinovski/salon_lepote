<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RadnoVremeRequest extends FormRequest
{
    public function authorize(): bool
    {
      
        return Auth::check() && Auth::user()->isVlasnica();
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'raspored' => 'required|array|min:7|max:7', 
            'raspored.*.dan_u_nedelji' => 'required|integer|between:0,6',
            'raspored.*.radi' => 'required|boolean',
            'raspored.*.vreme_od' => 'required_if:raspored.*.radi,true|nullable|date_format:H:i',
            'raspored.*.vreme_do' => 'required_if:raspored.*.radi,true|nullable|date_format:H:i|after:raspored.*.vreme_od',
        ];
    }


    public function messages(): array
{
    return [
        
        'user_id.required' => 'Identifikator korisnika je obavezan.',
        'user_id.exists' => 'Odabrani korisnik ne postoji u bazi.',

        'raspored.required' => 'Morate poslati raspored.',
        'raspored.array' => 'Raspored mora biti u formatu niza.',
        'raspored.min' => 'Raspored mora sadržati tačno 7 dana.',
        'raspored.max' => 'Raspored mora sadržati tačno 7 dana.',

        'raspored.*.dan_u_nedelji.required' => 'Dan u nedelji je obavezan za svaku stavku.',
        'raspored.*.dan_u_nedelji.integer' => 'Dan mora biti ceo broj.',
        'raspored.*.dan_u_nedelji.between' => 'Dan mora biti u opsegu od 0 do 6.',

        'raspored.*.radi.required' => 'Polje "radi" je obavezno.',
        'raspored.*.radi.boolean' => 'Polje "radi" mora biti logičkog tipa (true/false).',

        'raspored.*.vreme_od.required_if' => 'Vreme od je obavezno ako je označen radni dan.',
        'raspored.*.vreme_od.date_format' => 'Format vremena mora biti HH:mm (npr. 08:00).',

        'raspored.*.vreme_do.required_if' => 'Vreme do je obavezno ako je označen radni dan.',
        'raspored.*.vreme_do.date_format' => 'Format vremena mora biti HH:mm.',
        'raspored.*.vreme_do.after' => 'Vreme "do" mora biti nakon vremena "od".',
    ];
}



}