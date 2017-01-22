<!-- Header -->
<!-- <div id="logo"> -->
  <!-- <h1>Interactive post-GWAS pipeline
    <span style="color: #1E90FF; font-size: 150%">IPGAP</span>
  </h1>
  <p style="font-size:18px; color: #818588;">Interactive tools to identify causal SNPs and genes from GWAS summary statistics.</p> -->
  <!-- <h1>the Annotation and Prioritization Platform
    <span style="color: #1E90FF; font-size: 150%">ANNOTATOR</span>
  </h1>
  <p style="font-size:18px; color: #818588;">Interactive tools to annotate, prioritize and visualiz potential causal SNPs and genes from GWAS summary statistics.</p> -->

<!-- </div> -->

<!-- Tab bar -->
<nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header" style="padding-left: 30px;">
      <!-- <a class="navbar-brand" href="{{ Config::get('app.subdir') }}/"><span style="color: #1E90FF; font-size: 130%;">IPGAP</span></a> -->
      <a class="navbar-brand" href="{{ Config::get('app.subdir') }}/" style="padding-top: 5px;">
        <img src="{!! URL::asset('image/atlas.png') !!}" height="50px;">
        <!-- <span style="color:#fff; font-size:30px;">FUMA</span> -->
      </a>
    </div>

    <div class="collapse navbar-collapse" id="headNav" style="padding-right: 50px;">
      <ul class="nav navbar-nav navbar-right">
        <!-- local_start -->
        <li class="{{ Request::is('/') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/">Home</a></li>
        <li class="{{ Request::is('howto') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/howto">How to use</a></li>
        <li class="{{ Request::is('traitDB*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/traitDB">Trait Database</a></li>
      </ul>
    </div>
  </div>
</nav>
