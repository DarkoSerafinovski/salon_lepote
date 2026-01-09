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
}