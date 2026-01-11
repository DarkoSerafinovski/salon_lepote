<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RadnoVreme extends Model
{

    protected $table = 'radno_vreme';

     protected $fillable = [
    'user_id', 'dan_u_nedelji', 'vreme_od', 'vreme_do', 'radi'
];

    protected $casts = [
        'radi' => 'boolean',
        'vreme_od' => 'datetime:H:i',
        'vreme_do' => 'datetime:H:i',
    ];

    public function zaposleni() {
        return $this->belongsTo(User::class, 'user_id');
    }
   

   

    
}
