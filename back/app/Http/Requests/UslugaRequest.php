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


    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Pristup odbijen. Samo vlasnica salona ima dozvolu za upravljanje uslugama.'
        ], 403));
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
}