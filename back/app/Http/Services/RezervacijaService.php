<?php

namespace App\Http\Services;

use App\Models\Rezervacija;
use App\Models\Usluga;
use App\Models\Zaposleni;
use App\Models\RadnoVreme;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Exception;

class RezervacijaService
{
    public function validirajDostupnostSalona(Usluga $usluga, Carbon $datumVreme)
    {
        $danUNedelji = $datumVreme->dayOfWeek;

        $radnaVremena = RadnoVreme::where('dan_u_nedelji', $danUNedelji)
            ->where('radi', true)
            ->get();

        if ($radnaVremena->isEmpty()) {
            throw new Exception("Izabranog dana (" . $datumVreme->format('d.m.Y') . ") salon ne radi.", 404);
        }

        
        $imaLiRadnikaKategorije = Zaposleni::whereHas('user', function($q) use ($usluga) {
                $q->where('type', $usluga->kategorija == 'sminkanje' ? 'sminkerka' : 'manikirka');
            })
            ->whereHas('radnoVreme', function($q) use ($danUNedelji) {
                $q->where('dan_u_nedelji', $danUNedelji)->where('radi', true);
            })->exists();

        if (!$imaLiRadnikaKategorije) {
            throw new Exception("Trenutno nema dostupnih zaposlenih za kategoriju '{$usluga->kategorija}'.", 404);
        }

        return $radnaVremena; 
    }

    public function generisiSlobodneTermine(int $uslugaId, string $datum)
    {
       
        $usluga = Usluga::findOrFail($uslugaId);
        $dan = Carbon::parse($datum);

        $radnaVremena = $this->validirajDostupnostSalona($usluga, $dan);

        $startSalona = $radnaVremena->min('vreme_od')->format('H:i');
        $endSalona = $radnaVremena->max('vreme_do')->format('H:i');

        $period = CarbonPeriod::since($dan->copy()->setTimeFrom($startSalona))
            ->minutes(15)
            ->until($dan->copy()->setTimeFrom($endSalona)->subMinutes($usluga->trajanje_usluge));

        $slobodniSlotovi = [];
        foreach ($period as $slot) {
            $radnik = $this->pronadjiSlobodnogZaposlenog($usluga, $slot);
            if ($radnik) {
                $slobodniSlotovi[] = ['vreme' => $slot->format('H:i'), 'dostupno' => true];
            }
        }

        if (empty($slobodniSlotovi)) {
            throw new Exception("Nažalost, svi termini za ovaj dan su popunjeni.", 404);
        }

        return $slobodniSlotovi;
    }

 
    public function pronadjiSlobodnogZaposlenog(Usluga $usluga, Carbon $pocetak)
    {
        $kraj = $pocetak->copy()->addMinutes($usluga->trajanje_usluge);
        $danUNedelji = $pocetak->dayOfWeek;
        $kandidati = Zaposleni::whereHas('user', function($q) use ($usluga) {
            $q->where('type', $usluga->kategorija == 'sminkanje' ? 'sminkerka' : 'manikirka');
        })->get();

        foreach ($kandidati as $radnik) {
            $rv = RadnoVreme::where('user_id', $radnik->user_id)
                ->where('dan_u_nedelji', $danUNedelji)
                ->where('radi', true)
                ->first();

            if (!$rv) continue;

            $rvStart = $pocetak->copy()->setTimeFrom($rv->vreme_od->format('H:i'));
            $rvEnd = $pocetak->copy()->setTimeFrom($rv->vreme_do->format('H:i'));

            if ($pocetak < $rvStart || $kraj > $rvEnd) continue;

          
            $zauzet = Rezervacija::where('zaposleni_id', $radnik->user_id)
                ->where(function($q) use ($pocetak, $kraj) {
                    $q->where('vreme_od', '<', $kraj)
                      ->where('vreme_do', '>', $pocetak);
                })
                ->where('status', 'potvrdjena')
                ->exists();

            if (!$zauzet) return $radnik;
        }

        return null;
    }




    public function dohvatiRasporedZaZaposlenog($user, $datum)
{
    return Rezervacija::where('zaposleni_id', $user->id)
        ->whereDate('vreme_od', $datum)
        ->where('status', 'potvrdjena') 
        ->with(['usluga', 'klijent'])    
        ->orderBy('vreme_od', 'asc')    
        ->get();
}
}