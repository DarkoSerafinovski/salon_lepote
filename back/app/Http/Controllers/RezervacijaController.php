<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\RezervacijaService;
use App\Http\Services\RezervacijaManager;
use App\Http\Resources\RezervacijaResource;
use App\Http\Requests\StoreRezervacijaRequest;
use Illuminate\Http\Request;
use Exception;

class RezervacijaController extends Controller

{

      protected $rezervacijaService;
      protected $manager;

      public function __construct(RezervacijaService $rezervacijaService,RezervacijaManager $manager)
{
    $this->rezervacijaService = $rezervacijaService;
    $this->manager = $manager;
    
   
}


    public function rezervacijeKlijenta()
    {
        try{
            $this->proveraKlijenta();
            $rezervacije = $this->manager->rezervacijeKlijenta(Auth::user());
            return RezervacijaResource::collection($rezervacije);
        }catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom prikaza rezervacija ulogovanog klijenta.',
                'error' => $e->getMessage()
            ], 500);
        }
        
    }


    public function getTermini(Request $request)
    {
         try {
           
        return response()->json(
            $this->rezervacijaService->generisiSlobodneTermine(
                $request->usluga_id, 
                $request->datum
            ));
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom prihvatanja termina.',
                'error' => $e->getMessage()
            ], 500);
        }

    }

public function store(StoreRezervacijaRequest $request)
{
    try {
        $rezervacija = $this->manager->zakazi($request->validated(), Auth::user());
        return new RezervacijaResource($rezervacija);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Termin više nije dostupan ili je došlo do greške.',
            'error' => $e->getMessage()
        ], 422); 
    }
    
}


public function dnevniRasporedObaveza(Request $request)
{
    try {
       $this->proveraZaposlenog();
        $request->validate([
        'datum' => 'nullable|date_format:Y-m-d',
         ]);
        $datum = $request->query('datum', now()->format('Y-m-d'));
        $rezervacije = $this->rezervacijaService->dohvatiRasporedZaZaposlenog(Auth::user(), $datum);
        if ($rezervacije->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Trenutno nemate nijednu obavezu za ovaj dan. Uživajte!'
            ]);
        }
        return RezervacijaResource::collection($rezervacije);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Greška pri učitavanju rasporeda.',
            'error' => $e->getMessage()
        ], 500);
    }
}



public function destroy($id)
{
    try {
        $this->manager->otkaziRezervaciju($id, Auth::user());
        return response()->json([
            'success' => true, 
            'message' => 'Rezervacija uspešno otkazana. Zaposleni je obavešten.'
        ]);
    } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom otkazivanja termina rezervacije.',
                'error' => $e->getMessage()
            ], 500);
        }
}

    private function proveraKlijenta(){
        if (!Auth::user()->isKlijent()) {
                throw new Exception("Pristup zabranjen. Samo klijent može vršiti ovu akciju.", 403);
            }
    }


    private function proveraZaposlenog(){
        if (!Auth::user()->isZaposleni()) {
                throw new Exception("Pristup zabranjen. Samo zaposleni može vršiti ovu akciju.", 403);
            }
    }

}