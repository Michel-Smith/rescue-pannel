<?php

namespace App\Http\Controllers\Rapports;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessRapportPDFGenerator;
use App\Models\Facture;
use App\Models\Rapport;
use Illuminate\Http\Request;
use Illuminate\Redis\Connections\PredisConnection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use TheCodingMachine\Gotenberg\Client;
use TheCodingMachine\Gotenberg\ClientException;
use TheCodingMachine\Gotenberg\DocumentFactory;
use TheCodingMachine\Gotenberg\FilesystemException;
use TheCodingMachine\Gotenberg\HTMLRequest;
use TheCodingMachine\Gotenberg\RequestException;

class ExporterController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('access');
    }

    public function makeRapportPdf(Request $request, int $id){


        $rapport = Rapport::where('id', $id)->first();
        $user = Auth::user()->name;

        $path = '/public/RI/'. $rapport->id . ".pdf";

        if(!Storage::exists($path)){
            $user = $rapport->GetUser->name;
            $rapport = $rapport;


            ob_start();
            require(base_path('/resources/PDF/RI/index.php'));
            $content = ob_get_clean();
            $pdf = App::make('dompdf.wrapper');
            $pdf->loadHTML($content);
            return $pdf->stream();
        }else{
            return \response()->file(Storage::path($path));
        }

    }

    public function makeImpayPdf(Request $request, string $from , string $to){
        //2021-01-05
        $impaye = Facture::where('payed', 0)->where('created_at', '>=', $from)->where('created_at', '<=', $to)->orderBy('id', 'desc')->get();

        $infos = ['from'=>date('d/m/Y', strtotime($from)),'to'=>date('d/m/Y', strtotime($to))];
        $data = ['infos'=>$infos, 'impaye'=>$impaye];

        ob_start();
        require(base_path('/resources/PDF/facture/index.php'));
        $content = ob_get_clean();

        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML($content);
        return $pdf->stream();

    }
}
