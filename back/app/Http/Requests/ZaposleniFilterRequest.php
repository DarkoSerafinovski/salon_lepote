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
}