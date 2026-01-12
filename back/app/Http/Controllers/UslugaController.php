<?php

namespace App\Http\Controllers;


use App\Http\Requests\UslugaRequest;
use App\Http\Requests\UslugaFilterRequest;
use App\Http\Requests\UpdateUslugaRequest;
use App\Http\Resources\UslugaIzmenaResource;
use App\Http\Resources\UslugaResource;
use App\Http\Services\UslugaService;
use App\Http\Services\UslugaOdobravanjeService;
use Illuminate\Support\Facades\Auth;
use Exception;

class UslugaController extends Controller
{
    protected $uslugaService;
    protected $odobravanjeService;

    

   public function __construct(UslugaService $uslugaService,UslugaOdobravanjeService $odobravanjeService)
{
    $this->uslugaService = $uslugaService;
    $this->odobravanjeService = $odobravanjeService;
    
   
}

    public function store(UslugaRequest $request)
    {
        try {
            $usluga = $this->uslugaService->createUsluga($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Usluga je uspešno kreirana.',
                'data' =>  new UslugaResource($usluga)
            ], 201);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom kreiranja usluge.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(UslugaFilterRequest $request)
    {
        try {
            $usluge = $this->uslugaService->getAllUsluge($request->validated());
            return UslugaResource::collection($usluge);
        
      } catch (\Exception $e) {
            return response()->json([
              'success' => false, 
              'error' => $e->getMessage()
            ], 500);
        }
    }




        public function indexIzmene()
    {
        try {
        
            $this->proveriVlasnicu();
            $izmene = $this->uslugaService->getSveIzmeneNaCekanju();

            return UslugaIzmenaResource::collection($izmene);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(UpdateUslugaRequest $request, $id)
    {
        try {
            $rezultat = $this->odobravanjeService->obradiZahtev(
                $id, 
                $request->validated(), 
                Auth::user()
            );

            return response()->json([
                'success' => true,
                'message' => $rezultat['status'] === 'izvrseno' 
                    ? 'Usluga uspešno ažurirana.' 
                    : 'Predlog izmene je poslat vlasnici.',
                'data' => $rezultat['data']
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function odobriMolbu($id)
    {
        try {
            $this->proveriVlasnicu();
            $usluga = $this->odobravanjeService->prihvati($id);

            return response()->json([
                'success' => true,
                'message' => 'Izmena je odobrena. Zaposleni je obavešten putem email-a.',
                'data' => new UslugaResource($usluga)
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function odbijMolbu($id)
    {
        try {
            $this->proveriVlasnicu();
            $this->odobravanjeService->odbaci($id);

            return response()->json([
                'success' => true,
                'message' => 'Predlog izmene je odbijen. Zaposleni je obavešten putem email-a.'
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    private function proveriVlasnicu()
    {
        if (!Auth::user()->isVlasnica()) {
            throw new Exception("Pristup zabranjen. Samo vlasnica može vršiti ovu akciju.", 403);
        }
    }


}