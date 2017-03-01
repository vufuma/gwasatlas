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

class DBController extends Controller
{
  public function SelectOption(Request $request){
    $type = $request -> input('type');
    $domain = $request -> input('domain');
    $chapter = $request -> input('chapter');
    $subchapter = $request -> input('subchapter');

    if(strcmp($type, 'Domain')==0){
      if(strcmp($domain, "null")==0){
        $Domain = [];
        $results = DB::select('SELECT * FROM gwasDB');
        foreach($results as $row){
          $d = $row->Domain;
          if(array_key_exists($d, $Domain)){
            $Domain[$d] += 1;
          }else{
            $Domain[$d] = 1;
          }
        }
        // $keys = array_keys($Domain);
        // $json = "";
        // foreach($keys as $k){
        //   if(strcmp($json, "")==0){
        //     $json = '{0:"'.$k.'", 1:'.$Domain[$k].'}';
        //   }else{
        //     $json .= ',{0:"'.$k.'", 1:'.$Domain[$k].'}';
        //   }
        // }
        // $json = '{Domain:['.$json.']}';
        $json = array("Domain" => $Domain, "Chapter"=>[], "Subchapter"=>[], "Trait"=>[]);
        // $json = json_encode($json);
        echo json_encode($json);
      }else{
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=?', [$domain]);
        $Chapter = [];
        $Subchapter = [];
        $Trait = [];
        foreach($results as $row){
          $c = $row->ChapterLevel;
          $s = $row->SubchapterLevel;
          $t = $row->Trait;
          if(array_key_exists($c, $Chapter)){
            $Chapter[$c] += 1;
          }else{
            $Chapter[$c] = 1;
          }
          if(array_key_exists($s, $Subchapter)){
            $Subchapter[$s] += 1;
          }else{
            $Subchapter[$s] = 1;
          }
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
        echo json_encode($json);
      }

    }else if(strcmp($type, 'Chapter')==0){
      if(strcmp($chapter, "null")==0){
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=?', [$domain]);
        $Chapter = [];
        $Subchapter = [];
        $Trait = [];
        foreach($results as $row){
          $c = $row->ChapterLevel;
          $s = $row->SubchapterLevel;
          $t = $row->Trait;
          if(array_key_exists($c, $Chapter)){
            $Chapter[$c] += 1;
          }else{
            $Chapter[$c] = 1;
          }
          if(array_key_exists($s, $Subchapter)){
            $Subchapter[$s] += 1;
          }else{
            $Subchapter[$s] = 1;
          }
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
        echo json_encode($json);
      }else{
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=? AND ChapterLevel=?', [$domain, $chapter]);
        $Subchapter = [];
        $Trait = [];
        foreach($results as $row){
          $s = $row->SubchapterLevel;
          $t = $row->Trait;
          if(array_key_exists($s, $Subchapter)){
            $Subchapter[$s] += 1;
          }else{
            $Subchapter[$s] = 1;
          }
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Subchapter"=>$Subchapter, "Trait"=>$Trait);
        echo json_encode($json);
      }
    }else if(strcmp($type, 'Subchapter')==0){
      if(strcmp($chapter,"null")==0 && strcmp($subchapter,"null")==0){
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=?', [$domain]);
        $Chapter = [];
        $Subchapter = [];
        $Trait = [];
        foreach($results as $row){
          $c = $row->ChapterLevel;
          $s = $row->SubchapterLevel;
          $t = $row->Trait;
          if(array_key_exists($c, $Chapter)){
            $Chapter[$c] += 1;
          }else{
            $Chapter[$c] = 1;
          }
          if(array_key_exists($s, $Subchapter)){
            $Subchapter[$s] += 1;
          }else{
            $Subchapter[$s] = 1;
          }
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
        echo json_encode($json);
      }
      else if(strcmp($subchapter,"null")==0){
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=? AND ChapterLevel=?', [$domain, $chapter]);
        $Subchapter = [];
        $Trait = [];
        foreach($results as $row){
          $s = $row->SubchapterLevel;
          $t = $row->Trait;
          if(array_key_exists($s, $Subchapter)){
            $Subchapter[$s] += 1;
          }else{
            $Subchapter[$s] = 1;
          }
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Subchapter"=>$Subchapter, "Trait"=>$Trait);
        echo json_encode($json);
      }else{
        $results = DB::select('SELECT * FROM gwasDB WHERE Domain=? AND SubchapterLevel=?', [$domain, $subchapter]);
        $Trait = [];
        foreach($results as $row){
          $t = $row->Trait;
          if(array_key_exists($t, $Trait)){
            $Trait[$t] += 1;
          }else{
            $Trait[$t] = 1;
          }
        }
        $json = array("Trait"=>$Trait);
        echo json_encode($json);
      }
    }else{

    }

  }

  public function dbTable(Request $request){
    // $type = $request -> input('type');
    $domain = $request -> input('domain');
    $chapter = $request -> input('chapter');
    $subchapter = $request -> input('subchapter');
    $trait = $request -> input('trait');
    $yearFrom = $request -> input('yearFrom');
    $yearTo = $request -> input('yearTo');
    $nMin = $request -> input('nMin');
    $nMax = $request -> input('nMax');
    // if($domain=="null" && $chapter=="null" && $subchapter=="null" && $trait=="null" && $yearFrom=="null" && $yearTo=="null" && $nMin=="null" && $nMax=="null"){
    if($this->NullCheck([$domain, $chapter, $subchapter, $trait, $yearFrom ,$yearTo, $nMin, $nMax])){
      // All null
      $query = 'SELECT id,PMID,Year,Domain,ChapterLevel,SubchapterLevel,Trait,Population,Ncase,Ncontrol,N, Genome,Nsnps, Nhits,SNPh2,File,Website FROM gwasDB';
      $head = ['ID','PMID','Year','Domain','ChapterLevel','SubchapterLevel','Trait', 'Population','Ncase','Ncontrol','N','Genome', 'Nsnps', 'Nhits','SNPh2', 'File', 'Website'];
      $results = DB::select($query);
      $results = json_decode(json_encode($results), true);
      $all_row = array();
      foreach($results as $row){
        $all_row[] = array_combine($head, $row);
      }
      $json = array('data'=>$all_row);
      echo json_encode($json);
    // }else if(strcmp($domain, "null")==0 || (strcmp($domain, "null")==0 && strcmp($chapter, "null")==0 && strcmp($subchapter, "null")==0 && strcmp($trait, "null")==0)){
    }else if($this->NullCheck([$domain, $yearFrom ,$yearTo, $nMin, $nMax])){
      $query = 'SELECT id,PMID,Year,Domain,ChapterLevel,SubchapterLevel,Trait,Population,Ncase,Ncontrol,N, Genome,Nsnps, Nhits,SNPh2,File,Website FROM gwasDB';
      $head = ['ID','PMID','Year','Domain','ChapterLevel','SubchapterLevel','Trait', 'Population','Ncase','Ncontrol','N','Genome', 'Nsnps', 'Nhits','SNPh2', 'File', 'Website'];
      $results = DB::select($query);
      $results = json_decode(json_encode($results), true);
      $all_row = array();
      foreach($results as $row){
        $all_row[] = array_combine($head, $row);
        // $all_row[] = $row;
      }
      $json = array('data'=>$all_row);
      echo json_encode($json);
      // echo json_encode($all_row);
      // echo json_encode($results);
    }else{
      $query = 'SELECT id,PMID,Year,Domain,ChapterLevel,SubchapterLevel,Trait,Population,Ncase,Ncontrol,N, Genome,Nsnps, Nhits,SNPh2,File,Website FROM gwasDB WHERE';
      $head = ['ID','PMID','Year','Domain','ChapterLevel','SubchapterLevel','Trait', 'Population','Ncase','Ncontrol','N','Genome', 'Nsnps', 'Nhits','SNPh2', 'File', 'Website'];
      $val = [];
      if(strcmp($domain, "null")!=0){
        $query .= ' Domain=?';
        $val[] = $domain;
      }
      if(strcmp($chapter, "null")!=0){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' ChapterLevel=?';
        $val[] = $chapter;
      }
      if(strcmp($subchapter, "null")!=0){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' SubchapterLevel=?';
        $val[] = $subchapter;
      }
      if(strcmp($trait, "null")!=0){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' Trait=?';
        $val[] = $trait;
      }
      if($yearFrom != "null"){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' Year>=?';
        $val[] = $yearFrom;
      }
      if($yearTo != "null"){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' Year<=?';
        $val[] = $yearTo;
      }
      if($nMin != "null"){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' N>=?';
        $val[] = $nMin;
      }
      if($nMax != "null"){
        if(count($val)!=0){$query .= " AND";}
        $query .= ' N<=?';
        $val[] = $nMax;
      }
      $results = DB::select($query, $val);
      $results = json_decode(json_encode($results), true);
      $all_row = array();
      foreach($results as $row){
        $all_row[] = array_combine($head, $row);
      }
      $json = array('data'=>$all_row);
      echo json_encode($json);
      // echo json_encode($results);
    }
  }

  // argument should be an array
  public function NullCheck($data){
    $check = true;
    foreach($data as $d){
      if($d!="null"){
        $check = false;
        return $check;
      }
    }
    return $check;
  }

  public function getData(Request $request){
    $id = $request->input("id");
    $result = DB::table('gwasDB')->where('id', $id)->get();
    return json_encode($result);
  }

  public function manhattan($id, $file){
    $filedir = config('app.datadir');
    $filedir .= '/'.$id.'/';
    $f = $filedir.$file;
    if($file == "manhattan.txt"){
      if(file_exists($f)){
        $file = fopen($f, 'r');
        $header = fgetcsv($file, 0, "\t");
        $all_rows = [];
        while($row = fgetcsv($file, 0, "\t")){
          $row[0] = (int)$row[0];
          $row[1] = (int)$row[1];
          $row[2] = (float)$row[2];
          // $all_rows[] = array_combine($header, $row);
          $all_rows[] = $row;
        }
        echo json_encode($all_rows);
      }
    }else if($file == "magma.genes.out"){
      if(file_exists($f)){
        $file = fopen($f, 'r');
        $header = fgetcsv($file, 0, "\t");
        $all_rows = array();
        while($row = fgetcsv($file, 0, "\t")){
          if($row[1]=="X"){$row[1] = "23";}
          $row[1] = (int)$row[1];
          $row[2] = (int)$row[2];
          $row[3] = (int)$row[3];
          $row[8] = (float)$row[8];
          // $all_rows[] = array_combine($header, $row);
          $all_rows[] = array($row[1], $row[2], $row[3], $row[8], $row[9]);
        }
        echo json_encode($all_rows);
      }
    }

  }

  public function QQplot($id, $plot){
    $filedir = config('app.datadir');
    $filedir .= '/'.$id.'/';

    if(strcmp($plot,"SNP")==0){
      $file=$filedir."QQSNPs.txt";
      $f = fopen($file, 'r');
      $all_row = array();
      $head = fgetcsv($f, 0, "\t");
      while($row = fgetcsv($f, 0, "\t")){
        $all_row[] = array_combine($head, $row);
      }
      echo json_encode($all_row);

    }else if(strcmp($plot,"Gene")==0){
      $file=$filedir."magma.genes.out";
      $f = fopen($file, 'r');
      $obs = array();
      $exp = array();
      $c = 0;
      fgetcsv($f, 0, "\t");
      while($row = fgetcsv($f, 0, "\t")){
        $c++;
        $obs[] = -log10($row[8]);
      }
      sort($obs);
      $step = (1-1/$c)/$c;
      $head = ["obs", "exp", "n"];
      $all_row = array();
      for($i=0; $i<$c; $i++){
        $all_row[] = array_combine($head, [$obs[$i], -log10(1-$i*$step), $i+1]);
      }
      echo json_encode($all_row);
    }
  }

  public function GCplot($id, $n){
    $results = DB::select('SELECT gc.*, db.Trait FROM ( SELECT IF (id1= ?, id2, id1) AS id, rg, se, z, p FROM GenCor WHERE (id1 = ? OR id2 = ?) AND p<0.05 ORDER BY ABS(rg) DESC LIMIT ?) AS gc JOIN gwasDB AS db ON gc.id=db.id', [$id, $id, $id, $n]);
    return json_encode($results);
  }

  public function DTfile(Request $request){
    $id = $request -> input('id');
    $fin = $request -> input('infile');
    $cols = $request -> input('header');
    $cols = explode(":", $cols);
    $filedir = config('app.datadir')."/".$id."/";
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

  public function DomainPie(){
    $results = DB::select("SELECT Domain, COUNT(*) AS count FROM gwasDB GROUP BY Domain ORDER BY count DESC");
    return json_encode($results);
  }

  public function ChapterPie($domain){
    $results = DB::select('SELECT ChapterLevel, COUNT(*) AS count FROM gwasDB WHERE Domain=? GROUP BY ChapterLevel ORDER BY count DESC', [$domain]);
    return json_encode($results);
  }

  public function SubchapterPie($domain, $chapter){
    $results = DB::select('SELECT SubchapterLevel, COUNT(*) AS count FROM gwasDB WHERE Domain=? AND ChapterLevel=? GROUP BY SubchapterLevel ORDER BY count DESC', [$domain, $chapter]);
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

  public function CGhead($ids){
    $script = storage_path().'/scripts/getCGheat.py';
    // $out = shell_exec("python $script $id");
    // echo $out;
    $out = '{"data":[{"features":[
        {"Trait":[{1:"Trait 1", 3:"Trait 3"}]},
        {"Domain":[{1:1, 3:2}]},
        {"Order":[{1:2, 3:1}]}
      ]},"rg":[["id1":1, "id2":1, "rg":1], ["id1":1, "id2":3, "rg":0.5], ["id1":3, "id2":3, "rg":1], ["id1":3, "id2":1, "rg":0.5]]';
    echo $out;
  }
}
