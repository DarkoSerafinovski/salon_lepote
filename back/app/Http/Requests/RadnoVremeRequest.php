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
}