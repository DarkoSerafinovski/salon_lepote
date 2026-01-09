<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UslugaController;
use App\Http\Controllers\RadnoVremeController;
use App\Http\Controllers\ZaposleniUslugaController;
use App\Http\Controllers\ZaposleniController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/usluge', [UslugaController::class, 'index']);
    Route::post('/usluge', [UslugaController::class, 'store']);
    Route::post('/radno-vreme', [RadnoVremeController::class, 'store']);
    Route::get('/radno-vreme/raspored', [RadnoVremeController::class, 'index']);
    Route::get('/moj-raspored', [RadnoVremeController::class, 'mojRaspored']);
    Route::get('/zaposleni/{id}/usluge', [ZaposleniUslugaController::class, 'show']);
    Route::get('/zaposleni/moje-usluge', [ZaposleniUslugaController::class, 'mojeUsluge']);
    Route::post('/zaposleni/usluge', [ZaposleniUslugaController::class, 'store']);
    Route::get('/zaposleni', [ZaposleniController::class, 'index']);
    Route::put('/usluge/{id}', [UslugaController::class, 'update']);
    Route::get('/usluge-izmene', [UslugaController::class, 'indexIzmene']);
    Route::post('/usluge-izmene/{id}/odobri', [UslugaController::class, 'odobriMolbu']);
    Route::post('/usluge-izmene/{id}/odbij', [UslugaController::class, 'odbijMolbu']);

});

