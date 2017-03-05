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
<script type="text/javascript" src="{!! URL::asset('js/sidebar.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/style.css') !!}">
@stop

@section('content')
<div id="wrapper" class="active">
  <!-- Side bar -->
  <div id="sidebar-wrapper">
    <ul class="sidebar-nav" id="sidebar-menu">
      <li class="sidebar-brand"><a id="menu-toggle"><tab><i id="main_icon" class="fa fa-chevron-left"></i></a></li>
    </ul>
    <ul class="sidebar-nav" id="sidebar">
      <li><a href="#GC">Generic Correlation<i class="sub_icon fa fa-bar-chart"></i></a></li>
      <li><a href="#magmagenes">MAGMA genes<i class="sub_icon fa fa-bar-chart"></i></a></li>
      <li><a href="#magmaGS">MAGMA gene-set<i class="sub_icon fa fa-area-chart"></i></a></li>
    </ul>
  </div>

  <!-- Page content -->
  <div id="page-content-wrapper">
    <div class="page-content inset">
      <!-- Phenotype selector (shonw in all panels) -->
      <div style="padding: 50px">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title"><a data-toggle="collapse" href="#selector">Select GWAS</a></h4>
          </div>
          <div id="selector" class="panel-collapse collapse in container">
            <br/>
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
            <br/><br/>
            <table id="selectTable" class="display compact dt-body-right dt-head-center" width="100%" cellspacing="0" style="display: block; overflow-x: auto; font-size:12px;">
              <thead>
                <th>ID</th>
                <th>PMID</th>
                <th>Year</th>
                <th>Domain</th>
                <th>Chapter level</th>
                <th>Subchapter level</th>
                <th>Trait</th>
                <th>Population</th>
                <th>Case</th>
                <th>Control</th>
                <th>N</th>
              </thead>
            </table>
            <br/>

          </div>
        </div>

        <!-- <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title"><a data-toggle="collapse" href="#selected">Selected GWAS</a></h4>
          </div>
          <div id="selected" class="panel-collapse collapse in container">
            <br/>
            <div id="selectedGWAS">
            </div>
            <br/>
            <button class="btn btn-xs" id="updatePlot">Update Plots</button>
            <button class="btn btn-xs" id="delGWAS">Delete checked GWAS</button>
            <br/><br/>
          </div>
        </div> -->
        <button class="btn btn-xs" id="updatePlot">Update Plots</button><br/><br/>
        <div id="panel">
        </div>
      </div>
    </div>
  </div>
</div>

@stop
