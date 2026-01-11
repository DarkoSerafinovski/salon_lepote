<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Zaposleni;
use App\Models\Usluga;
use Illuminate\Support\Facades\Auth;
class ZaposleniUslugaRequest extends FormRequest
{
    public function authorize(): bool
    {
         return Auth::check() && Auth::user()->isVlasnica();
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:zaposleni,user_id',
            'usluge' => 'present|array', 
            'usluge.*' => 'exists:usluge,id'
        ];
    }


    public function messages(): array
{
    return [
        'user_id.required' => 'Morate izabrati zaposlenog.',
        'user_id.exists' => 'Izabrani zaposleni ne postoji u evidenciji.',

        'usluge.present' => 'Polje za usluge mora biti prisutno u zahtevu (čak i ako je niz prazan).',
        'usluge.array' => 'Usluge moraju biti poslate u formatu niza.',

        'usluge.*.exists' => 'Jedna ili više izabranih usluga ne postoje u bazi podataka.',
    ];
}

    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $zaposleni = Zaposleni::with('user')->find($this->user_id);
            if (!$zaposleni) return;

            foreach ($this->usluge as $uslugaId) {
                $usluga = Usluga::find($uslugaId);
                if ($usluga && !$zaposleni->mozeDaRadi($usluga)) {
                    $validator->errors()->add('usluge', "Radnica ({$zaposleni->user->type}) ne može raditi uslugu: {$usluga->naziv}");
                }
            }
        });
    }
}