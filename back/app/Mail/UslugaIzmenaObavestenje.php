<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UslugaIzmenaObavestenje extends Mailable
{
    use Queueable, SerializesModels;

    public $naslov;
    public $poruka;
    public $detalji;

    public function __construct($naslov, $poruka, $detalji = [])
    {
        $this->naslov = $naslov;
        $this->poruka = $poruka;
        $this->detalji = $detalji;
    }

    public function build()
    {
        return $this->subject($this->naslov)
                    ->view('emails.usluga-obavestenje');
    }
}