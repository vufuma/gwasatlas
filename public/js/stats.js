$(document).ready(function(){
  DomainPiePlot();
});

function DomainPiePlot(){
  var margin = {top:20, right: 20, bottom:20, left:20},
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
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.Domain; });
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}

function ChapterPiePlot(domain){
  var margin = {top:20, right: 20, bottom:20, left:20},
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
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.ChapterLevel; });
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}

function SubchapterPiePlot(domain, chapter){
  var margin = {top:20, right: 20, bottom:20, left:20},
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
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.SubchapterLevel; });
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", -5)
      .text("Total GWAS");
    svg.append("text").attr("text-anchor", "middle")
      .attr("x", 0).attr("y", 15)
      .text(total);
  });
}
