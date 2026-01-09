<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UslugaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
       return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'kategorija' => $this->kategorija,
            'trajanje' => $this->formatirano_trajanje, 
            'cena_formatirano' => $this->formatirana_cena,
            'cena_raw' => (float) $this->cena, 
            'opis' => $this->opis,
        ];
    }
}