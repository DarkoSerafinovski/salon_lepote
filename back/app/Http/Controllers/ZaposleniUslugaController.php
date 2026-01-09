<?php

namespace App\Http\Controllers;

use App\Http\Requests\ZaposleniUslugaRequest;
use App\Http\Services\ZaposleniService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UslugaResource;

use Illuminate\Http\Request;

class ZaposleniUslugaController extends Controller
{
    protected $zaposleniService;

    public function __construct(ZaposleniService $service)
    {
        $this->zaposleniService = $service;
    }

  
  public function show($userId)
    {
        try {
            if (!Auth::user()->isVlasnica()) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Pristup zabranjen. Samo vlasnica može pregledati tuđe usluge.'
                ], 403);
            }

            $usluge = $this->zaposleniService->getUslugeZaposlenog($userId);
            return UslugaResource::collection($usluge);

        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function mojeUsluge()
    {
        try {
            $user = Auth::user();
            if (!$user->isZaposleni()) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Ova opcija je dostupna samo zaposlenima.'
                ], 403);
            }

           
            $usluge = $this->zaposleniService->getUslugeZaposlenog($user->id);
            return UslugaResource::collection($usluge);

        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => $e->getMessage()
            ], 500);
        }
    }

 
    public function store(ZaposleniUslugaRequest $request)
    {
        try {
             $validated = $request->validated();
            $this->zaposleniService->syncUsluge(
                $validated['user_id'], 
                $validated['usluge']
            );

        return response()->json([
            'success' => true,
            'message' => 'Usluge zaposlenog su uspešno ažurirane.'
        ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }
}