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

class StatsController extends Controller
{
	public function dbSum(){
		$header = ["GWAS", "trait", "study", "domain"];
		$val = [];
		$val[] = DB::table('gwasDB')->count();

		$tmp = DB::select("SELECT Trait FROM gwasDB");
		$trait = [];
		foreach($tmp as $t){
			$tmp_t = $t->Trait;
			$tmp_t = preg_replace("/(.+) \(.+\)/", "$1", $tmp_t);
			$trait[] = $tmp_t;
		}
		$trait = array_unique($trait);
		$val[] = count($trait);

		$tmp = collect(DB::select("SELECT COUNT(DISTINCT PMID) AS count FROM gwasDB"))->first();
		$val[] = $tmp->count;
		$tmp = collect(DB::select("SELECT COUNT(DISTINCT Domain) AS count FROM gwasDB"))->first();
		$val[] = $tmp->count;
		return json_encode(array_combine($header, $val));
	}

	public function yearSumPlot(){
		$minYear = collect(DB::select("SELECT MIN(Year) as year from gwasDB"))->first()->year;
		$maxYear = collect(DB::select("SELECT MAX(Year) as year from gwasDB"))->first()->year;
		$years = [];
		for($i=$minYear; $i<=$maxYear; $i++){
			$years[] = $i;
		}

		$Nstudy = array_fill(0, count($years)-1,0);
		$tmp = DB::select("SELECT Year, COUNT(DISTINCT PMID) AS count FROM gwasDB GROUP BY Year");
		foreach($tmp as $row){
			$Nstudy[array_search($row->Year, $years)] = $row->count;
		}

		$Ngwas = array_fill(0, count($years)-1,0);
		$tmp = DB::select("SELECT Year, COUNT(*) AS count FROM gwasDB GROUP BY Year");
		foreach($tmp as $row){
			$Ngwas[array_search($row->Year, $years)] = $row->count;
		}

		$Ntrait = array_fill(0, count($years)-1,0);
		for($i=0; $i<count($years); $i++){
			$tmp = DB::select("SELECT Trait from gwasDB WHERE Year=?", [$years[$i]]);
			$trait = [];
			foreach($tmp as $row){
				$t = $row->Trait;
				$t = preg_replace("/(.+) \(.+\)/", "$1", $t);
				if(!in_array($t, $trait)){
					$trait[] = $t;
				}
			}
			$Ntrait[$i] = count($trait);
		}

		$Nsample_avg = array_fill(0, count($years)-1,0);
		$Nsample_min = array_fill(0, count($years)-1,0);
		$Nsample_max = array_fill(0, count($years)-1,0);

		$tmp = DB::select("SELECT Year, AVG(N) AS n FROM gwasDB GROUP BY Year");
		foreach($tmp as $row){
			$Nsample_avg[array_search($row->Year, $years)] = $row->n;
		}
		$tmp = DB::select("SELECT Year, MIN(N) AS n FROM gwasDB GROUP BY Year");
		foreach($tmp as $row){
			$Nsample_min[array_search($row->Year, $years)] = $row->n;
		}
		$tmp = DB::select("SELECT Year, MAX(N) AS n FROM gwasDB GROUP BY Year");
		foreach($tmp as $row){
			$Nsample_max[array_search($row->Year, $years)] = $row->n;
		}

		$results = [];
		for($i=0; $i<count($years); $i++){
			$results[] = [$years[$i], $Nstudy[$i], $Ngwas[$i], $Ntrait[$i], $Nsample_avg[$i], $Nsample_min[$i], $Nsample_max[$i]];
		}
		return json_encode($results);
	}

	public function domainSumPlot(){
		$domains = [];
		$tmp = DB::select("SELECT DISTINCT Domain from gwasDB ORDER BY Domain");
		foreach($tmp as $d){
			$domains[] = $d->Domain;
		}

		$Nstudy = array_fill(0, count($domains)-1,0);
		$tmp = DB::select("SELECT Domain, COUNT(DISTINCT PMID) AS count FROM gwasDB GROUP BY Domain");
		foreach($tmp as $row){
			$Nstudy[array_search($row->Domain, $domains)] = $row->count;
		}

		$Ngwas = array_fill(0, count($domains)-1,0);
		$tmp = DB::select("SELECT Domain, COUNT(*) AS count FROM gwasDB GROUP BY Domain");
		foreach($tmp as $row){
			$Ngwas[array_search($row->Domain, $domains)] = $row->count;
		}

		$Ntrait = array_fill(0, count($domains)-1,0);
		for($i=0; $i<count($domains); $i++){
			$tmp = DB::select("SELECT Trait from gwasDB WHERE Domain=?", [$domains[$i]]);
			$trait = [];
			foreach($tmp as $row){
				$t = $row->Trait;
				$t = preg_replace("/(.+) \(.+\)/", "$1", $t);
				if(!in_array($t, $trait)){
					$trait[] = $t;
				}
			}
			$Ntrait[$i] = count($trait);
		}

		$Nsample_avg = array_fill(0, count($domains)-1,0);
		$Nsample_min = array_fill(0, count($domains)-1,0);
		$Nsample_max = array_fill(0, count($domains)-1,0);

		$tmp = DB::select("SELECT Domain, AVG(N) AS n FROM gwasDB GROUP BY Domain");
		foreach($tmp as $row){
			$Nsample_avg[array_search($row->Domain, $domains)] = $row->n;
		}
		$tmp = DB::select("SELECT Domain, MIN(N) AS n FROM gwasDB GROUP BY Domain");
		foreach($tmp as $row){
			$Nsample_min[array_search($row->Domain, $domains)] = $row->n;
		}
		$tmp = DB::select("SELECT Domain, MAX(N) AS n FROM gwasDB GROUP BY Domain");
		foreach($tmp as $row){
			$Nsample_max[array_search($row->Domain, $domains)] = $row->n;
		}

		$results = [];
		for($i=0; $i<count($domains); $i++){
			$results[] = [$domains[$i], $Nstudy[$i], $Ngwas[$i], $Ntrait[$i], $Nsample_avg[$i], $Nsample_min[$i], $Nsample_max[$i]];
		}
		return json_encode($results);
	}

	public function DomainPie(){
		$results = DB::select("SELECT Domain, COUNT(DISTINCT PMID) AS count FROM gwasDB GROUP BY Domain ORDER BY count DESC");
		return json_encode($results);
	}

	public function ChapterPie($domain){
		$results = DB::select('SELECT ChapterLevel, COUNT(DISTINCT PMID) AS count FROM gwasDB WHERE Domain=? GROUP BY ChapterLevel ORDER BY count DESC', [$domain]);
		return json_encode($results);
	}

	public function SubchapterPie($domain, $chapter){
		$results = DB::select('SELECT SubchapterLevel, COUNT(DISTINCT PMID) AS count FROM gwasDB WHERE Domain=? AND ChapterLevel=? GROUP BY SubchapterLevel ORDER BY count DESC', [$domain, $chapter]);
		return json_encode($results);
	}

	public function NsampleYear(){
		$results = DB::select('SELECT Year, N from gwasDB');
		return json_encode($results);
	}

	public function NsampleDomain(){
		$results = DB::select('SELECT Domain, N from gwasDB ORDER BY Domain');
		return json_encode($results);
	}
}
