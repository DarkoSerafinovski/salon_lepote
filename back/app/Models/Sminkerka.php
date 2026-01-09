<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sminkerka extends Model
{
    protected $table = 'sminkerke';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = ['user_id', 'tip_tehnike'];

    public function zaposleni() {
        return $this->belongsTo(Zaposleni::class, 'user_id', 'user_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
