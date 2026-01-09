<?php

namespace App\Http\Controllers;

use App\Http\Requests\UslugaRequest;
use App\Http\Requests\UslugaFilterRequest;
use App\Http\Resources\UslugaResource;
use App\Http\Services\UslugaService;
use Exception;

class UslugaController extends Controller
{
    protected $uslugaService;

    public function __construct(UslugaService $uslugaService)
    {
        $this->uslugaService = $uslugaService;
    }

    public function store(UslugaRequest $request)
    {
        try {
            $usluga = $this->uslugaService->createUsluga($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Usluga je uspešno kreirana.',
                'data' => $usluga
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

}