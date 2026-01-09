<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NedeljniRasporedResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'zaposleni' => $this->zaposleni->ime . ' ' . $this->zaposleni->prezime,
            'user_id'   => $this->user_id,
            'vreme_od'  => $this->vreme_od->format('H:i'),
            'vreme_do'  => $this->vreme_do->format('H:i'),
        ];
    }
}