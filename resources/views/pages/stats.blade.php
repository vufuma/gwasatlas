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
<script type="text/javascript" src="{!! URL::asset('js/stats.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/style.css') !!}">
@stop

@section('content')
<div style="padding:50px;">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#PhePanel">Phenotypes in GWAS ATLAS</a></h4>
    </div>
    <div id="PhePanel" class="panel-collapse collapse in">
      <br/>
      <div class="row">
        <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">
          <h4>Domain</h4>
          <div id="DomainPlot"></div>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">
          <h4>Chapter level</h4>
          <div id="ChapterPlot"></div>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-4" style="text-align: center;">
          <h4>Subchapter level</h4>
          <div id="SubchapterPlot"></div>
        </div>
      </div>
      <br/>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#NsampleYearPanel">Smple size per year</a></h4>
    </div>
    <div id="NsampleYearPanel" class="panel-collapse collapse in">
      <div id="NsampleYearPlot" style="text-align: center;">
      </div>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title"><a data-toggle="collapse" href="#NsampleDomainPanel">Smple size per domain</a></h4>
    </div>
    <div id="NsampleDomainPanel" class="panel-collapse collapse in">
      <div id="NsampleDomainPlot" style="text-align: center;">
      </div>
    </div>
  </div>
</div>
@stop
