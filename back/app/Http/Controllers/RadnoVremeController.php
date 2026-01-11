<?php

namespace App\Http\Controllers;

use App\Http\Requests\RadnoVremeRequest;
use App\Http\Services\RadnoVremeService;
use App\Http\Resources\NedeljniRasporedResource;
use App\Http\Resources\RadnoVremeResource;
use Illuminate\Support\Facades\Auth;
use Exception;

class RadnoVremeController extends Controller
{
    protected $radnoVremeService;

    public function __construct(RadnoVremeService $service)
    {
        $this->radnoVremeService = $service;
    }

    public function store(RadnoVremeRequest $request)
    {
        try {
            $raspored = $this->radnoVremeService->sacuvajRaspored($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Radno vreme je uspešno ažurirano.',
                'data' => $raspored
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri čuvanju radnog vremena.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function index()
    {
    try {
        $rasporedPoDanima = $this->radnoVremeService->getNedeljniRaspored();
        $formatiranRaspored = $rasporedPoDanima->map(function ($dani) {
            return NedeljniRasporedResource::collection($dani);
        });

        return response()->json([
            'success' => true,
            'data' => $formatiranRaspored
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}

public function mojRaspored()
{
    try {
        $userId = Auth::id(); 
        $raspored = $this->radnoVremeService->getRasporedZaZaposlenog($userId);

        if ($raspored->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Nije definisano radno vreme za vaš nalog.',
                'data' => []
            ]);
        }

        return RadnoVremeResource::collection($raspored);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}



public function nedeljniRasporedZaposlenog($zaposleniId)
{
    try {
        $this->proveriVlasnicu();
        $raspored = $this->radnoVremeService->getRasporedZaZaposlenog($zaposleniId);

        if ($raspored->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Nije definisano radno vreme za zaposlenog.',
                'data' => []
            ]);
        }

        return RadnoVremeResource::collection($raspored);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}


 private function proveriVlasnicu()
    {
        if (!Auth::user()->isVlasnica()) {
            throw new Exception("Pristup zabranjen. Samo vlasnica može vršiti ovu akciju.", 403);
        }
    }

}