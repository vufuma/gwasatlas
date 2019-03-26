<?php

Route::get('/', function(){
    return view('pages.home');
});

Route::post('/home/dbSum', 'StatsController@dbSum');

Route::post('/home/release', 'BaseController@release');

Route::get('/howto', function(){
  return view('pages.howto');
});

// ************** Trait DB Page ***************
Route::get('/traitDB', function(){
  return view('pages.traitDB');
});

Route::post('/traitDB/SelectOption', 'DBController@SelectOption');

Route::post('/traitDB/dbTable', 'DBController@dbTable');

// ************** Trait DB View Page ***************
Route::get('/traitDB/{id}', function($id){
  return view('pages.traitView') -> with(["id"=>$id]);
});

Route::post('/traitDB/getData', 'DBController@getData');

Route::post('/traitDB/topSNPs', 'BaseController@DTfile');

Route::post('/traitDB/DTfile', 'DBController@DTfile');

Route::get('/traitDB/manhattan/{id}/{file}', 'DBController@manhattan');

Route::get('/traitDB/QQplot/{id}/{type}', 'DBController@QQplot');

Route::get('/traitDB/GCplot/{id}/{n}', 'DBController@GCplot');

Route::post('/traitDB/getGCdata', 'DBController@getGCdata');

Route::post('/traitDB/getGClist', 'DBController@getGClist');

Route::post('/traitDB/imgdown', 'DBController@imgdown');

Route::post('/traitDB/imgdown2', 'DBController@imgdown2');

// ************** Download sumstats ***************
Route::get('/ukb2_sumstats/{file}', 'BaseController@sumstats');

// ************** Multi GWAS Comparison page ***************
Route::get('/multiGWAS', function(){
  return view('pages.multiGWAS');
});

Route::post('/multiGWAS/getSummary', 'MultiController@getSummary');

Route::post('/multiGWAS/getGC', 'MultiController@getGC');

Route::post('/multiGWAS/getGenes', 'MultiController@getGenes');

Route::post('/multiGWAS/getLociOverlap', 'MultiController@getLociOverlap');

Route::post('/multiGWAS/getGenesPleiotropy', 'MultiController@getGenesPleiotropy');

Route::post('/multiGWAS/imgdown', 'MultiController@imgdown');

Route::post('/multiGWAS/getPheData', 'PheWASController@getData');

// ************** Multi GWAS Comparison page ***************
Route::get('/PheWAS', function(){
  return view('pages.PheWAS');
});

Route::post('/PheWAS/getData', 'PheWASController@getData');

Route::post('/PheWAS/imgdown', 'PheWASController@imgdown');

Route::get('/faq', function(){
  return view('pages.faq');
});

// ************** Report GWAS Page ***************
Route::get('/report', function(){
  return view('pages.report');
});

Route::post('/report/submit', 'ReportController@submit');

Route::get('/report/getTable', 'ReportController@getTable');

// ************** Stats Page ***************
Route::get('/stats', function(){
  return view('pages.stats');
});

Route::post('/stats/dbSum', 'StatsController@dbSum');

Route::get('/stats/yearSumPlot', 'StatsController@yearSumPlot');

Route::get('/stats/domainSumPlot', 'StatsController@domainSumPlot');

Route::get('/stats/DomainPie', 'StatsController@DomainPie');

Route::get('/stats/ChapterPie/{domain}', 'StatsController@ChapterPie');

Route::get('/stats/SubchapterPie/{domain}/{chapter}', 'StatsController@SubchapterPie');

Route::get('/stats/NsampleYear', 'StatsController@NsampleYear');

Route::get('/stats/NsampleDomain', 'StatsController@NsampleDomain');

Route::get('/documentation', function(){
  return view('pages.documentation');
});
