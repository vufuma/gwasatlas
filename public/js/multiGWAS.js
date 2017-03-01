var selectTable;
var selectedTable;
var maxSelect = 5;
$(document).ready(function(){
  // selectTable = $('#selectTable').DataTable();
  Selection("Domain");

  var hash = window.location.hash;
  var panel = "";
  if(hash){
    panel = hash;
  }else{
    panel = "manhattan";
  }
  $("#sidebar.sidebar-nav").find(".active").removeClass("active");
  $("#sidebar.sidebar-nav a[href='"+panel+"']").parent().addClass("active");

  loadPanel(panel);

  $('#sidebar.sidebar-nav li a').click(function(){
    panel = $(this).attr("href");
    loadPanel(panel);
  });

  $('#selectTable tbody').on('click', 'tr', function(){
    var rowData = selectTable.row(this).data();
    var add = true;
    $('#selectedGWAS input').each(function(i, d){
      if($(d).val() == rowData['ID']){
        add = false;
        return false;
      }
    });
    if(add){
      selected = '<div class="selectedGWAS"><input type="checkbox" class="form-contorl" value="'+rowData['ID']+'"/>'
        +" "+rowData['ID']+": "+rowData['Domain']+'; '+rowData['ChapterLevel']+'; '+rowData['SubchapterLevel']+'; '+rowData['Trait']+'</div>'
      $('#selectedGWAS').append(selected)
    }
  });

  $('#delGWAS').on('click', function(){
    $(".selectedGWAS").each(function(){
      if($(this).children("input").is(":checked")){
        $(this).remove();
      }
    });
    loadPanel(panel);
  });

  $('#updatePlot').on('click', function(){
    loadPanel(panel);
  })
});

function Selection(type){
  var domain = $('#Domain').val();
  var chapter = $('#Chapter').val();
  var subchapter = $('#Subchapter').val();
  var trait = $('#Trait').val();
  var yearFrom = $('#yearFrom').val();
  var yearTo = $('#yearTo').val();
  var nMin = $('#nMin').val();
  var nMax = $('#nMax').val();
  if(yearFrom==""){yearFrom="null"}
  if(yearTo==""){yearTo="null"}
  if(nMin==""){nMin="null"}
  if(nMax==""){nMax="null"}

  if(type=="Domain"){
    chapter="null";
    subchapter="null";
    trait="null";
  }else if(type=="Chapter"){
    subchapter="null";
    trait="null";
  }else if(type=="Subchapter"){
    trait="null";
  }
  // $('#test').html(type+":"+domain+":"+chapter+":"+subchapter);
  SelectOptions(type, domain, chapter, subchapter, trait);
  TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
}

function SelectOptions(type, domain, chapter, subchapter, trait){
  $.ajax({
    url: subdir+"/traitDB/SelectOption",
    type: "POST",
    data: {
      type: type,
      domain: domain,
      chapter: chapter,
      subchapter: subchapter
    },
    processing: true,
    success: function(data){
      if(type=="Domain"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }else if(type=="Chapter"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }else if(type=="Subchapter"){
        data = JSON.parse(data);
        $.each(data, function(key, val){
          var out = '<option value=null>-- Please select '+key+' of interest --</option>';
          $.each(val, function(k, v){
            out += '<option value="'+k+'">'+k+' ('+v+')</option>';
          });
          $('#'+key).html(out).selectpicker('refresh');
        });
      }
    }
  });
}

function SelectEnter(ele){
  if(event.keyCode==13){
    var domain = $('#Domain').val();
    var chapter = $('#Chapter').val();
    var subchapter = $('#Subchapter').val();
    var trait = $('#Trait').val();
    var yearFrom = $('#yearFrom').val();
    var yearTo = $('#yearTo').val();
    var nMin = $('#nMin').val();
    var nMax = $('#nMax').val();
    if(yearFrom==""){yearFrom="null"}
    if(yearTo==""){yearTo="null"}
    if(nMin==""){nMin="null"}
    if(nMax==""){nMax="null"}

    TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
  }
}

function TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax){
  $('#selectTable').DataTable().destroy();
  selectTable = $('#selectTable').DataTable({
    processing: false,
    serverSide: false,
    select: true,
    autoWidth: false,
    "ajax" : {
      url: subdir+"/traitDB/dbTable",
      type: "POST",
      data: {
        domain: domain,
        chapter: chapter,
        subchapter: subchapter,
        trait: trait,
        yearFrom: yearFrom,
        yearTo: yearTo,
        nMin: nMin,
        nMax: nMax
      }
    },
    error: function(){

    },
    "columns":[
      {"data": "ID", name: "ID"},
      {"data": "PMID", name:"PMID"},
      {"data": "Year", name: "Year"},
      {"data": "Domain", name: "Domain"},
      {"data": "ChapterLevel", name: "Chapter level"},
      {"data": "SubchapterLevel", name: "Subchapter level"},
      {"data": "Trait", name: "Trait"},
      {"data": "Population", name: "Populaion"},
      {"data": "Ncase", name: "Case"},
      {"data": "Ncontrol", name: "Control"},
      {"data": "N", name: "N"}
    ],
    columnDefs: [
      {width:"200px", target:4}
    ],
    "lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "iDisplayLength": 10
  });
}

function loadPanel(panel){
  switch (panel) {
    case "#manhattan":
      manhattan();
      break;
    case "#geneManhattan":
      geneManhattan();
      break;
    case "#magma":
      magma();
      break;
    case "#GC":
      GC();
      break;
    default:
      manhattan();
  }
}

function manhattan(){
  ids = []
  $(".selectedGWAS").each(function(){
    ids.push($(this).children("input").val())
  })
  if(ids.length==0){
    $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
  }else{
    $('#panel').html('<div style="text-align: center;" id="plot"></div>');
    ids.forEach(function(id){
      // $('#plot').append("manhattan plot of ID "+id+"<br/>");
      PlotManhattan(id, "snps");
    })
  }
}

function geneManhattan(){
  ids = []
  $(".selectedGWAS").each(function(){
    ids.push($(this).children("input").val())
  })
  if(ids.length==0){
    $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
  }else{
    $('#panel').html('<div style="text-align: center;" id="plot"></div>');
    ids.forEach(function(id){
      // $('#plot').append("gene manhattan plot of ID "+id+"<br/>");
      PlotManhattan(id, "genes");
    })
  }
}

function magma(){
  ids = []
  $(".selectedGWAS").each(function(){
    ids.push($(this).children("input").val())
  })
  if(ids.length==0){
    $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
  }else{
    $('#panel').html('<div style="text-align: center;" id="plot"></div>');
    ids.forEach(function(id){
      $('#plot').append("magma genes plot of ID "+id+"<br/>");
    })
  }
}

function GC(){
  ids = []
  $(".selectedGWAS").each(function(){
    ids.push($(this).children("input").val())
  })
  if(ids.length==0){
    $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
  }else{
    $('#panel').html('<div style="text-align: center;" id="plot"></div>');
    ids = ids.join(":");
    PlotCG(ids);
  }
}

function showPlots(ID){
  var curHeight = $('#ManhattanPanel').height();
  var chromSize = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067,
    159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540,
    102531392, 90354753, 81195210, 78077248, 63025520, 59128983, 48129895, 51304566, 155270560];
  var chromStart = [];
  chromStart.push(0);
  for(var i=1; i<chromSize.length; i++){
    chromStart.push(chromStart[i-1]+chromSize[i-1]);
  }

  var margin = {top:30, right: 30, bottom:50, left:50},
      width = 800,
      height = 300;

  d3.select('#ManhattanPanel').style("height", curHeight+height+margin.top+margin.bottom);
  $('#ManhattanPanel').append('<div id="manhattan'+ID+'Panel" style="position: relative; height:'+(height+margin.top+margin.bottom)+';"></div>');
  $('#manhattan'+ID+"Panel").append('<div id="manhattan'+ID+'" class="canvasarea"></div>')
  var svg = d3.select("#manhattan"+ID).append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
  var canvas1 = d3.select('#manhattan'+ID).append("div").attr("class", "canvasarea")
               .style("left", margin.left)
              .style("top", margin.top)
              .append("canvas")
              .attr("class", "canvasarea")
              .attr("width", width)
              .attr("height", height)
              .node().getContext('2d');

  d3.json("GWASresult/manhattan/gwasDB/"+ID+"/manhattan.txt", function(data){
    data.forEach(function(d){
  		// d.chr = +d.chr;
  		// d.bp = +d.bp;
  		// d.p = +d.p;
      // d.y = 0;
      d[0] = +d[0]; //chr
      d[1] = +d[1]; // bp
      d[2] = +d[2]; // p
  	});
    // var chr = d3.set(data.map(function(d){return d.chr;})).values();
    var chr = d3.set(data.map(function(d){return d[0];})).values();

    var max_chr = chr.length;
    var x = d3.scale.linear().range([0, width]);
    x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var y = d3.scale.linear().range([height, 0]);
    // y.domain([0, d3.max(data, function(d){return -Math.log10(d.p);})+1]);
    y.domain([0, d3.max(data, function(d){return -Math.log10(d[2]);})+1]);

    var yAxis = d3.svg.axis().scale(y).orient("left");

    data.forEach(function(d){
    		// if(d.p<=0.005 || d.bp%200==0){
    			canvas1.beginPath();
    			// canvas1.arc( x(d.bp+chromStart[d.chr-1]), y(-Math.log10(d.p)), 2, 0, 2*Math.PI);
          canvas1.arc( x(d[1]+chromStart[d[0]-1]), y(-Math.log10(d[2])), 2, 0, 2*Math.PI);
    			// if(d.chr%2==0){canvas1.fillStyle="steelblue";}
          if(d[0]%2==0){canvas1.fillStyle="steelblue";}
    			else{canvas1.fillStyle="blue";}
    			canvas1.fill();
    		// }
    	});

    svg.append("line")
  	 .attr("x1", 0).attr("x2", width)
    	.attr("y1", y(-Math.log10(5e-8))).attr("y2", y(-Math.log10(5e-8)))
    	.style("stroke", "red")
    	.style("stroke-dasharray", ("3,3"));
  	svg.append("g").attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
    svg.append("g").attr("class", "y axis").call(yAxis);

    //Chr label
  	for(var i=0; i<chr.length; i++){
  		svg.append("text").attr("text-anchor", "middle")
  		.attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
  		.text(chr[i])
      .style("font-size", "10px");
  	}
  	svg.append("text").attr("text-anchor", "middle")
  	 .attr("transform", "translate("+width/2+","+(height+35)+")")
  	  .text("Chromosome");
    svg.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
      .text("-log10 P-value");
  });
}

function PlotManhattan(id, type){
  var chromSize = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067,
    159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540,
    102531392, 90354753, 81195210, 78077248, 63025520, 59128983, 48129895, 51304566, 155270560];
  var chromStart = [];
  chromStart.push(0);
  for(var i=1; i<chromSize.length; i++){
    chromStart.push(chromStart[i-1]+chromSize[i-1]);
  }
  var margin = {top:30, right: 200, bottom:50, left:50},
      width = 800,
      height = 100;

  // create svg and canvas object
  var svg = d3.select("#plot").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
  // var canvas1 = d3.select('#SNPsManhattan').append("div").attr("class", "canvasarea")
  // 	           .style("left", margin.left)
  //           	.style("top", margin.top)
  //           	.append("canvas")
  //           	.attr("class", "canvasarea")
  //           	.attr("width", width)
  //           	.attr("height", height)
  //           	.node().getContext('2d');

  var x = d3.scale.linear().range([0, width]);

  if(type=="snps"){
    // plot SNPs manhattan
    d3.json(subdir+"/multiGWAS/manhattan/"+id+"/manhattan.txt", function(data){
      data.forEach(function(d){
        d[0] = +d[0]; //chr
        d[1] = +d[1]; // bp
        d[2] = +d[2]; // p
    	});
      // var chr = d3.set(data.map(function(d){return d.chr;})).values();
      var chr = d3.set(data.map(function(d){return d[0];})).values();

      var max_chr = chr.length;
      var x = d3.scale.linear().range([0, width]);
      x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom");
      var y = d3.scale.linear().range([height, 0]);
      // y.domain([0, d3.max(data, function(d){return -Math.log10(d.p);})+1]);
      y.domain([0, d3.max(data, function(d){return -Math.log10(d[2]);})+1]);

      var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);

      svg.selectAll("dot.manhattan").data(data).enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function(d){return x(d[1]+chromStart[d[0]-1])})
        .attr("cy", function(d){return y(-Math.log10(d[2]))})
        .attr("fill", function(d){if(d[0]%2==0){return "steelblue"}else{return "blue"}});

      svg.append("line")
    	 .attr("x1", 0).attr("x2", width)
      	.attr("y1", y(-Math.log10(5e-8))).attr("y2", y(-Math.log10(5e-8)))
      	.style("stroke", "red")
      	.style("stroke-dasharray", ("3,3"));
    	svg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
      svg.append("g").attr("class", "y axis").call(yAxis)
        .selectAll('text').style('font-size', '11px');

      // d3.timer(moveCircles);
      // var duration = 2000;
      // var timeScale = d3.scale.linear()
      // 	.domain([0, duration])
      // 	.range([0,1]);
      // var renderTime = 0;
      // function moveCircles(t) {
    	// 	data.forEach(function(d){
    	// 		d.y = (t/duration)*-Math.log10(d.p);
    	// 	});
    	// 	drawCircles();
    	// 	if(t >= duration){
    	// 		console.log('Render time:', renderTime);
    	// 		return true;
    	// 	}
    	// }
      //
      // function drawCircles(point) {
    	// 	var start = new Date();
    	// 	canvas1.clearRect(0, 0, width, height);
    	// 	//fill = point ? "#e4e5e5" : "steelblue";
    	// 	data.forEach(function(d) {
      //     if(d.chr%2==0){canvas1.fillStyle="steelblue";}
      //     else{canvas1.fillStyle="blue";}
    	// 		canvas1.beginPath();
    	// 		canvas1.moveTo(x(d.bp+chromStart[d.chr-1]), y(d.y));
    	// 		canvas1.arc(x(d.bp+chromStart[d.chr-1]), y(d.y), 2, 0, 2 * Math.PI);
    	// 		canvas1.fill();
    	// 	});
    	// 	var end = new Date();
    	// 	renderTime += (end-start);
    	// }

      //Chr label
      for(var i=0; i<chr.length; i++){
        svg.append("text").attr("text-anchor", "middle")
        .attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
        .text(chr[i])
        .style("font-size", "10px");
      }

      svg.append("text").attr("text-anchor", "middle")
    	 .attr("transform", "translate("+width/2+","+(height+35)+")")
    	  .text("Chromosome");
      svg.append("text").attr("text-anchor", "middle")
        .attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
        .text("-log10 P-value");
      svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
      svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
      svg.selectAll('text').style("font-family", "sans-serif");
    });
  }else if(type=="genes"){
    // plot gene manhattan
    d3.json(subdir+"/multiGWAS/manhattan/"+id+"/magma.genes.out", function(data){
      data.forEach(function(d){
        d[0] = +d[0]; //chr
        d[1] = +d[1]; //start
        d[2] = +d[2]; //stop
        d[3] = +d[3]; //p
    	});

      $('#geneManhattanDesc').html("Input SNPs were mapped to "+data.length+" protein coding genes (distance 0). "
        +"Genome wide significance (red dashed line in the plot) was defined at P = 0.05/"+data.length+" = "+((0.05/data.length).toExponential())+".");

      // sortedP = sortedP.sort(function(a,b){return a-b;});
      // var chr = d3.set(data.map(function(d){return d.CHR;})).values();
      var chr = d3.set(data.map(function(d){return d[0];})).values();
      var max_chr = chr.length;
      var x = d3.scale.linear().range([0, width]);
      x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom");
      var y = d3.scale.linear().range([height, 0]);
      // y.domain([0, d3.max(data, function(d){return -Math.log10(d.P);})+1]);
      y.domain([0, d3.max(data, function(d){return -Math.log10(d[3]);})+1]);
      var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);

      svg.selectAll("dot.geneManhattan").data(data).enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
        .attr("cy", function(d){return y(-Math.log10(d[3]))})
        .attr("fill", function(d){if(d[0]%2==0){return "steelblue"}else{return "blue"}});

      svg.append("line")
    	 .attr("x1", 0).attr("x2", width)
      	.attr("y1", y(-Math.log10(0.05/data.length))).attr("y2", y(-Math.log10(0.05/data.length)))
      	.style("stroke", "red")
      	.style("stroke-dasharray", ("3,3"));
    	svg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
      svg.append("g").attr("class", "y axis").call(yAxis)
        .selectAll('text').style('font-size', '11px');

    	//Chr label
    	for(var i=0; i<chr.length; i++){
    		svg.append("text").attr("text-anchor", "middle")
    		.attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
    		.text(chr[i])
        .style("font-size", "10px");
    	}
    	svg.append("text").attr("text-anchor", "middle")
    	 .attr("transform", "translate("+width/2+","+(height+35)+")")
    	  .text("Chromosome");
      svg.append("text").attr("text-anchor", "middle")
        .attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
        .text("-log10 P-value");
      svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
      svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
      svg.selectAll('text').style("font-family", "sans-serif");

    });
  }
}

function PlotGC(ids){
  console.log(ids);
  d3.json(subdir+"/multiGWAS/GCplot/"+ids, function(data){
    if(data.length == 0 || data == undefined || data == null){
      $('#plot').html("No genetic correlatioin is available for selected GWAS.");
    }else{
      $('#plot').html("heatmap here");
    }
  });
}
