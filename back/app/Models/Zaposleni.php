<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zaposleni extends Model
{
    protected $table = 'zaposleni';
    protected $primaryKey = 'user_id';
    public $incrementing = false; 
    protected $keyType = 'int';

    protected $fillable = ['user_id', 'radni_staz'];

    public function user() {
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function rezervacije() {
        return $this->hasMany(Rezervacija::class, 'zaposleni_id', 'user_id');
    }

    public function usluge() {
        return $this->belongsToMany(Usluga::class, 'usluga_zaposleni', 'user_id', 'usluga_id');
    }

    
    public function radnoVreme() {
        return $this->hasMany(RadnoVreme::class, 'user_id', 'user_id');
    }

    public function sminkerka() {
        return $this->hasOne(Sminkerka::class, 'user_id');
    }

    public function manikirka() {
        return $this->hasOne(Manikirka::class, 'user_id');
    }



    public function mozeDaRadi(Usluga $usluga)
{
    $tipRadnika = $this->user->type;
    if ($tipRadnika === 'sminkerka' && $usluga->kategorija === 'sminkanje') {
        return true;
    }
    if ($tipRadnika === 'manikirka' && $usluga->kategorija === 'manikir') {
        return true;
    }
    return false;
}
}
