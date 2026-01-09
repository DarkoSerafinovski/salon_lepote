<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RadnoVremeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $dani = [
            0 => 'Nedelja', 1 => 'Ponedeljak', 2 => 'Utorak', 
            3 => 'Sreda', 4 => 'Četvrtak', 5 => 'Petak', 6 => 'Subota'
        ];

        return [
            'dan_id' => $this->dan_u_nedelji,
            'dan_naziv' => $dani[$this->dan_u_nedelji],
            'radi' => (bool)$this->radi,
            'vreme_od' =>  $this->vreme_od ? $this->vreme_od->format('H:i') : null,
            'vreme_do' =>  $this->vreme_do ? $this->vreme_do->format('H:i') : null,
        ];
    }
}