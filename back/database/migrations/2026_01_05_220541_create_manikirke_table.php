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
        Schema::create('manikirke', function (Blueprint $table) {
            $table->foreignId('user_id')
                    ->primary()
                    ->constrained('zaposleni', 'user_id')
                    ->onDelete('cascade');
                    
            $table->string('broj_manikir_sertifikata');
            $table->string('tip_tretmana');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manikirke');
    }
};
