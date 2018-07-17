<?php

namespace atlas\Http\Controllers;

use Illuminate\Http\Request;
use atlas\Http\Requests;
use Illuminate\Support\Facades\DB;
use atlas\Http\Controllers\Controller;
use Symfony\Component\Process\Process;

class PheWASController extends Controller
{
    public function getData(Request $request){
		$text = $request->input('text');
		$ids = $request->input('ids');
		$maxP = $request->input('maxP');
		if($ids==""){$ids="NA";}
		if($maxP==""){$maxP="1";}

		$host = config('database.connections.mysql.host');
		$user = config('database.connections.mysql.username');
		$pass = config('database.connections.mysql.password');
		$db = config('database.connections.mysql.database');

		$datadir = config('app.ssh_datadir');
		$script = storage_path().'/scripts/getPheWASdata.py';
		$json = shell_exec("python $script $host $user $pass $db $text $ids $maxP $datadir");

		return $json;
	}
}
