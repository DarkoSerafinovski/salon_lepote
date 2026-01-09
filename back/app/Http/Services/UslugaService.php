<?php

namespace App\Http\Services;

use App\Models\Usluga;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class UslugaService
{


    public function getAllUsluge(array $filters): LengthAwarePaginator
{
    $query = Usluga::query();

    
    $query->when(isset($filters['naziv']), function ($q) use ($filters) {
        $q->where('naziv', 'LIKE', '%' . $filters['naziv'] . '%');
    });

    
    $query->when(isset($filters['kategorija']), function ($q) use ($filters) {
        if ($filters['kategorija'] === 'sminkanje') {
            return $q->sminkanje();
        }
        if ($filters['kategorija'] === 'manikir') {
            return $q->manikir();   
        }
    });

    
    $query->when(isset($filters['max_cena']), function ($q) use ($filters) {
        $q->where('cena', '<=', $filters['max_cena']);
    });

    
    $sortField = $filters['sort_by'] ?? 'naziv';
    $sortOrder = $filters['order'] ?? 'asc'; 
    
    $allowedFields = ['naziv', 'cena', 'trajanje_usluge'];
    if (in_array($sortField, $allowedFields)) {
        $query->orderBy($sortField, $sortOrder === 'desc' ? 'desc' : 'asc');
    }

    return $query->paginate(10);
}

    public function createUsluga(array $data): Usluga
    {
        return Usluga::create($data);
    }
}