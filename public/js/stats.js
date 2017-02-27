$(document).ready(function(){
  DomainPiePlot();
  NsampleYearPlot();
});

function DomainPiePlot(){
  var margin = {top:50, right: 50, bottom:50, left:50},
      width = 300,
      height = 300,
      radius = Math.min(width, height)/2;

  var svg = d3.select("#DomainPlot").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 80);
  var arcOver = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 85);
  var outerArc = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 5);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){return d.count;});

  var color = d3.scale.ordinal()
    .range(["#80ccff", "#8080ff", "#ff80df", "#e699cc", "#ff8080", "#ffb380", "#ff9980"]);

  d3.json(subdir+"/stats/DomainPie", function(data){
    var total = 0;
    data.forEach(function(d){
      d.count = +d.count;
      total += d.count;
    });
    var g = svg.selectAll(".arc")
      .data(pie(data)).enter().append("g")
      .attr("class", "arc");
    g.append("path").attr("d", arc)
      .style("fill", function(d){return color(d.data.Domain)})
      .on("mouseover", function(d){
        d3.select(this)
          .attr("d", arcOver)
      })
      .on("mouseout", function(d){
        d3.select(this)
          .attr("d", arc)
      })
      .on("click", function(d, i){
        ChapterPiePlot(data[i]["Domain"]);
      });
    g.append("text")
      .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.Domain; })
      .style("font-size", "10")
      .attr("text-anchor", function(d){
        if(outerArc.centroid(d)[0]>0){
          return "start";
        }else{
          return "end";
        }
      });
    g.append("text")
      .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"})
      .text(function(d){ return d.data.count; })
      .style("font-size", "12")
      .attr("text-anchor", "middle");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}

function ChapterPiePlot(domain){
  var margin = {top:50, right: 50, bottom:50, left:50},
      width = 300,
      height = 300,
      radius = Math.min(width, height)/2;

  d3.select('#ChapterPlot').select('svg').remove();

  var svg = d3.select("#ChapterPlot").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 80);
  var arcOver = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 85);
  var outerArc = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 5);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){return d.count;});

  var color = d3.scale.ordinal()
    .range(["#80ccff", "#8080ff", "#ff80df", "#e699cc", "#ff8080", "#ffb380", "#ff9980"]);
  d3.json(subdir+"/stats/ChapterPie/"+domain, function(data){
    var total = 0;
    data.forEach(function(d){
      d.count = +d.count;
      total += d.count;
    });
    var g = svg.selectAll(".arc")
      .data(pie(data)).enter().append("g")
      .attr("class", "arc");
    g.append("path").attr("d", arc)
      .style("fill", function(d){return color(d.data.ChapterLevel)})
      .on("mouseover", function(d){
        d3.select(this)
          .attr("d", arcOver)
      })
      .on("mouseout", function(d){
        d3.select(this)
          .attr("d", arc)
      })
      .on("click", function(d, i){
        SubchapterPiePlot(domain, data[i]["ChapterLevel"]);
      });
    g.append("text")
      .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.ChapterLevel; })
      .style("font-size", "10")
      .attr("text-anchor", function(d){
        if(outerArc.centroid(d)[0]>0){
          return "start";
        }else{
          return "end";
        }
      });
    g.append("text")
      .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"})
      .text(function(d){ return d.data.count; })
      .style("font-size", "12")
      .attr("text-anchor", "middle");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}

function SubchapterPiePlot(domain, chapter){
  var margin = {top:50, right: 50, bottom:50, left:50},
      width = 300,
      height = 300,
      radius = Math.min(width, height)/2;

  d3.select('#SubchapterPlot').select('svg').remove();

  var svg = d3.select("#SubchapterPlot").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 80);
  var arcOver = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 85);
  var outerArc = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 5);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){return d.count;});

  var color = d3.scale.ordinal()
    .range(["#80ccff", "#8080ff", "#ff80df", "#e699cc", "#ff8080", "#ffb380", "#ff9980"]);
  d3.json(subdir+"/stats/SubchapterPie/"+domain+"/"+chapter, function(data){
    var total = 0;
    data.forEach(function(d){
      d.count = +d.count;
      total += d.count;
    });
    var g = svg.selectAll(".arc")
      .data(pie(data)).enter().append("g")
      .attr("class", "arc");
    g.append("path").attr("d", arc)
      .style("fill", function(d){return color(d.data.SubchapterLevel)})
      .on("mouseover", function(d){
        d3.select(this)
          .attr("d", arcOver)
      })
      .on("mouseout", function(d){
        d3.select(this)
          .attr("d", arc)
      });
    g.append("text")
      .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.SubchapterLevel; })
      .style("font-size", "10")
      .attr("text-anchor", function(d){
        if(outerArc.centroid(d)[0]>0){
          return "start";
        }else{
          return "end";
        }
      });
    g.append("text")
      .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"})
      .text(function(d){ return d.data.count; })
      .style("font-size", "12")
      .attr("text-anchor", "middle");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}

function NsampleYearPlot(){
  var margin = {top:50, right: 50, bottom:80, left:100},
      width = 800,
      height = 300;
  d3.select('#NsampleYearPlot').select('svg').remove();
  var svg = d3.select("#NsampleYearPlot").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");
  d3.json(subdir+"/stats/NsampleYear", function(data){
    data.forEach(function(d){
      d.Year = +d.Year;
      d.N = +d.N;
    });
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    x.domain([d3.min(data, function(d){return d.Year})-1, d3.max(data, function(d){return d.Year})+1]);
    y.domain([d3.min(data, function(d){return d.N})-100, d3.max(data, function(d){return d.N})+100]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d"));
    var yAxis = d3.svg.axis().scale(y).orient("left");

    svg.selectAll("dot").data(data).enter()
      .append("circle")
      .attr("r", 3.5)
      .attr("cx", function(d){return x(d.Year)})
      .attr("cy", function(d){return y(d.N)})
      .attr("fill", "blue");
    svg.append("g").attr("class", "x axis")
      .attr("transform", "translate(0,"+height+")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis)
      .selectAll('text').style('font-size', '11px');
    svg.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+width/2+","+(height+35)+")")
      .text("Published Year");
    svg.append("text").attr("text-anchor", "middle")
      .attr("transform", "translate("+(-55)+","+(height/2)+")rotate(-90)")
      .text("Total Sample Size of GWAS");
  });
}
