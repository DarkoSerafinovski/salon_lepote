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
        Schema::create('usluga_izmene', function (Blueprint $table) {
        $table->id();
        $table->foreignId('usluga_id')->constrained('usluge')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users'); 
        $table->json('novo'); 
        $table->enum('status', ['na_cekanju', 'odobreno', 'odbijeno'])->default('na_cekanju');
        $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usluga_izmene');
    }
};
