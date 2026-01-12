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
        Schema::table('usluga_izmene', function (Blueprint $table) {
            $table->renameColumn('novo', 'novi_podaci');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usluga_izmene', function (Blueprint $table) {
            $table->renameColumn('novi_podaci', 'novo');
        });
    }
};
