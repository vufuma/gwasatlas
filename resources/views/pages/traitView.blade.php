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
<script type="text/javascript" src="{!! URL::asset('js/global.js') !!}"></script>
<script type="text/javascript" src="{!! URL::asset('js/traitView.js') !!}"></script>

@stop

@section('content')
<div style="padding-top: 50px; padding-right: 50px; padding-left: 50px;">
	<div id="title"></div>

	<div class="row">
		<div class="col-md-3 col-sm-3 col-xs-3">
			<div id="info" class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">GWAS information</h4>
				</div>
				<div id="infoPanel" class="panel-body" style="overflow: auto; height: 950px;">
					<table class="table table-sm table-bordered" style="width: 100%; margin:auto;">
						<thead>
							<th>Feature</th><th>Value</th>
						</thead>
						<tbody id="infoTable">
						</tbody>
					</table>
					<br/>
				</div>
			</div>
		</div>

		<div class="col-md-9 col-sm-9 col-xs-9">
			<div id="SNPplots" class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">SNPs plots</h4>
				</div>
				<div id="SNPplotsPanel" class="panel-body" style="height:950px; overflow-y:auto;">
					<h4>Manhattan plot</h4>
					<span class="info"><i class="fa fa-info"></i>
						For plotting, overlapping data points are not drawn (filtering was performed only for SNPs with P-value &ge; 1e-5, see documentation for more details of filtering).
					</span><br/>
					<div style="overflow:auto;">
						<div id="manhattan" style="text-align: center;"></div>
					</div>
					<div class="row">
						<div class="col-md-5 col-sm-5 col-xs-5" style="overflow-x: auto;">
							<h4>Q-Q plot</h4>
							<span class="info"><i class="fa fa-info"></i>
								For plotting purposes, overlapping data points are not drawn (filtering was performed only for SNPs with P-value &ge; 1e-5, see documentation for details of filtering).
							</span><br/>
							<div id="QQplot" style="text-align:"></div>
						</div>
						<div class="col-md-7 col-sm-7 col-xs-7" style="overflow-x: auto;">
							<h4>Top SNPs</h4>
							<span class="info"><i class="fa fa-info"></i>
								Top SNPs are defined as the most significant SNP in a genomic risk locus. See documentation for details of definition of the genomic risk loci.
							</span><br/><br/>
							<table id="topSNPtable" class="display compact nowrap row-border dt-body-right dt-head-center" cellspacing="0" style="display: block; overflow-x: auto; font-size: 14px;">
								<thead>
									<th>CHR</th>
									<th>POS</th>
									<th>rsID</th>
									<th>P</th>
								</thead>
							</table>
						</div>
					</div>
					<br/>
				</div>
			</div>
		</div>
	</div>

	<div id="MAGMAplots" class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">MAGMA plots (gene-based test)</h4>
		</div>
		<div id="MAGMAplotsPanel" class="panel-body" style="overflow-y:auto;">
			<div class="row">
				<div class="col-md-8 col-sm-8 col-xs-8" style="overflow-x: auto;">
					<h4>Manhattan plot</h4>
					<span class="form-inline">
					Label top <input class="form-control" type="number" id="topGenes" style="width: 80px;"> genes.<br/>
					</span>
					<div id="geneManhattanDesc"></div>
					<div id="geneManhattan" style="text-align: center;"></div>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4" style="overflow-x: auto;">
					<h4>Q-Q plot</h4>
					<div id="geneQQplot" style="text-align: center;"></div>
				</div>
			</div>
			<h4>Gene set analysis</h4>
			<span class="info"><i class="fa fa-info"></i>
				MAGMA gene-set analysis is performed for curated gene sets and GO terms obtained from MsigDB (total of 10894 gene sets).<br/>
				The table displays either significant gene sets with P<sub>bon</sub> < 0.05 or the top 10 gene sets sorted by P-value.
			</span><br/><br/>
			<table id="MAGMAtable" class="display compact nowrap" cellspacing="0" style="display: block; overflow-x: auto; font-size: 14px;">
				<thead>
					<th>Gene Set</th><th>N genes</th><th>Beta</th><th>Beta STD</th><th>SE</th><th>P</th><th>P<sub>bon</sub></th>
				</thead>
			</table>
		</div>
	</div>


	<div id="GC" class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Genetic Correlations</h4>
		</div>
		<div id="GCPanel" class="panel-body">
			<h4>GWAS selection</h4>
			<span class="info"><i class="fa fa-info"></i>
				GWAS with sample size > 5,000, the number of SNPs > 450,000, SNP h2 Z-score > 2, EUR popultaion and non-sex specific trait are available.
			</span><br/><br/>
			<div id="pheSelection" style="padding-left:50px; padding-right:50px; padding-top:20px; padding-bottom:20px; border: 2px solid grey; border-radius: 15px;">
				<div class="row">
					<div class="col-md-6 col-sm-6 col-xs-6">
						<span class="form-inline"><input class="form-control" type="checkbox" id="GC_excSamePhe" name="GC_excSamePhe"> Exclude the same trait (if there is any).</span>
						<a class="infoPop" data-toggle="popover" data-content="This option removes GWAS with exactly the same trait name (excluding texts within parentheses) are excluded. For example, 'Body Mass Index' and 'Body Mass Index (male)' are considered as the same trait.">
							<i class="fa fa-question-circle-o fa-lg"></i>
						</a>
						<br/>
						<span class="form-inline"><input class="form-control" type="checkbox" id="GC_maxNPhe" name="GC_maxNPhe"> Select GWAS with the maximum sample size per trait.</span>
						<a class="infoPop" data-toggle="popover" data-content="This option takes the GWAS with the maximum number of samples size per trait (sxact same name excluding texts within parenthese) after excluding GWAS which do not meet the criteia to perform LD score regression. See documentation for details.">
							<i class="fa fa-question-circle-o fa-lg"></i>
						</a>
						<br/>
						<span class="form-inline">P-value threshold: <input class="form-control" type="number" id="GC_p" name="GC_p" value="1" style="width:150px;"></span><br/>
						<span class="form-inline">P<sub>bon</sub> threshold: <input class="form-control" type="number" id="GC_pbon" name="GC_pbon" value="1" style="width:150px;"></span><br/>
						<span class="form-inline">Display top <input class="form-control" type="number" id="GC_topN" name="GC_topN" value="10" style="width:150px;"> correlated phenotypes.</span><br/>
					</div>
					<div class="col-md-6 col-sm-6 col-xs-6">
						<span class="form-inline"><input class="form-control" type="checkbox" id="GC_manual" name="GC_manual" onchange='GCManualSelectCheck()'> Manually select GWAS.</span>
						<a class="infoPop" data-toggle="popover" data-content="Check this option to enable manual selection of GWAS.
						Note taht other filtering options defined left are also applied.">
							<i class="fa fa-question-circle-o fa-lg"></i>
						</a>
						<br/>
						<!-- <select multiple class="form-control" size="10" id="GC_manual_select" style="overflow-x:auto;">
						</select> -->
						<div class="panel panel-default">
							<div class="panel-heading" style="padding:5px;padding-left:10px;">
								Selected trait (<span id="GC_manual_n">0</span>)
								<a id="GC_manual_clear">Clear</a>
							</div>
							<div class="panel-body" style="padding:5px;padding-left:10px;">
								<input id="GC_manual_search" type="search" placeholder="Search trait name" class="form-control" style="height:20px;width:200px;text-size:12px;"/>
								<div id="GC_manual_select" class="GC_manual_select" style="max-height:120px;overflow:auto;font-size:12px;"></div>
							</div>
						</div>
					</div>
				</div>
				<br/>
				<button class="btn btn-default btn-md" id="GC_update" name="GC_update">Update</button>
			</div>
			<br/>
			<div class="row">
				<div class="col-md-5 col-sm-5 col-xs-5" style="overflow-x:auto;">
					<h4>GC plot</h4>
					<div id="GCtotalN"></div>
					<div id="GCplot" style="text-align: center;"></div>
				</div>
				<div class="col-md-7 col-sm-7 col-xs-7" style="overflow-x:auto;">
					<h4>GC table</h4>
					<table class="table table-sm table-bordered" id="GCtable" style="width:80%; margin:auto; font-size:12px;">
						<thead>
							<th>ID</th><th>Trait</th><th>rg</th><th>se</th><th>z</th><th>P</th><th>P-bon</th>
						</thead>
						<tbody id="GCtableBody"></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
@stop
