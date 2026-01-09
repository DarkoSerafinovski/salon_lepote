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
}