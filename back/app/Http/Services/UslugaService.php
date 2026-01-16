<?php

namespace App\Http\Services;
use App\Models\User;
use App\Models\Usluga;
use App\Models\UslugaIzmena;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Exception;

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

        return $query->paginate(9);
    }

    public function createUsluga(array $data): Usluga
    {
        return Usluga::create($data);
    }


    public function procesuirajIzmenu(int $uslugaId, array $data, User $user)
    {
        if ($user->isVlasnica()) {
            $usluga = Usluga::findOrFail($uslugaId);
            $usluga->update($data);
            return ['status' => 'izvrseno', 'data' => $usluga];
        }

        

        $imaPrisustvo = $user->zaposleni->usluge()
        ->where('usluga_id', $uslugaId)
        ->exists();

        if (!$imaPrisustvo) {
            throw new Exception("Nemate ovlašćenje da predlažete izmene za uslugu koju ne obavljate.");
        }


        $izmena = UslugaIzmena::create([
            'usluga_id' => $uslugaId,
            'user_id' => $user->id,
            'novi_podaci' => $data,
            'status' => 'na_cekanju'
        ]);

        return ['status' => 'predlog_kreiran', 'data' => $izmena];
    }

    public function odobriIzmenu(int $izmenaId)
    {
        return \DB::transaction(function () use ($izmenaId) {
            $izmena = UslugaIzmena::findOrFail($izmenaId);
            $usluga = Usluga::findOrFail($izmena->usluga_id);
            $usluga->update($izmena->novi_podaci);
            $izmena->update(['status' => 'odobreno']);
            return $usluga;
        });
    }


   

    public function getSveIzmeneNaCekanju()
    {
    
        return UslugaIzmena::with(['zaposleni', 'usluga'])
            ->where('status', 'na_cekanju')
            ->orderBy('created_at', 'desc')
            ->get();
    }


        public function odbijIzmenu(int $izmenaId)
    {
        $izmena = UslugaIzmena::findOrFail($izmenaId);
        return $izmena->update(['status' => 'odbijeno']);
    
    }
}