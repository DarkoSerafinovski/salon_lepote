<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UslugaIzmena extends Model
{
    protected $table = 'usluga_izmene';
    protected $fillable = ['usluga_id', 'user_id', 'novi_podaci', 'status'];
    
    protected $casts = [
        'novi_podaci' => 'array'
    ];

    public function usluga() { return $this->belongsTo(Usluga::class); }
    public function zaposleni() { return $this->belongsTo(User::class, 'user_id'); }
}