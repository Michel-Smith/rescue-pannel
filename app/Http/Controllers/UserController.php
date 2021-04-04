<?php

namespace App\Http\Controllers;

use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;



class UserController extends Controller
{
    public function register(Request  $request): \Illuminate\Http\JsonResponse
    {
        $pseudo = $request->pseudo;
        $mail = $request->email;
        $psw = $request->psw;
        if($user = \App\Models\User::where('email', $mail)->count() != 0){
            return response()->json([
                'status' => 'ERROR',
                'raison'=> 'Email taken',
                'datas' => []
            ], 200);
        }else{
            $createuser = new \App\Models\User();
            $createuser->name = $pseudo;
            $createuser->email = $mail;
            $createuser->password = Hash::make($psw);
            $createuser->save();
            $newuser = \App\Models\User::where('email', $mail)->first();
            Auth::login($newuser);
            Session::push('user_grade', $newuser->GetGrade);
            if(Auth::check()){
                return response()->json([
                    'status' => 'OK',
                    'datas' => [
                        'user' => $newuser,
                        'authed' => true,
                    ]
                ], 201);
            }else{
                return response()->json([
                   'status' => 'error',
                   'user' => null,
                   'authed' => false,
                    'check' => Auth::check(),
                ], 200);
            }
        }
    }

    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        $email = $request->email;
        $psw = $request->psw;
        if(\App\Models\User::where('email', $email)->count() == 0){
            $returned = response()->json([
                'status'=> 'adresse mail non existante',
                'user' => null,
                'authed' => false,
            ], 202);
        }else{
            $user= User::where('email', $email)->first();
             if(Hash::check($psw, $user->password)){
                Auth::login($user);
                 Session::push('user_grade', $user->GetGrade);
                    if($user->liveplace != null){
                        $returned = response()->json([
                            'status'=>'OK',
                            'user'=>$user,
                            'authed'=>Auth::check(),
                        ]);
                    }else{
                        $returned = response()->json([
                            'status'=>'INFOS',
                            'user'=>$user,
                            'authed'=>Auth::check(),
                        ]);
                    }
            }else{
                $returned = response()->json([
                    'status'=>'Mot de passe invalide',
                    'user' => null,
                    'authed'=>false
                ], 202);
            }
        }
        return $returned;
    }

    public function getUser(Request $request): \Illuminate\Http\JsonResponse
    {
        $users = User::all();
        return response()->json([
            'status'=>'OK',
            'users'=>$users,
        ]);
    }

    public function setusergrade(Request $request, int $id, int $userid): \Illuminate\Http\JsonResponse
    {
        $user= User::where('id', $userid)->first();
        $user->grade_id = $id;
        $user->save();
        event(new \App\Events\Notify('Le grade a été bien changé ! ',1));
        return \response()->json(['status'=>'OK']);
    }

    public function checkConnexion(): \Illuminate\Http\JsonResponse
    {
        if(Auth::user()){
            return response()->json(['session'=>true]);
        }
        return response()->json(['session'=>false]);
    }

    public function postInfos(Request $request): \Illuminate\Http\JsonResponse
    {
        $living = $request->living;
        $timezone = $request->timezone;
        $tel = $request->tel;
        $compte= $request->compte;
        $user = User::where('id', Auth::id())->first();
        $user->liveplace= $living;
        $user->timezone = $timezone;
        $user->tel = $tel;
        $user->compte = $compte;
        $user->save();
        Http::post(env('WEBHOOK_INFOS'),[
            'embeds'=>[
                [
                    'title'=>'Numéro de compte',
                    'color'=>'16776960',
                    'fields'=>[
                        [
                            'name'=>'Prénom Nom : ',
                            'value'=>Auth::user()->name,
                            'inline'=>false
                        ],[
                            'name'=>'Numéro de téléphone : ',
                            'value'=>$user->tel,
                            'inline'=>false
                        ],[
                            'name'=>'Conté habité : ',
                            'value'=>$user->liveplace,
                            'inline'=>false
                        ],[
                            'name'=>'Numéro de compte : ',
                            'value'=>$user->compte,
                            'inline'=>false
                        ]
                    ],
                ]
            ]
        ]);
        return \response()->json(['status'=>'OK'],201);
    }

    public function GetUserPerm(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = \App\Models\User::where('id', Auth::id())->first();
        $grade = $user->GetGrade;
        $perm = [
            'acces'=>$grade->perm_0,
            'HS_rapport'=>$grade->perm_1,
            'HS_dossier'=>$grade->perm_2,
            'HS_BC'=>$grade->perm_3,
            'factures_PDF'=>$grade->perm_4,
            'add_factures'=>$grade->perm_5,
            'rapport_create'=>$grade->perm_6,
            'add_BC'=>$grade->perm_7,
            'remboursement'=>$grade->perm_8,
            'infos_edit'=>$grade->perm_9,
            'vol'=>$grade->perm_10,
            'rapport_horaire'=>$grade->perm_11,
            'service_modify'=>$grade->perm_12,
            'time_modify'=>$grade->perm_13,
            'perso_list'=>$grade->perm_14,
            'set_pilot'=>$grade->perm_15,
            'edit_perm'=>$grade->perm_16,
            'post_annonces'=>$grade->perm_17,
            'logs_acces'=>$grade->perm_18,
            'validate_forma'=>$grade->perm_19,
            'create_forma'=>$grade->perm_20,
            'forma_publi'=>$grade->perm_21,
            'forma_delete'=>$grade->perm_22,
            'access_stats'=>$grade->perm_23,
            'HS_facture'=>$grade->perm_24,
            'content_mgt'=>$grade->perm_25
        ];
        return \response()->json(['status'=>'ok', 'perm'=>$perm, 'user'=>$user]);
    }

}
