<?php

Route::get('/', function(){
    return view('pages.home');
});

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

Route::post('/traitDB/DTfile', 'DBController@DTfile');

Route::get('/traitDB/manhattan/{id}/{file}', 'DBController@manhattan');

Route::get('/traitDB/QQplot/{id}/{type}', 'DBController@QQplot');

Route::get('/traitDB/GCplot/{id}', 'DBController@GCplot');

// ************** Multi GWAS Comparison page ***************
Route::get('/multiGWAS', function(){
  return view('pages.multiGWAS');
});

// ************** Stats Page ***************
Route::get('/stats', function(){
  return view('pages.stats');
});

Route::get('/stats/DomainPie', 'DBController@DomainPie');
Route::get('/stats/ChapterPie/{domain}', 'DBController@ChapterPie');
Route::get('/stats/SubchapterPie/{domain}/{chapter}', 'DBController@SubchapterPie');

Route::get('/documentation', function(){
  return view('pages.documentation');
});
