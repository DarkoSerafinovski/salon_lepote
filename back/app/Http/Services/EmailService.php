<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\UslugaIzmenaObavestenje;
use App\Models\User;

class EmailService
{
    public function posaljiObavestenje(string $primilacEmail, string $naslov, string $poruka, array $detalji = [])
    {
        Mail::to($primilacEmail)->send(new UslugaIzmenaObavestenje($naslov, $poruka, $detalji));
    }

   
    public function getVlasnicaEmail()
    {
        return User::where('type', 'vlasnica')->first()->email;
    }
}