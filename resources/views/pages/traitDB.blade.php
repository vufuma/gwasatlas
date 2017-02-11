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
<script type="text/javascript" src="//cdn.datatables.net/fixedcolumns/3.2.2/js/dataTables.fixedColumns.min.js"></script>
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
<script type="text/javascript" src="{!! URL::asset('js/traitDB.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/style.css') !!}">
@stop

@section('content')
<div style="padding: 50px;">
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
        From <input type="number" class="form-control" id="yearFrom" name="yearFrom" onkeydown="SelectEnter(this)">
        to <input type="number" class="form-control" id="yearTo" name="yearTo" onkeydown="SelectEnter(this)">
      </span>
      <br/><br/>
      <span class="form-inline">
        <strong>Total sample size</strong><br/>
        Minimum: <input type="number" class="form-control" id="nMin" name="nMin" onkeydown="SelectEnter(this)">
        Maximum: <input type="number" class="form-control" id="nMax" name="nMax" onkeydown="SelectEnter(this)">
      </span>
      <!-- <br/><br/>
      <strong>Population</strong><br/>
      <select multiple class="form-control" id="pop" name="pop[]" style="width: 150px;" onchange='Slection();'>
        <option value="AFR">AFR</option>
        <option value="AMR">AMR</option>
        <option value="EAS">EAS</option>
        <option value="EUR">EUR</option>
        <option value="SAS">SAS</option>
      </select> -->
    </div>
  </div>

  <div>
    <table id="dbTable" class="display compact dt-body-right dt-head-center" width="100%" cellspacing="0" style="display: block; overflow-x: auto;">
      <thead>
        <th>ID</th>
        <th>PMID</th>
        <th>Year</th>
        <th style="width:100px;">Domain</th>
        <th style="width:100px;">Chapter level</th>
        <th style="width:100px;">Subchapter level</th>
        <th style="width:100px;">Trait</th>
        <th>Population</th>
        <th>Case</th>
        <th>Control</th>
        <th>N</th>
        <th>Genome</th>
        <th>Nsnps</th>
        <th>Nhits</th>
        <th>SNP h2</th>
        <th style="word-break: break-all">File</th>
        <th>Website</th>
      </thead>
      <tbody id="dbTableBody">
      </tbody>
    </table>
  </div>
</div>
@stop
