<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UslugaIzmenaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'zaposleni' => $this->zaposleni->ime . ' ' . $this->zaposleni->prezime,
            'originalni_podaci' => new UslugaResource($this->usluga),
            'predlozeni_podaci' => [
                'naziv' => $this->novi_podaci['naziv'],
                'kategorija' => $this->novi_podaci['kategorija'],
                'trajanje_raw' => $this->novi_podaci['trajanje_usluge'], 
                'cena_raw' => (float)$this->novi_podaci['cena'],
                'opis' => $this->novi_podaci['opis'] ?? null,
            ],
            'datum_slanja' => $this->created_at->format('d.m.Y H:i'),
        ];
    }
}