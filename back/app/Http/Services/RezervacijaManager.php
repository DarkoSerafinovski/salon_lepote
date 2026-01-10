<?php

namespace App\Http\Services;

use App\Models\Usluga;
use App\Models\Rezervacija;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class RezervacijaManager
{
    protected $service;
    protected $email;

    public function __construct(RezervacijaService $service, EmailService $email)
    {
        $this->service = $service;
        $this->email = $email;
    }

   
public function rezervacijeKlijenta($klijent)
{
    return Rezervacija::where('klijent_id', $klijent->id)
    ->with(['usluga', 'zaposleni.user'])
    ->orderBy('status', 'asc') 
    ->orderBy('vreme_od', 'desc')
    ->get();
}

   public function zakazi(array $data, $klijent)
    {
        return DB::transaction(function () use ($data, $klijent) {
            $usluga = Usluga::findOrFail($data['usluga_id']);
            $pocetak = Carbon::parse($data['datum'] . ' ' . $data['vreme']);
            $vremeDo = $pocetak->copy()->addMinutes($usluga->trajanje_usluge);
            
            $this->service->validirajDostupnostSalona($usluga, $pocetak);
            $this->proveriPreklapanjeKlijenta($klijent->id, $pocetak, $vremeDo);
            
            $radnik = $this->service->pronadjiSlobodnogZaposlenog($usluga, $pocetak);

            if (!$radnik) {
                throw new Exception("Izabrani termin je zauzet. Molimo osvežite kalendar.");
            }

            $rezervacija = Rezervacija::create([
                'klijent_id' => $klijent->id,
                'usluga_id' => $usluga->id,
                'zaposleni_id' => $radnik->user_id,
                'vreme_od' => $pocetak,
                'vreme_do' => $vremeDo,
                'status' => 'potvrdjena'
            ]);

            $this->posaljiObavestenjaObemaStranama(
                $rezervacija->load(['usluga', 'zaposleni.user', 'klijent']),
                "Potvrda rezervacije",
                "Vaš termin je uspešno rezervisan.",
                "Nova rezervacija dodeljena vama",
                "Imate novu zakazanu uslugu u vašem rasporedu."
            );

            return $rezervacija;
        });
    }

    public function otkaziRezervaciju($id, $user)
    {
        return DB::transaction(function () use ($id, $user) {
           
            $rezervacija = Rezervacija::with(['usluga', 'zaposleni.user', 'klijent'])->findOrFail($id);
            if ($rezervacija->klijent_id !== $user->id) {
                throw new Exception("Nemate ovlašćenje da otkažete ovu rezervaciju.");
            }

            if ($rezervacija->vreme_od->isPast()) {
                throw new Exception("Ne možete otkazati termin koji je već prošao.");
            }

            if ($rezervacija->status === 'otkazana') {
                throw new Exception("Ova rezervacija je već otkazana.");
            }
       
            $rezervacija->update(['status' => 'otkazana']);
            $this->posaljiObavestenjaObemaStranama(
                $rezervacija,
                "Otkazivanje rezervacije",
                "Uspešno ste otkazali vaš termin.",
                "Otkazan termin u vašem rasporedu",
                "Klijent je otkazao zakazani termin."
            );
            return $rezervacija;
        });
    }

   
    private function posaljiObavestenjaObemaStranama(Rezervacija $rez, $naslovKlijent, $porukaKlijent, $naslovRadnik, $porukaRadnik)
    {
        
        $this->email->posaljiObavestenje(
            $rez->klijent->email,
            $naslovKlijent,
            $porukaKlijent,
            [
                'Usluga' => $rez->usluga->naziv,
                'Vreme' => $rez->vreme_od->format('d.m.Y H:i'),
                'Zaposleni' => $rez->zaposleni->user->ime . ' ' . $rez->zaposleni->user->prezime,
                'Status' => strtoupper($rez->status)
            ]
        );

      
        $this->email->posaljiObavestenje(
            $rez->zaposleni->user->email,
            $naslovRadnik,
            $porukaRadnik,
            [
                'Klijent' => $rez->klijent->ime . ' ' . $rez->klijent->prezime,
                'Usluga' => $rez->usluga->naziv,
                'Vreme' => $rez->vreme_od->format('d.m.Y H:i'),
                'Status' => strtoupper($rez->status)
            ]
        );
    }

    private function proveriPreklapanjeKlijenta($klijentId, $pocetak, $kraj)
    {
        $imaPreklapanje = Rezervacija::where('klijent_id', $klijentId)
            ->where('status', 'potvrdjena')
            ->where(function ($q) use ($pocetak, $kraj) {
                $q->where('vreme_od', '<', $kraj)
                ->where('vreme_do', '>', $pocetak);
            })->exists();

        if ($imaPreklapanje) {
            throw new Exception("Već imate zakazan termin u ovom vremenskom periodu.");
        }
    }


   

}