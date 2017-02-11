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
  var id = "{{ $id }}";
</script>
<script type="text/javascript" src="{!! URL::asset('js/traitView.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/style.css') !!}">
@stop

@section('content')
<div style="padding:50px;">
  <div id="title"></div>

  <div id="info" class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#infoPanel">GWAS information</a></h4>
    </div>
    <div id="infoPanel" class="panel-collapse collapse in">
      <br/>
      <table class="table table-sm table-bordered" style="width: 90%; margin:auto;">
        <thead>
          <th>Feature</th><th>Value</th>
        </thead>
        <tbody id="infoTable">
        </tbody>
      </table>
      <br/>
    </div>
  </div>

  <div id="SNPplots" class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#SNPplotsPanel">SNPs plots</a></h4>
    </div>
    <div id="SNPplotsPanel" class="panel-collapse collapse container">
      <br/>
      <h4>Manhattan plot</h4>
      <div id="manhattan" style="text-align: center;"></div>
      <h4>Q-Q plot</h4>
      <div id="QQplot" style="text-align: center;"></div>
      <br/>
    </div>
  </div>

  <div id="MAGMAplots" class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#MAGMAplotsPanel">MAGMA plots (gene-based test)</a></h4>
    </div>
    <div id="MAGMAplotsPanel" class="panel-collapse collapse container">
      <br/>
      <h4>Manhattan plot</h4>
      <span class="form-inline">
        Label top <input class="form-control" type="number" id="topGenes" style="width: 80px;"> genes.<br/>
      </span>
      <div id="geneManhattan" style="text-align: center;"></div>
      <h4>Q-Q plot</h4>
      <div id="geneQQplot" style="text-align: center;"></div>
      <br/>
      <h4>Gene set analysis</h4>
      <span class="info"><i class="fa fa-info"></i>
        MAGMA gene-set analysis is performed for curated gene sets and GO terms obtained from MsigDB (total of 10894 gene sets).<br/>
        The table displays the top the 10 significant gene sets with a maximum of P<sub>bon</sub> < 0.05.
        Full results are downloadable from "Download" tab. <br/>
        Note that MAGMA gene-set analyses uses the full distribution of SNP p-values and is different from a pathway enrichment test as implemented in GENE2FUNC that only tests for enrichment of prioritized genes.          </span><br/><br/>
      <table id="MAGMAtable" class="display compact" width="100%" cellspacing="0" style="display: block; overflow-x: auto;">
        <thead>
          <th>Gene Set</th><th>N genes</th><th>Beta</th><th>Beta STD</th><th>SE</th><th>P</th><th>P<sub>bon</sub></th>
        </thead>
      </table>
    </div>
  </div>

  <div id="GC" class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#GCPanel">Genetic Correlations</a></h4>
    </div>
    <div id="GCPanel" class="panel-collapse collapse container">
      <br/>
      <!-- <div class="row">
        <div class="col-md-6 col-xs-6 col-sm-6"> -->
          <div id="GCplot" style="text-align: center;"></div>
        <!-- </div>
        <div class="col-md-6 col-xs-6 col-sm-6"> -->
          <table class="table table-sm table-bordered" id="GCtable" style="width:80%;  margin:auto;">
            <thead>
              <th>ID</th><th>Trait</th><th>rg</th><th>se</th><th>z</th><th>p</th>
            </thead>
            <tbody id="GCtableBody"></tbody>
          </table>
        <!-- </div>
      </div> -->
      <br/>
    </div>
  </div>
</div>
@stop
