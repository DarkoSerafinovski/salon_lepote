<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UslugaController;
use App\Http\Controllers\RadnoVremeController;
use App\Http\Controllers\ZaposleniUslugaController;
use App\Http\Controllers\ZaposleniController;
use App\Http\Controllers\RezervacijaController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/usluge', [UslugaController::class, 'index']);
    Route::put('/usluge/{id}', [UslugaController::class, 'update']);
     Route::get('/rezervacije/slobodni-termini', [RezervacijaController::class, 'getTermini']);


    Route::prefix('vlasnica')->group(function () {
         Route::post('/usluge', [UslugaController::class, 'store']);
         Route::get('/usluge-izmene', [UslugaController::class, 'indexIzmene']);
         Route::post('/usluge-izmene/{id}/odobri', [UslugaController::class, 'odobriMolbu']);
         Route::post('/usluge-izmene/{id}/odbij', [UslugaController::class, 'odbijMolbu']);
         Route::post('/zaposleni/usluge', [ZaposleniUslugaController::class, 'store']);
         Route::get('/zaposleni', [ZaposleniController::class, 'index']);
         Route::get('/zaposleni/{id}/usluge', [ZaposleniUslugaController::class, 'show']);
         Route::post('/radno-vreme', [RadnoVremeController::class, 'store']);
         Route::get('/radno-vreme/raspored', [RadnoVremeController::class, 'index']);
         Route::get('/radno-vreme/raspored/{zaposleniId}', [RadnoVremeController::class, 'nedeljniRasporedZaposlenog']);
         
    });

    Route::prefix('zaposleni')->group(function () {
        Route::get('/moj-raspored-smena', [RadnoVremeController::class, 'mojRaspored']);
        Route::get('/moj-raspored-obaveza', [RezervacijaController::class, 'dnevniRasporedObaveza']);
        Route::get('/moje-usluge', [ZaposleniUslugaController::class, 'mojeUsluge']);
        Route::get('/rezervacije/moj-raspored-obaveza', [RezervacijaController::class, 'dnevniRasporedObaveza']);

    });

    Route::prefix('klijent')->group(function () {
        Route::post('/rezervacije', [RezervacijaController::class, 'store']);
        Route::get('/rezervacije/moje-rezervacije', [RezervacijaController::class, 'rezervacijeKlijenta']);
        Route::delete('/rezervacije/otkazi-rezervaciju/{id}', [RezervacijaController::class, 'destroy']);
    });



   
  
    
    

    
    
    
    
   
   
  

});

