@extends('layouts.master')
@section('head')
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<meta name="csrf-token" content="{{ csrf_token() }}"/>
<script type="text/javascript">
	$.ajaxSetup({
		headers: {'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')}
	});
</script>
<script type="text/javascript" src="{!! URL::asset('js/odometer.min.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/odometer-theme-default.css') !!}">
<script type="text/javascript">
	$(document).ready(function(){
		$.ajax({
			url: "/home/dbSum",
			type: "POST",
			success: function(data){
				data = JSON.parse(data);
				$('#totalGWAS').html(data.GWAS);
				$('#uniqTrait').html(data.trait);
				$('#uniqStudy').html(data.study);
				$('#uniqDomain').html(data.domain);
			}
		});
	});
</script>
@stop

@section('content')
<div class="container" style="padding-top:50px;">
	<div style="text-align: center;">
		<h2>Welcome to GWAS ATLAS</h2>
	</div>
	<br/>
	<p>
		GWAS atlas is a databased of publicly available GWAS summary statistics.
		Each GWAS can be borwsed their manhattan plot, risk loci, MAGMA results, SNP heritability and genetic correlations with other GWAS in the database.
		600 GWAS were performed in this project based on UK Biobank release 2 data under applicationID 1640.
		Each summary statistics can be downloaded from the original source following links (not directly from thie GWAS atlas website).
		Pre-processed summary statistics (not downloadable) can be transfered to FUMA to further annotate risk loci.
	</p>
	<p>
		If you have/find GWAS summary statistics which is publicly avaialble and not included in this database, please let us know by contacting Kyoko Watanabe (k.watanabe@vu.nl).
	</p>
	<p>
		<strong>Citation:</strong><br/>
		Under preparation.
	</p>
	<br/>
	<p style="font-size: 18px;">
		Currently the database contains <span style="font-size:28px; color:#FF5C33;" class="odometer" id="totalGWAS"></span> GWAS from
		<span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqStudy"></span> unique studies
		across <span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqTrait"></span> unique traits and
		<span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqDomain"></span> domains.
	</p>
	<br/><br/>
	<div class="row">
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-success">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>Browse GWAS</h4></div>
				<div class="panel-body" style="height:160px;">
					Overview of each GWAS such as Manhattan plots and QQ plot at SNP and gene levels, genetic ocrrelations with other GWAS in the database.<br/>
					<br/><br/>
					<button class="btn btn-success" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/traitDB" style="color:black;">Browse GWAS</a></button>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-warning">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>Multiple GWAS comparison</h4></div>
				<div class="panel-body" style="height:160px;">
					Multiple GWAS can be compared in terms of genetic correlations, overlap of significant genes based on MAGMA gene-analysis and overlap of genetic risk loci.<br/>
					<br/>
					<button class="btn btn-warning" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/multiGWAS" style="color:black;">Multiple GWAS comparison</a></button>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-info">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>Summary of database</h4></div>
				<div class="panel-body" style="height:160px;">
					Overview of the database such as number of GWAS, traits, study and sample size per domain.<br/>
					<br/><br/><br/>
					<button class="btn btn-info" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/stats" style="color:black;">Stats</a></button>
				</div>
			</div>
		</div>
	</div>

	<div style="padding-top:20ox; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>What's new</h4></div>
			<div class="panel-body" style="max-height:200px; overflow-y:auto;">
				<strong>2017-12-xx</strong><br/>
				<span style="padding-left:20px">
					First release of GWAS atlas with 3795 GWAS summary statistics.
					Publication is under preparation.
				</span>
			</div>
		</div>
	</div>

	<!-- <div style="padding-top:20ox; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>Project contributers</h4></div>
			<div class="panel-body">
				Ordered by first name.
				<ul>
					<li>Danielle Posthuma (VU University Amssterdam, Complex Trait Genetics)</li>
					<li>Kyoko Watanabe (VU University Amsterdam, Complex Trait Genetics)</li>
				</ul>
			</div>
		</div>
	</div> -->

</div>
</br>
@stop
