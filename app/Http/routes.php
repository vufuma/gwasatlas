<?php

Route::get('/', function(){
    return view('pages.home');
});

Route::get('/howto', function(){
  return view('pages.howto');
});

Route::get('/traitDB', function(){
  return view('pages.traitDB');
});


Route::get('/multiGWAS', function(){
  return view('pages.multiGWAS');
});

Route::get('/documentation', function(){
  return view('pages.documentation');
});

// ********************** GWASRESULT ************************

Route::get('GWASresult/d3text/{dbName}/{file}', 'D3jsController@d3js_GWAS_textfile');

Route::get('GWASresult/QQplot/{dbName}/{type}', 'D3jsController@d3js_GWAS_QQ');

Route::post('traitDB/SelectOption', 'DBController@SelectOption');

Route::post('traitDB/dbTable', 'DBController@dbTable');

Route::get('GWASresult/manhattan/{type}/{jobID}/{file}', 'D3jsController@manhattan');

Route::get('GWASresult/QQplot/{type}/{jobID}/{plot}', 'D3jsController@QQplot');
