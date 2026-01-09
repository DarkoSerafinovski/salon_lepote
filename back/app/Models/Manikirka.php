<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manikirka extends Model
{
    protected $table = 'manikirke';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = ['user_id', 'broj_manikir_sertifikata', 'tip_tretmana'];


    public function zaposleni() {
        return $this->belongsTo(Zaposleni::class, 'user_id', 'user_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
