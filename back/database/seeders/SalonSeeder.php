<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Usluga;
use App\Models\Zaposleni;
use App\Models\Sminkerka;
use App\Models\Manikirka;
use App\Models\RadnoVreme;
use Illuminate\Support\Facades\Hash;

class SalonSeeder extends Seeder
{
    public function run(): void
    {
       
        $usluge = [
           
            ['naziv' => 'Dnevna šminka', 'kategorija' => 'sminkanje', 'trajanje_usluge' => 45, 'cena' => 3000, 'opis' => 'Suptilan izgled za poslovne prilike.'],
            ['naziv' => 'Večernja / Glam šminka', 'kategorija' => 'sminkanje', 'trajanje_usluge' => 75, 'cena' => 5000, 'opis' => 'Jača šminka sa konturisanjem i veštačkim trepavicama.'],
            ['naziv' => 'Svadbena šminka (Mlada)', 'kategorija' => 'sminkanje', 'trajanje_usluge' => 120, 'cena' => 8500, 'opis' => 'Dugotrajna šminka sa probom uključenu u cenu.'],
            ['naziv' => 'Maturska šminka', 'kategorija' => 'sminkanje', 'trajanje_usluge' => 60, 'cena' => 4500, 'opis' => 'Moderna šminka prilagođena mladima.'],
            ['naziv' => 'Šminka za fotografisanje', 'kategorija' => 'sminkanje', 'trajanje_usluge' => 90, 'cena' => 6000, 'opis' => 'Tehnike visoke pokrivnosti za studijsko svetlo.'],

          
            ['naziv' => 'Estetski manikir + Gel lak', 'kategorija' => 'manikir', 'trajanje_usluge' => 60, 'cena' => 2200, 'opis' => 'Sređivanje zanoktica i bojenje trajnim lakom.'],
            ['naziv' => 'Ojačavanje prirodnih noktiju', 'kategorija' => 'manikir', 'trajanje_usluge' => 90, 'cena' => 2800, 'opis' => 'Nanošenje čvrstog gela na prirodnu dužinu.'],
            ['naziv' => 'Izlivanje noktiju (S/M dužina)', 'kategorija' => 'manikir', 'trajanje_usluge' => 135, 'cena' => 3800, 'opis' => 'Produžavanje noktiju pomoću šablona.'],
            ['naziv' => 'Korekcija gela', 'kategorija' => 'manikir', 'trajanje_usluge' => 105, 'cena' => 3000, 'opis' => 'Dopuna i promena dizajna nakon 3-4 nedelje.'],
            ['naziv' => 'Spa Pedikir', 'kategorija' => 'manikir', 'trajanje_usluge' => 60, 'cena' => 2500, 'opis' => 'Tretman stopala sa pilingom i gel lakom.'],
        ];

        foreach ($usluge as $u) { 
            Usluga::create($u); 
        }

       
        $radniciPodaci = [
            ['ime' => 'Jovana', 'prezime' => 'Makić', 'type' => 'sminkerka', 'smena' => 'prva', 'tehnika' => 'Airbrush & Bridal specialist'],
            ['ime' => 'Ana', 'prezime' => 'Božić', 'type' => 'sminkerka', 'smena' => 'druga', 'tehnika' => 'Editorial & Glam expert'],
            ['ime' => 'Milica', 'prezime' => 'Noktić', 'type' => 'manikirka', 'smena' => 'prva', 'sertifikat' => 'SRB-992-23'],
            ['ime' => 'Sanja', 'prezime' => 'Lakić', 'type' => 'manikirka', 'smena' => 'druga', 'sertifikat' => 'EU-102-24'],
        ];

        foreach ($radniciPodaci as $rp) {
            $user = User::create([
                'ime' => $rp['ime'],
                'prezime' => $rp['prezime'],
                'email' => strtolower($rp['ime']) . '@salon.com',
                'password' => Hash::make('password'),
                'type' => $rp['type']
            ]);

            $zaposleniProfil = Zaposleni::create([
                'user_id' => $user->id, 
                'radni_staz' => rand(2, 10)
            ]);

            if ($rp['type'] === 'sminkerka') {
                Sminkerka::create([
                    'user_id' => $user->id, 
                    'tip_tehnike' => $rp['tehnika']
                ]);
               
                $zaposleniProfil->usluge()->attach(
                    Usluga::where('kategorija', 'sminkanje')->pluck('id')
                );
            } else {
                Manikirka::create([
                    'user_id' => $user->id, 
                    'broj_manikir_sertifikata' => $rp['sertifikat'], 
                    'tip_tretmana' => 'Gel, Akril, Polygel'
                ]);
               
                $zaposleniProfil->usluge()->attach(
                    Usluga::where('kategorija', 'manikir')->pluck('id')
                );
            }

          
            for ($dan = 0; $dan <= 6; $dan++) {
                $radi = ($dan >= 1 && $dan <= 6); 
                $vremeOd = null; $vremeDo = null;

                if ($radi) {
                    if ($rp['smena'] === 'prva') {
                        $vremeOd = '08:00:00'; $vremeDo = '14:00:00';
                    } else {
                        $vremeOd = '14:00:00'; $vremeDo = '20:00:00';
                    }
                }

                RadnoVreme::create([
                    'user_id' => $user->id,
                    'dan_u_nedelji' => $dan,
                    'vreme_od' => $vremeOd,
                    'vreme_do' => $vremeDo,
                    'radi' => $radi
                ]);
            }
        }

       
        $klijenti = [
            ['ime' => 'Milena', 'prezime' => 'Jović', 'email' => 'milena@test.com'],
            ['ime' => 'Sara', 'prezime' => 'Popović', 'email' => 'sara@test.com'],
            ['ime' => 'Tanja', 'prezime' => 'Ristić', 'email' => 'tanja@test.com'],
            ['ime' => 'Ivana', 'prezime' => 'Nikolić', 'email' => 'ivana@test.com'],
            ['ime' => 'Dunja', 'prezime' => 'Mitić', 'email' => 'dunja@test.com'],
        ];

        foreach ($klijenti as $k) {
            User::create([
                'ime' => $k['ime'],
                'prezime' => $k['prezime'],
                'email' => $k['email'],
                'password' => Hash::make('password'),
                'type' => 'klijent'
            ]);
        }

         User::create([
                'ime' => "Ana",
                'prezime' => "Marjanovic",
                'email' => 'admin@salon.com',
                'password' => Hash::make('password'),
                'type' => 'vlasnica'
            ]);

        
    }
}