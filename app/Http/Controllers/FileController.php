<?php

namespace App\Http\Controllers;


use App\Events\Notify;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use function PHPUnit\Framework\directoryExists;


class FileController extends Controller
{
    /**
     * @var string
     */
    private string $laravelTempDir;

    public function __construct()
    {
        $this->laravelTempDir = Storage::path('public/temp/');
    }

    public function uploadFile(Request $request): JsonResponse
    {
        $file = $request->file('file');
        if(!isset($file) || !isset($request->id)){
            return response()->json(['status'=>'error'],500);
        }
        if(!$file->isValid()){
            return response()->json(['status'=>'PAS OK'],500);
        }


        $tempFile = $this->laravelTempDir.$request->id . '_' . explode('/', $file->getClientMimeType())[1] . '.temp';

        file_put_contents($tempFile, $file->getContent(), FILE_APPEND);

        return response()->json(['status'=>'OK'],200);
    }


    /**
     * @param Request $request
     * @param string $uuid
     * @return JsonResponse
     */
    public function endOffUpload(Request $request, string $uuid): JsonResponse
    {
        $type = explode('/',$request->type)[1];
        $file = $this->laravelTempDir . $uuid . '_' . $type . '.temp';
        if(!File::exists($file)) {
            event(new Notify('Erreur lors de la mise en ligne', 4));
            return response()->json(['status' => 'PAS OK'], 500);
        }
        $img= $uuid . '.' . $type;
        File::move($file, $this->laravelTempDir . $img);
        event(new Notify('Fichier mis en ligne',1));
        return response()->json(['status'=>'OK',
            'image' => $img,
            ],200);
    }

    /**
     * @param string $fillWithFullPath
     * @return bool
     */
    public static function moveTempFile(string $lastname, string $newSpace): bool
    {
        $path = storage_path('app/public/temp/'.$lastname);
        if(File::exists($path)){
            File::move($path, $newSpace);
            return true;
        }
        return false;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteTempFile(Request $request): JsonResponse
    {
        $image = $request->image;
        if(File::exists($this->laravelTempDir . $image)){
            File::delete($this->laravelTempDir . $image);
            event(new Notify('Votre fichier a été supprimé',1));
            return response()->json(['status'=>'OK']);
        }
        event(new Notify('Nous trouvons pas votre fichier',3));
        return response()->json(['status'=>'PAS OK'],500);
    }






}
