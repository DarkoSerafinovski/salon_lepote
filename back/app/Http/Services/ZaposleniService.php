<?php

namespace App\Http\Services;

use App\Models\Zaposleni;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class ZaposleniService
{
    public function syncUsluge(int $userId, array $uslugaIds)
    {
        $zaposleni = Zaposleni::findOrFail($userId);
        return $zaposleni->usluge()->sync($uslugaIds);
    }

    public function getUslugeZaposlenog(int $userId)
    {
        return Zaposleni::with('usluge')->findOrFail($userId)->usluge;
    }


    public function getAllZaposleni(array $filters): LengthAwarePaginator
    {
        $query = User::whereIn('type', ['sminkerka', 'manikirka'])
                     ->with(['zaposleni.sminkerka', 'zaposleni.manikirka']);

        $query->when(isset($filters['ime']), fn($q) => $q->where('ime', 'LIKE', "%{$filters['ime']}%"));
        $query->when(isset($filters['prezime']), fn($q) => $q->where('prezime', 'LIKE', "%{$filters['prezime']}%"));
        $query->when(isset($filters['email']), fn($q) => $q->where('email', 'LIKE', "%{$filters['email']}%"));
        $query->when(isset($filters['type']), fn($q) => $q->where('type', $filters['type']));

        $query->when(isset($filters['min_staz']), function ($q) use ($filters) {
            $q->whereHas('zaposleni', function ($subQuery) use ($filters) {
                $subQuery->where('radni_staz', '>=', $filters['min_staz']);
            });
        });

        
        $sortField = $filters['sort_by'] ?? 'prezime';
        $sortOrder = $filters['order'] ?? 'asc';

        if ($sortField === 'radni_staz') {
            $query->join('zaposleni', 'users.id', '=', 'zaposleni.user_id')
                  ->select('users.*') 
                  ->orderBy('zaposleni.radni_staz', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }
}