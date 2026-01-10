<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    protected $table = 'rezervacije';

    protected $fillable = [
    'klijent_id', 'usluga_id', 'zaposleni_id', 
    'vreme_od', 'vreme_do', 'status', 'istice'
];
   
    protected $casts = [
        'vreme_od' => 'datetime',
        'vreme_do' => 'datetime',
        'istice' => 'datetime',
    ];

    public function klijent() {
        return $this->belongsTo(User::class, 'klijent_id');
    }

    public function zaposleni() {
       return $this->belongsTo(Zaposleni::class, 'zaposleni_id', 'user_id');
    }

    public function usluga() {
        return $this->belongsTo(Usluga::class);
    }

   
    public function jePotvrdjena() {
    return $this->status === 'potvrdjena';
}

   



}
