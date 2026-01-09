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
        return $this->belongsTo(User::class, 'zaposleni_id');
    }

    public function usluga() {
        return $this->belongsTo(Usluga::class);
    }

   
    public function scopeIstekle($query) {
        return $query->where('status', 'u_obradi')->where('istice', '<', now());
    }



    public function jePotvrdjena() {
    return $this->status === 'potvrdjena';
}

    public function jeUTokuObrade() {
        return $this->status === 'u_obradi' && $this->istice > now();
    }


public function getPreostaloSekundiAttribute() {
    if ($this->status !== 'u_obradi' || !$this->istice) return 0;
    return max(0, now()->diffInSeconds($this->istice, false));
}


}
