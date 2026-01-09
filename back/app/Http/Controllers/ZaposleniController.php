<?php

namespace App\Http\Controllers;

use App\Http\Services\ZaposleniService;
use App\Http\Resources\ZaposleniResource;
use App\Http\Requests\ZaposleniFilterRequest;
use Illuminate\Http\Request;

class ZaposleniController extends Controller
{
    protected $zaposleniService;

    public function __construct(ZaposleniService $service)
    {
        $this->zaposleniService = $service;
    }

    public function index(ZaposleniFilterRequest $request)
{
    try {
        $zaposleni = $this->zaposleniService->getAllZaposleni($request->validated());
        return ZaposleniResource::collection($zaposleni);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

  
}