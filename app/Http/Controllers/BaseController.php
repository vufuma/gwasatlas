<?php

namespace atlas\Http\Controllers;

use Illuminate\Http\Request;
use atlas\Http\Requests;
use Illuminate\Support\Facades\DB;
use atlas\Http\Controllers\Controller;
use Symfony\Component\Process\Process;
use View;
use Auth;
use Storage;
use File;
use JavaScript;

class BaseController extends Controller
{
	public function imgdown(Request $request){
		$svg = $request->input('data');
		$id = $request -> input('id');
		$type = $request->input('type');
		$fileName = $request->input('fileName');
		$filedir = config('app.datadir').'/'.$id.'/';
		$svgfile = $filedir.'temp.svg';
		$outfile = $filedir.$fileName.'_atlas_'.$id.'.'.$type;

		$svg = preg_replace("/\),rotate/", ")rotate", $svg);
		$svg = preg_replace("/,skewX\(.+?\)/", "", $svg);
		$svg = preg_replace("/,scale\(.+?\)/", "", $svg);
		if(!File::exists($outfile)){
			if($type=="svg"){
				file_put_contents($svgfile, $svg);
				File::move($svgfile, $outfile);
			}else{
				$image = new \Imagick();
				$image->setResolution(300,300);
				$image->readImageBlob('<?xml version="1.0"?>'.$svg);
				$image->setImageFormat($type);
				$image->writeImage($outfile);
				return response() -> download($outfile);
			}
		}
		return response() -> download($outfile);
    }

	public function imgdown2(Request $request){
		$svg = $request->input('data');
		$id = $request -> input('id');
		$type = $request->input('type');
		$fileName = $request->input('fileName');
		$filedir = config('app.datadir').'/'.$id.'/';
		$svgfile = $filedir.'temp.svg';
		$outfile = $filedir.$fileName.'_atlas_'.$id.'.'.$type;

		$svg = preg_replace("/\),rotate/", ")rotate", $svg);
		$svg = preg_replace("/,skewX\(.+?\)/", "", $svg);
		$svg = preg_replace("/,scale\(.+?\)/", "", $svg);
		if($type=="svg"){
			file_put_contents($svgfile, $svg);
			File::move($svgfile, $outfile);
		}else{
			$image = new \Imagick();
			$image->setResolution(300,300);
			$image->readImageBlob('<?xml version="1.0"?>'.$svg);
			$image->setImageFormat($type);
			$image->writeImage($outfile);
			return response() -> download($outfile);
		}
		return response() -> download($outfile);
    }

	public function sumstats($file){
		$dir = config('app.sumstatsdir');
		return response() -> download($dir.'/'.$file);
	}

	public function DTfile(Request $request){
		$id = $request -> input('id');
		$fin = $request -> input('infile');
		$cols = $request -> input('header');
		$cols = explode(":", $cols);
		$filedir = config('app.datadir').'/'.$id.'/';
		$f = $filedir.$fin;
		if(file_exists($f)){
			$file = fopen($f, 'r');
			$all_rows = array();
			$head = fgetcsv($file, 0, "\t");
			$index = array();
			foreach($cols as $c){
				if(in_array($c, $head)){
					$index[] = array_search($c, $head);
				}else{
					$index[] = -1;
				}
			}
			while($row = fgetcsv($file, 0, "\t")){
				$temp = [];
				foreach($index as $i){
					if($i==-1){
						$temp[] = "NA";
					}else{
						$temp[] = $row[$i];
					}
				}
				$all_rows[] = $temp;
			}
			$json = (array('data'=> $all_rows));

			echo json_encode($json);
		}else{
			echo '{"data":[]}';
		}
    }
}
