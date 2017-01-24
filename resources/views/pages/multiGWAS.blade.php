@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.0/js/bootstrap-select.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/select/1.2.0/js/dataTables.select.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/select/1.2.0/css/select.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.flash.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script type="text/javascript" src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script type="text/javascript" src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.print.min.js"></script>
<script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
<script src="//labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script type="text/javascript" src="//d3js.org/queue.v1.min.js"></script>
<meta name="csrf-token" content="{{ csrf_token() }}"/>
<script type="text/javascript">
  $.ajaxSetup({
    headers: {'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')}
  });
  var subdir = "{{ Config::get('app.subdir') }}";
</script>
<script type="text/javascript" src="{!! URL::asset('js/multiGWAS.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/style.css') !!}">
@stop

@section('content')
<div class="container" style="padding-top: 50px;">
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="panel-title">Brows studies in GWAS ATLAS</div>
    </div>
    <div class="panel-body container">
      <strong>Phenotype filtering</strong><br/>
      <div class="row">
        <div class="col-md-3">
          Domain:<br/>
          <select class="selectpicker" name="Domain" id="Domain" onchange='Selection("Domain");'>
            <option value=null>-- Please select Domain of interest --</option>
          </select>
        </div>
        <div class="col-md-3">
          Chapter level:<br/>
          <select class="selectpicker" name="Chapter" id="Chapter" onchange='Selection("Chapter");'>
            <option value=null>-- Please select Chapter of interest --</option>
          </select>
        </div>
        <div class="col-md-3">
          Subchapter level:<br/>
          <select class="selectpicker" name="Subchapter" id="Subchapter" onchange='Selection("Subchapter");'>
            <option value=null>-- Please select Subchapter of interest --</option>
          </select>
        </div>
        <div class="col-md-3">
          Trait:<br/>
          <select class="selectpicker" name="Trait" id="Trait" onchange='Selection("Trait");'>
            <option value=null>-- Please select Trait of interest --</option>
          </select>
        </div>
      </div>
      <br/>
      <span class="form-inline">
        <strong>Year</strong><br/>
        From <input type="number" class="form-control" id="yearFrom" name="yearFrom">
        to <input type="number" class="form-control" id="yearTo" name="yearTo">
      </span>
      <br/><br/>
      <span class="form-inline">
        <strong>Total sample size</strong><br/>
        Minimum: <input type="number" class="form-control" id="nMin" name="nMin">
        Maximum: <input type="number" class="form-control" id="nMax" name="nMax">
      </span>
      <br/><br/>
      <strong>Population</strong><br/>
      <select multiple class="form-control" id="pop" name="pop[]" style="width: 150px;">
        <option value="AFR">AFR</option>
        <option value="AMR">AMR</option>
        <option value="EAS">EAS</option>
        <option value="EUR">EUR</option>
        <option value="SAS">SAS</option>
      </select>
    </div>
  </div>

  <div>
    <table id="selectTable" class="display compact dt-body-right dt-head-center" width="100%" cellspacing="0" style="display: block; overflow-x: auto;">
      <thead>
        <th>ID</th>
        <th>PMID</th>
        <th>Year</th>
        <th>Domain</th>
        <th>Chapter level</th>
        <th>Subchapter level</th>
        <th>Trait</th>
        <th>Case</th>
        <th>Control</th>
        <th>N</th>
        <th>Population</th>
        <th>SNP h2</th>
        <th>Web site</th>
      </thead>
    </table>
  </div>
<div class="panel panel-default">
  <div class="panel-heading">
    <div class="panel-title">Selected GWAS studies</div>
  </div>
  <div class="panel-body">
    <table id="selectedTable" class="display dt-body-right dt-head-center" width="100%" cellspacing="0" style="display: block; overflow-x: auto;">
      <thead>
        <th>Delete</th>
        <th>Plot</th>
        <th>ID</th>
        <th>PMID</th>
        <th>Year</th>
        <th>Domain</th>
        <th>Chapter level</th>
        <th>Subchapter level</th>
        <th>Trait</th>
        <th>Case</th>
        <th>Control</th>
        <th>N</th>
        <th>Population</th>
        <th>SNP h2</th>
        <th>Web site</th>
      </thead>
    </table>
  </div>
</div>

<div id="test"></div> -->

<!-- <div id="Plots">
  <h3>Manhattan plot (GWAS summary statistics)</h3>
  <div id="ManhattanPanel" style="position: relative;">
  </div>
  <br/>
  <h3>Manhattan plot (gene based test by MAGMA)</h3>
  <div id="GenemanPlot" style="position: relative;">
    <div id="GenesManhattan" class="canvasarea"></div>
  </div>
  <br/>
  <h3>Q-Q plot</h3>
  <div class="row" style="position: relative;" id="QQPlot">
    <div class="col-md-6">
      <div id="QQSNPs" class="canvasarea"></div>
    </div>
    <div class="col-md-6">
      <div id="QQGenes" class="canvasarea"></div>
    </div>
  </div>
  <br/>
</div>
</div>
@stop
