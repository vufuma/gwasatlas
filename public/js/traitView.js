$(document).ready(function(){
  $.ajax({
    url: subdir+"/traitDB/getData",
    type: "POST",
    data: {
      id: id
    },
    error: function(){
      alert("error for getData");
    },
    success: function(data){
      var temp = JSON.parse(data);
      $('#title').html("<h3>atlas ID: "+id+" <strong>"+temp[0]["Trait"]+"</strong></h3>");
      var header = ["id", "PMID", "Year", "File", "Website", "Domain", "ChapterLevel", "SubchapterLevel",
        "Trait", "Population", "Ncase", "Ncontrol", "N", "Genome", "Nsnps", "Nhits", "SNPh2",
        "SNPh2_se", "LambdaGC", "Chi2", "Intercept", "Note"];
      var table = '';
      for(var i=0; i<header.length; i++){
        table += '<tr><td>'+header[i]+'</td>';
        if(header[i]=="PMID"){
          if(temp[0][header[i]].indexOf("Not")>=0){
            table += '<td>'+temp[0][header[i]]+'</td></tr>';
          }else{
            var pmid = temp[0][header[i]].split(":");
            var out = [];
            pmid.forEach(function(d){
              out.push('<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/'+d+'">PMID: '+d+'</a>');
            });
            table += '<td>'+out.join(", ")+'</td></tr>';
          }

        }else if(header[i]=="File" || header[i]=="Website"){
          if(temp[0][header[i]].length>0){
            table += '<td><a target="_blank" href="'+temp[0][header[i]]+'">'+temp[0][header[i]]+"</a>";
          }
        }else{
          table += '<td>'+temp[0][header[i]]+'</td></tr>';
        }
      }
      // table += '</table>';
      $('#infoTable').html(table);
    }
  });

  var file = "magma.sets.top";
  $('#MAGMAtable').DataTable({
    "processing": true,
    serverSide: false,
    select: true,
    "ajax" : {
      url: subdir+"/traitDB/DTfile",
      type: "POST",
      data: {
        id: id,
        infile: file,
        header: "FULL_NAME:NGENES:BETA:BETA_STD:SE:P:Pbon"
      }
    },
    error: function(){
      alert("leadSNPs table error");
    },
    "order": [[6, 'asc']],
    "lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "iDisplayLength": 10
  });

  GWplot(id);
  QQplot(id);

  var nGC = $('#GCtop').val();
  GCplot(id, nGC);
});

function GWplot(id){
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
  // d3.select("#manhattanPane").style("height", height+margin.top+margin.bottom);
  // d3.select("#geneManhattanPane").style("height", height+margin.top+margin.bottom);
  var svg = d3.select("#manhattan").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
  // var canvas1 = d3.select('#manhattanMain')
  //           	.attr("width", width)
  //           	.attr("height", height)
  //           	.node().getContext('2d');
  var svg2 = d3.select("#geneManhattan").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
  // var canvas2 = d3.select('#geneManhattanMain')
  //           	.attr("width", width)
  //           	.attr("height", height)
  //           	.node().getContext('2d');
  d3.json(subdir+"/traitDB/manhattan/"+id+"/manhattan.txt", function(data){
  // d3.tsv("/../IPGAP/sotrage/jobs/"+id+"/manhattan.txt", function(error, data){

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

    // data.forEach(function(d){
    // 		// if(d.p<=0.005 || d.bp%200==0){
    // 			canvas1.beginPath();
    // 			// canvas1.arc( x(d.bp+chromStart[d.chr-1]), y(-Math.log10(d.p)), 2, 0, 2*Math.PI);
    //       canvas1.arc( x(d[1]+chromStart[d[0]-1]), y(-Math.log10(d[2])), 2, 0, 2*Math.PI);
    // 			// if(d.chr%2==0){canvas1.fillStyle="steelblue";}
    //       if(d[0]%2==0){canvas1.fillStyle="steelblue";}
    // 			else{canvas1.fillStyle="blue";}
    // 			canvas1.fill();
    // 		// }
    // 	});

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

  d3.json(subdir+"/traitDB/manhattan/"+id+"/magma.genes.out", function(data){
    data.forEach(function(d){
      // d.CHR = +d.CHR;
  		// d.START = +d.START;
  		// d.STOP = +d.STOP;
  		// d.P = +d.P;
      // d.y = 0;
      d[0] = +d[0]; //chr
      d[1] = +d[1]; //start
      d[2] = +d[2]; //stop
      d[3] = +d[3]; //p
  	});

    var nSigGenes=0;
    var sortedP = [];
    sortedP.push(0);
    data.forEach(function(d){
      if(d[3]<=0.05/data.length){nSigGenes++;}
      sortedP.push(d[3]);
    });
    $('#topGenes').val(nSigGenes);

    $('#geneManhattanDesc').html("Input SNPs were mapped to "+data.length+" protein coding genes (distance 0). "
      +"Genome wide significance (red dashed line in the plot) was defined at P = 0.05/"+data.length+" = "+((0.05/data.length).toExponential())+".");

    sortedP = sortedP.sort(function(a,b){return a-b;});
    // var chr = d3.set(data.map(function(d){return d.CHR;})).values();
    var chr = d3.set(data.map(function(d){return d[0];})).values();
    var max_chr = chr.length;
    var x = d3.scale.linear().range([0, width]);
    x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var y = d3.scale.linear().range([height, 0]);
    // y.domain([0, d3.max(data, function(d){return -Math.log10(d.P);})+1]);
    y.domain([0, d3.max(data, function(d){return -Math.log10(d[3]);})+1]);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    svg2.selectAll("dot.geneManhattan").data(data).enter()
      .append("circle")
      .attr("r", 2)
      .attr("cx", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
      .attr("cy", function(d){return y(-Math.log10(d[3]))})
      .attr("fill", function(d){if(d[0]%2==0){return "steelblue"}else{return "blue"}});

    svg2.selectAll('text.gene').data(data.filter(function(d){if(d[3]<=0.05/data.length){return d;}})).enter()
      .append("text")
      .attr("class", "gene")
      .attr("x", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
      .attr("y", function(d){return y(-Math.log10(d[3]))-2})
      .text(function(d){return d[4]})
      .style("font-size", "10px");

    svg2.append("line")
  	 .attr("x1", 0).attr("x2", width)
    	.attr("y1", y(-Math.log10(0.05/data.length))).attr("y2", y(-Math.log10(0.05/data.length)))
    	.style("stroke", "red")
    	.style("stroke-dasharray", ("3,3"));
  	svg2.append("g").attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
    svg2.append("g").attr("class", "y axis").call(yAxis)
      .selectAll('text').style('font-size', '11px');

  	//Chr label
  	for(var i=0; i<chr.length; i++){
  		svg2.append("text").attr("text-anchor", "middle")
  		.attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
  		.text(chr[i])
      .style("font-size", "10px");
  	}
  	svg2.append("text").attr("text-anchor", "middle")
  	 .attr("transform", "translate("+width/2+","+(height+35)+")")
  	  .text("Chromosome");
    svg2.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
      .text("-log10 P-value");
    svg2.selectAll('path').style('fill', 'none').style('stroke', 'grey');
    svg2.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
    svg2.selectAll('text').style("font-family", "sans-serif");

    $('#topGenes').on("input", function(){
      svg2.selectAll(".gene").remove();
      var n = $('#topGenes').val();
      svg2.selectAll('text.gene').data(data.filter(function(d){if(d[3]<=sortedP[n]){return d;}})).enter()
        .append("text")
        .attr("class", "gene")
        .attr("x", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
        .attr("y", function(d){return y(-Math.log10(d[3]))-2})
        .text(function(d){return d[4]})
        .style("font-size", "10px")
        .style("font-family", "sans-serif");
    })
  });
}

function QQplot(id){
  var margin = {top:30, right: 30, bottom:50, left:50},
      width = 300,
      height = 300;
  // d3.select("#QQplotPane").style("height", height+margin.top+margin.bottom);
  // create svg and canvas objects
  var qqSNP = d3.select("#QQplot").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");
  // var canvasSNP = d3.select('#QQplotMain')
  //               	.attr("width", width+margin.right)
  //               	.attr("height", height+margin.bottom)
  //               	.node().getContext('2d');

  var qqGene = d3.select("#geneQQplot").append("svg")
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
  // var canvasGene = d3.select('#geneQQplotMain')
  //                 	.attr("width", width+margin.right)
  //                 	.attr("height", height+margin.bottom)
  //                 	.node().getContext('2d');
  d3.json(subdir+'/traitDB/QQplot/'+id+'/SNP', function(data){
  	data.forEach(function(d){
  		d.obs = +d.obs;
  		d.exp = +d.exp;
  		// d.n = +d.n;
  	});

  	var x = d3.scale.linear().range([0, width]);
  	var y = d3.scale.linear().range([height, 0]);
    var xMax = d3.max(data, function(d){return d.exp;});
    var yMax = d3.max(data, function(d){return d.obs;});
  	x.domain([0, (xMax+xMax*0.01)]);
  	y.domain([0, (yMax+yMax*0.01)]);
  	var yAxis = d3.svg.axis().scale(y).orient("left");
  	var xAxis = d3.svg.axis().scale(x).orient("bottom");

  	// var maxP = Math.min(d3.max(data, function(d){return d.exp;}), d3.max(data, function(d){return d.obs;}));
    var maxP = Math.min(xMax, yMax);

    // data.forEach(function(d){
  	// 	// if(d.obs>1.5 | d.n%100==0){
  	// 		canvasSNP.beginPath();
  	// 		canvasSNP.arc(x(d.exp), y(d.obs), 2, 0, 2*Math.PI);
  	// 		canvasSNP.fillStyle="grey";
  	// 		canvasSNP.fill();
  	// 	// }
  	// });

    qqSNP.selectAll("dot.QQ").data(data).enter()
      .append("circle")
      .attr("r", 2)
      .attr("cx", function(d){return x(d.exp)})
      .attr("cy", function(d){return y(d.obs)})
      .attr("fill", "grey");
  	qqSNP.append("g").attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")").call(xAxis)
      .selectAll('text').style('font-size', '11px');
    qqSNP.append("g").attr("class", "y axis").call(yAxis)
      .selectAll('text').style('font-size', '11px');
    qqSNP.append("line")
      .attr("x1", 0).attr("x2", x(maxP))
      .attr("y1", y(0)).attr("y2", y(maxP))
      .style("stroke", "red")
      .style("stroke-dasharray", ("3,3"));
    // qqSNP.append("text").attr("text-anchor", "middle")
    //   .attr("transform", "translate("+width/2+","+(-15)+")")
    //   .text("GWAS summary statistics")
    //   .style("font-size", "20px");
    qqSNP.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(-35)+","+height/2+")rotate(-90)")
      .text("Observed -log10 P-value");
    qqSNP.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(width/2)+","+(height+35)+")")
      .text("Expected -log10 P-value");
    qqSNP.selectAll('path').style('fill', 'none').style('stroke', 'grey');
    qqSNP.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
    qqSNP.selectAll('text').style("font-family", "sans-serif");
  });

  d3.json(subdir+'/traitDB/QQplot/'+id+'/Gene', function(data){
  	data.forEach(function(d){
  		d.obs = +d.obs;
  		d.exp = +d.exp;
  		d.n = +d.n;
  	});

  	var x = d3.scale.linear().range([0, width]);
  	var y = d3.scale.linear().range([height, 0]);
    var xMax = d3.max(data, function(d){return d.exp;});
    var yMax = d3.max(data, function(d){return d.obs;});
  	x.domain([0, (xMax+xMax*0.01)]);
  	y.domain([0, (yMax+yMax*0.01)]);
  	var yAxis = d3.svg.axis().scale(y).orient("left");
  	var xAxis = d3.svg.axis().scale(x).orient("bottom");

  	// var maxP = Math.min(d3.max(data, function(d){return d.exp;}), d3.max(data, function(d){return d.obs;}));
    var maxP = Math.min(xMax, yMax);

    // data.forEach(function(d){
  	// 	canvasGene.beginPath();
  	// 	canvasGene.arc(x(d.exp), y(d.obs), 2, 0, 2*Math.PI);
  	// 	canvasGene.fillStyle="grey";
  	// 	canvasGene.fill();
  	// });

    qqGene.selectAll("dot.geneQQ").data(data).enter()
      .append("circle")
      .attr("r", 2)
      .attr("cx", function(d){return x(d.exp)})
      .attr("cy", function(d){return y(d.obs)})
      .attr("fill", "grey");
  	qqGene.append("g").attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")").call(xAxis)
      .selectAll('text').style('font-size', '11px');
    	qqGene.append("g").attr("class", "y axis").call(yAxis)
      .selectAll('text').style('font-size', '11px');
  	qqGene.append("line")
    	.attr("x1", 0).attr("x2", x(maxP))
    	.attr("y1", y(0)).attr("y2", y(maxP))
    	.style("stroke", "red")
    	.style("stroke-dasharray", ("3,3"));
    // qqGene.append("text").attr("text-anchor", "middle")
    //   .attr("transform", "translate("+width/2+","+(-15)+")")
    //   .text("Gene-based statistics")
    //   .style("font-size", "20");
    qqGene.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(-35)+","+height/2+")rotate(-90)")
      .text("Observed -log10 P-value");
    qqGene.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(width/2)+","+(height+35)+")")
      .text("Expected -log10 P-value");
    qqGene.selectAll('path').style('fill', 'none').style('stroke', 'grey');
    qqGene.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
    qqGene.selectAll("text").style("font-family", "sans-serif");
  });
}

function GCupdate(){
  if(event.keyCode==13){
    var nGC = $('#GCtop').val();
    GCplot(id, nGC);
  }
}

function GCplot(id, n){
  d3.select("#GCplot").select("svg").remove();
  d3.json(subdir+'/traitDB/GCplot/'+id+'/'+n, function(data){
    if(data==null || data==undefined || data.length==0){
      table = '<tr><td colspan="7" style="text-align:center;"> No data available.</td></tr>';
      $('#GCtableBody').html(table);
    }else{
      var table="";
      var maxLabel = 0;
      data.forEach(function(d){
        d.id = +d.id;
        d.rg = +d.rg;
        d.se = +d.se;
        d.z = +d.z;
        d.p = +d.p;
        d.pbon = +d.pbon;
        if(d.Trait.length>maxLabel){maxLabel = d.Trait.length}
        table += "<tr>";
        table += "<td>"+d.id+"</td>";
        table += "<td>"+d.Trait+"</td>";
        table += "<td>"+d.rg+"</td>";
        table += "<td>"+d.se+"</td>";
        table += "<td>"+d.z+"</td>";
        table += "<td>"+d.p+"</td>";
        table += "<td>"+d.pbon+"</td>";
        table += "</tr>";
      })
      $('#GCtableBody').html(table);
      var margin = {top:30, right: 30, bottom:50, left:6*maxLabel},
          width = 300,
          height = 30*data.length;
      var svg = d3.select("#GCplot").append("svg")
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")");
      var y_element = data.map(function(d){return d.id+":"+d.Trait;});
      var y = d3.scale.ordinal().domain(y_element).rangeRoundBands([0,height], 0.1);
      var x = d3.scale.linear().range([0, width]);
      x.domain([-d3.max(data, function(d){return Math.abs(d.rg);})-d3.max(data, function(d){return d.se;}),
        d3.max(data, function(d){return Math.abs(d.rg);})+d3.max(data, function(d){return d.se;})]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom");
      var yAxis = d3.svg.axis().scale(y).orient("left");

      svg.append("rect").attr("x", x(0)).attr("y", 0)
        .attr("width", 0.05).attr("height", height)
        .style("stroke", "grey");
      svg.selectAll("rect.bar").data(data).enter()
        .append('rect')
        .attr('x', function(d){
          if(d.rg>0){return x(0)}
          else{return x(d.rg)}
        })
        .attr('y', function(d){return y(d.id+":"+d.Trait)})
        .attr('width', function(d){
          if(d.rg>0){return x(d.rg)-x(0)}
          else{return x(0)-x(d.rg)}
        })
        .attr('height', y.rangeBand())
        .attr("fill", function(d){
          if(d.p>=0.05){return "grey"}
          else if(d.rg>0){return "red"}
          else{return "blue"}
        })
        .attr("opacity", function(d){
          if(d.pbon<0.05){return 0.8}
          else{return 0.5}
        });
      svg.selectAll("rect.error").data(data).enter()
        .append('rect')
        .attr('x', function(d){return x(d.rg-d.se)})
        .attr('y', function(d){return y(d.id+":"+d.Trait)+13})
        .attr('height', 1)
        .attr('width', function(d){return x(d.rg+d.se)-x(d.rg-d.se)})
        .attr('fill', 'black');
      svg.append('g').attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis);
      svg.append('g').attr("class", "y axis")
        .call(yAxis);
    }
  });
}
