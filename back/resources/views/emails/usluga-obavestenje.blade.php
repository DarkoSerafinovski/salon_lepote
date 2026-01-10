<!DOCTYPE html>
<html>
<head>
    <title>{{ $naslov }}</title>
    <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; }
        .stari-podaci { color: #856404; background-color: #fff3cd; }
        .novi-podaci { color: #155724; background-color: #d4edda; font-weight: bold; }
    </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>{{ $naslov }}</h2>
    <p>{{ $poruka }}</p>

    @if(isset($detalji['stari']) && isset($detalji['novi']))
        <h3>Poređenje izmena:</h3>
        <table>
            <thead>
                <tr>
                    <th>Polje</th>
                    <th>Trenutno stanje</th>
                    <th>Predložena izmena</th>
                </tr>
            </thead>
            <tbody>
                @foreach($detalji['novi'] as $kljuc => $novaVrednost)
                    @php 
                        $staraVrednost = $detalji['stari'][$kljuc] ?? '/';
                        $imaPromene = $staraVrednost != $novaVrednost;
                    @endphp
                    <tr>
                        <td><strong>{{ ucfirst(str_replace('_', ' ', $kljuc)) }}</strong></td>
                        <td class="stari-podaci">{{ $staraVrednost }}</td>
                        <td class="novi-podaci" style="{{ $imaPromene ? 'background-color: #d4edda;' : 'background-color: transparent; color: #666;' }}">
                            {{ $novaVrednost }}
                            @if($imaPromene) <span>(IZMENJENO)</span> @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            <ul>
                @foreach($detalji as $kljuc => $vrednost)
                    <li><strong>{{ ucfirst(str_replace('_', ' ', $kljuc)) }}:</strong> {{ $vrednost }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <p style="margin-top: 30px;">Pozdrav,<br><strong>Vaš Salon Sistem</strong></p>
</body>
</html>