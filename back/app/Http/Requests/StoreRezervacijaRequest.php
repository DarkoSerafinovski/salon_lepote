<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreRezervacijaRequest extends FormRequest
{
   
    public function authorize(): bool
    {
       
        return Auth::check() && Auth::user()->isKlijent();
    }


    public function rules(): array
    {
        return [
            'usluga_id' => 'required|exists:usluge,id',
            'datum' => 'required|date|after_or_equal:today',
            'vreme' => 'required|date_format:H:i',
        ];
    }

   
    public function messages(): array
    {
        return [
            'usluga_id.required' => 'Morate izabrati uslugu.',
            'usluga_id.exists' => 'Izabrana usluga ne postoji u našem sistemu.',
            'datum.required' => 'Datum je obavezan.',
            'datum.after_or_equal' => 'Ne možete rezervisati termin u prošlosti.',
            'vreme.required' => 'Vreme je obavezno.',
            'vreme.date_format' => 'Vreme mora biti u formatu HH:mm.',
        ];
    }
}