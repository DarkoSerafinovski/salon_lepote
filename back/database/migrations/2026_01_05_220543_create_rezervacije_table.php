<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rezervacije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('klijent_id')->constrained('users');
             $table->foreignId('usluga_id')->constrained('usluge');
             $table->foreignId('zaposleni_id')->nullable()->constrained('users');
             $table->dateTime('vreme_od');
             $table->dateTime('vreme_do');
             $table->enum('status', ['potvrdjena', 'otkazana'])->default('potvrdjena');
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rezervacije');
    }
};
