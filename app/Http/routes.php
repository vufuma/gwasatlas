<?php

Route::get('/', function(){
    return view('pages.home');
});

Route::post('/home/dbSum', 'StatsController@dbSum');

Route::get('/howto', function(){
  return view('pages.howto');
});

// ************** Trait DB Page ***************
Route::get('/traitDB', function(){
  return view('pages.traitDB');
});

Route::post('traitDB/SelectOption', 'DBController@SelectOption');

Route::post('traitDB/dbTable', 'DBController@dbTable');

// ************** Trait DB View Page ***************
Route::get('/traitDB/{id}', function($id){
  return view('pages.traitView') -> with(["id"=>$id]);
});

Route::post('/traitDB/getData', 'DBController@getData');

Route::post('/traitDB/topSNPs', 'DBController@topSNPs');

Route::post('/traitDB/DTfile', 'DBController@DTfile');

Route::get('/traitDB/manhattan/{id}/{file}', 'DBController@manhattan');

Route::get('/traitDB/QQplot/{id}/{type}', 'DBController@QQplot');

Route::get('/traitDB/GCplot/{id}/{n}', 'DBController@GCplot');

Route::post('/traitDB/getGCdata', 'DBController@getGCdata');

Route::post('/traitDB/getGClist', 'DBController@getGClist');

// ************** Multi GWAS Comparison page ***************
Route::get('/multiGWAS', function(){
  return view('pages.multiGWAS');
});

Route::post('/multiGWAS/getData', 'MultiController@getData');

// ************** Multi GWAS Comparison page ***************
Route::get('/PheWAS', function(){
  return view('pages.PheWAS');
});

Route::post('/PheWAS/getData', 'PheWASController@getData');

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
