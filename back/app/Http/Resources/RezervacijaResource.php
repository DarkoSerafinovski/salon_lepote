<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RezervacijaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'vreme_od' => $this->vreme_od->format('d.m.Y H:i'),
            'vreme_do' => $this->vreme_do->format('d.m.Y H:i'),
            'datum' => $this->vreme_od->format('d.m.Y'),
            'satnica' => $this->vreme_od->format('H:i') . ' - ' . $this->vreme_do->format('H:i'),
            'usluga' => [
                'id' => $this->usluga->id,
                'naziv' => $this->usluga->naziv,
                'cena' => $this->usluga->formatirana_cena,
                'trajanje' => $this->usluga->trajanje_usluge . ' min',
            ],

           
            'zaposleni' => [
                'ime_prezime' => $this->zaposleni->user->ime . ' ' . $this->zaposleni->user->prezime,
                'tip' => ucfirst($this->zaposleni->user->type),
            ],

          
            'moze_se_otkazati' => $this->vreme_od->isFuture() && $this->status === 'potvrdjena',
        ];
    }
}