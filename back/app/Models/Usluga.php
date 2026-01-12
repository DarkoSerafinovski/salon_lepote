<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usluga extends Model
{
    protected $table = 'usluge';

    protected $fillable = [
    'naziv', 'opis', 'kategorija','trajanje_usluge', 'cena'
];



    public function scopeSminkanje($query) {
        return $query->where('kategorija', 'sminkanje');
    }

   
    public function scopeManikir($query) {
        return $query->where('kategorija', 'manikir');
    }

    public function zaposleni() {
        return $this->belongsToMany(User::class, 'usluga_zaposleni', 'usluga_id', 'user_id');
    }

   
    public function getFormatiranaCenaAttribute() {
        return number_format($this->cena, 2, ',', '.') . ' RSD';
    }

   
    public function getFormatiranoTrajanjeAttribute() {
        return $this->trajanje_usluge . ' min';
    }
}
