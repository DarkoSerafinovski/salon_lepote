<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ZaposleniResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ime_prezime' => "{$this->ime} {$this->prezime}",
            'email' => $this->email,
            'uloga' => $this->type,
            'radni_staz_godina' => $this->zaposleni->radni_staz ?? 0,
            'dodatne_informacije' => $this->mapSpecificDetails(),
        ];
    }

    private function mapSpecificDetails()
    {
        
        $z = $this->zaposleni;
        if (!$z) return null;

        if ($this->type === 'sminkerka' && $z->sminkerka) {
            return [
                'kategorija' => 'Šminkanje',
                'tehnika' => $z->sminkerka->tip_tehnike
            ];
        }

        if ($this->type === 'manikirka' && $z->manikirka) {
            return [
                'kategorija' => 'Manikir',
                'tretman' => $z->manikirka->tip_tretmana,
                'sertifikati' => $z->manikirka->broj_manikir_sertifikata
            ];
        }

        return null;
    }
}