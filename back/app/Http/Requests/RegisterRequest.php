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
}