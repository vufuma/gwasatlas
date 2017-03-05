var selectTable;
var panel = "";
$(document).ready(function(){

  var hash = window.location.hash;
  if(hash){
    panel = hash;
  }else{
    panel = "#GC";
  }

  // selectTable = $('#selectTable').DataTable();
  Selection("Domain");

  $("#sidebar.sidebar-nav").find(".active").removeClass("active");
  $("#sidebar.sidebar-nav a[href='"+panel+"']").parent().addClass("active");

  $('#sidebar.sidebar-nav li a').click(function(){
    panel = $(this).attr("href");
    loadPanel(panel);
  });

  // $('#selectTable tbody').on('click', 'tr', function(){
  //   var rowData = selectTable.row(this).data();
  //   var add = true;
  //   $('#selectedGWAS input').each(function(i, d){
  //     if($(d).val() == rowData['ID']){
  //       add = false;
  //       return false;
  //     }
  //   });
  //   if(add){
  //     selected = '<div class="selectedGWAS"><input type="checkbox" class="form-contorl" value="'+rowData['ID']+'"/>'
  //       +" "+rowData['ID']+": "+rowData['Domain']+'; '+rowData['ChapterLevel']+'; '+rowData['SubchapterLevel']+'; '+rowData['Trait']+'</div>'
  //     $('#selectedGWAS').append(selected)
  //   }
  // });

  // $('#delGWAS').on('click', function(){
  //   $(".selectedGWAS").each(function(){
  //     if($(this).children("input").is(":checked")){
  //       $(this).remove();
  //     }
  //   });
  //   loadPanel(panel);
  // });

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
    select: false,
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
      },
      complete: function(){
        loadPanel(panel);
      },
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
    case "#GC":
      GC();
      break;
    case "#magmagenes":
      magmagenes();
      break;
    case "#magmaGS":
      magmaGS();
      break;
    default:
      magmagenes();
  }
}

// function manhattan(){
//   ids = []
//   $(".selectedGWAS").each(function(){
//     ids.push($(this).children("input").val())
//   })
//   if(ids.length==0){
//     $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
//   }else{
//     $('#panel').html('<div style="text-align: center;" id="plot"></div>');
//     ids.forEach(function(id){
//       // $('#plot').append("manhattan plot of ID "+id+"<br/>");
//       PlotManhattan(id, "snps");
//     })
//   }
// }
//
// function geneManhattan(){
//   ids = []
//   $(".selectedGWAS").each(function(){
//     ids.push($(this).children("input").val())
//   })
//   if(ids.length==0){
//     $('#panel').html('<div style="text-align: center;">Please select GWAS from the top panel.</div>');
//   }else{
//     $('#panel').html('<div style="text-align: center;" id="plot"></div>');
//     ids.forEach(function(id){
//       // $('#plot').append("gene manhattan plot of ID "+id+"<br/>");
//       PlotManhattan(id, "genes");
//     })
//   }
// }
function magmagenes(){
  ids = selectTable.column(0).data();
  if(ids.length<=1){
    $('#panel').html('<div style="text-align: center;">Please select at lease 2 GWAS from the top panel.</div>');
  }else{
    $("#panel").html('Order by : <select id="orderHeat"><option value="alph">Alphabetical</option><option value="domain">Domain</option><option value="clst">Cluster</option></select>')
    $('#panel').append('<div style="width:auto;overflow-x:auto;" id="plot"></div>');
    ids = ids.join(":");
    PlotMagmaGenes(ids);
  }
}

function magmaGS(){
  ids = selectTable.column(0).data();
  if(ids.length<=1){
    $('#panel').html('<div style="text-align: center;">Please select at lease 2 GWAS from the top panel.</div>');
  }else{
    $("#panel").html('Order by : <select id="orderHeat"><option value="alph">Alphabetical</option><option value="domain">Domain</option><option value="clst">Cluster</option></select>')
    $('#panel').append('<div style="width:auto;overflow-x:auto;" id="plot"></div>');
    ids = ids.join(":");
    PlotMagmaGS(ids);
  }
}

function GC(){
  ids = selectTable.column(0).data();
  if(ids.length<=1){
    $('#panel').html('<div style="text-align: center;">Please select at lease 2 GWAS from the top panel.</div>');
  }else{
    $("#panel").html('Order by : <select id="orderHeat"><option value="alph">Alphabetical</option><option value="domain">Domain</option><option value="clst">Cluster</option></select>')
    $('#panel').append('<div style="width:auto;overflow-x:auto;" id="plot"></div>');
    ids = ids.join(":");
    PlotGC(ids);
  }
}

function PlotGC(ids){
  d3.select('#plot').select('svg').remove();
  d3.json(subdir+"/multiGWAS/GCheat/"+ids, function(data){
    if(data == undefined || data == null || data.length==0){
      $('#plot').html("No genetic correlatioin is available for selected GWAS.");
    }else{
      var ids = data.data["id"];
      var n = ids.length;
      var cellsize = 10;
      if(n < 50){
        cellsize = 20;
      }
      data.data.rg.forEach(function(d){
        d[0] = +d[0]; //id1
        d[1] = +d[1]; //id2
        d[2] = +d[2]; //rg
        d[3] = +d[3]; //p
        d[4] = +d[4]; //pbon
      });

      var maxTrait = 0;
      ids.forEach(function(d){
        if(data.data.Trait[d].length > maxTrait){
          maxTrait = data.data.Trait[d].length;
        }
      });

      var margin = {top: maxTrait*5.5, right: 100, bottom: 50, left: maxTrait*5.5},
        width = cellsize*n,
        height = cellsize*n;
      var svg = d3.select('#plot').append('svg')
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
      var colorScale = d3.scale.linear().domain([-1.25, 0, 1.25]).range(["#000099", "#fff", "#b30000"]);
      var sizeScale = d3.scale.linear().domain([0.05, 1]).range([1, 0]);

      // legened
      var t = [];
      for(var i =0; i<26; i++){t.push(i);}
      var legendRect = svg.selectAll(".legend").data(t).enter().append("g")
        .append("rect")
        .attr("class", 'legendRect')
        .attr("x", width+10)
        .attr("y", function(d){return (25-d)*5+20})
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", function(d){return colorScale(d*0.1-1.25)});
      var legendText = svg.selectAll("text.legend").data([0,12.5,25]).enter().append("g")
        .append("text")
        .attr("text-anchor", "start")
        .attr("class", "legenedText")
        .attr("x", width+32)
        .attr("y", function(d){return (25-d)*5+11+20})
        .text(function(d){return d*0.1-1.25})
        .style("font-size", "12px");

      // y axis label
      var rowLabels = svg.append("g").selectAll(".rowLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .attr("x", -3)
                      .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;})
                      .style("font-size", "10px")
                      .style("text-anchor", "end");
      // x axis label
      var colLabels = svg.append("g").selectAll(".colLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .style("text-anchor", "start")
                      .style("font-size", "10px")
                      .attr("transform", function(d){
                        return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
                      });

      // heatmap for significant rg
      var heatMapSig = svg.append("g").attr("class", "cell heatmapcell")
                    .selectAll("rect.cell").data(data.data.rg.filter(function(d){if(d[3]<0.05){return d}})).enter()
                    .append("rect")
                    .attr("width", cellsize-1).attr("height", cellsize-1)
                    .attr('x', function(d){return data.data.order.alph[d[0]]*cellsize})
                    .attr('y', function(d){return data.data.order.alph[d[1]]*cellsize})
                    .attr('fill', function(d){return colorScale(d[2])});
      // stars for significant rg after bon correction
      var stars = svg.append("g").attr("class", "cell star")
                    .selectAll("star").data(data.data.rg.filter(function(d){if(d[4]<0.05 && d[0] != d[1]){return d}})).enter()
                    .append("text")
                    .attr('x', function(d){return data.data.order.alph[d[0]]*cellsize+(cellsize-1)/2})
                    .attr('y', function(d){return data.data.order.alph[d[1]]*cellsize+(cellsize-4)})
                    .text("*")
                    .style("text-anchor", "middle");
      // heatmap for non-significant rg
      var heatMapNonsig = svg.append("g").attr("class", "cell heatmapcell")
                    .selectAll("rect.cell.nonsig").data(data.data.rg.filter(function(d){if(d[3]>=0.05){return d}})).enter()
                    .append("rect")
                    .attr("width", function(d){return (cellsize-1)*sizeScale(d[3])})
                    .attr("height", function(d){return (cellsize-1)*sizeScale(d[3])})
                    .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
                    .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
                    .attr('fill', function(d){return colorScale(d[2])});

      // reordering labels
      function sortOptions(type){
        if(type == "alph"){
          heatMapSig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize});
          stars.transition().duration(1000)
            .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+(cellsize-1)/2})
            .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+(cellsize-4)});
          heatMapNonsig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
            .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "domain"){
          heatMapSig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.domain[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.domain[d[1]]*cellsize});
          stars.transition().duration(1000)
            .attr("x", function(d){return data.data.order.domain[d[0]]*cellsize+(cellsize-1)/2})
            .attr("y", function(d){return data.data.order.domain[d[1]]*cellsize+(cellsize-4)});
          heatMapNonsig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.domain[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
            .attr("y", function(d){return data.data.order.domain[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.domain[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "clst"){
          heatMapSig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.clst[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.clst[d[1]]*cellsize});
          stars.transition().duration(1000)
            .attr("x", function(d){return data.data.order.clst[d[0]]*cellsize+(cellsize-1)/2})
            .attr("y", function(d){return data.data.order.clst[d[1]]*cellsize+(cellsize-4)});
          heatMapNonsig.transition().duration(1000)
            .attr("x", function(d){return data.data.order.clst[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
            .attr("y", function(d){return data.data.order.clst[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.clst[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }
      }

      d3.select('#orderHeat').on("change", function(){
        var type = $('#orderHeat').val();
        sortOptions(type);
      })
    }
  });
}

function PlotMagmaGenes(ids){
  d3.select('#plot').select('svg').remove();
  d3.json(subdir+"/multiGWAS/MagmaGeneheat/"+ids, function(data){
    if(data == undefined || data == null || data.length==0){
      $('#plot').html("No MAGMA gene analysis is available for selcted GWAS.");
    }else{
      var ids = data.data["id"];
      var n = ids.length;
      var cellsize = 10;
      if(n < 50){
        cellsize = 20;
      }

      data.data.go.forEach(function(d){
        d[0] = +d[0]; //id1
        d[1] = +d[1]; //id2
        d[2] = +d[2]; //overlap
      });

      data.data.ng.forEach(function(d){
        d[0] = +d[0] //id
        d[1] = +d[1] //n genes
      });

      var maxTrait = 0;
      ids.forEach(function(d){
        if(data.data.Trait[d].length > maxTrait){
          maxTrait = data.data.Trait[d].length;
        }
      });

      var barWidth = 80;
      var space = 5;
      var margin = {top: maxTrait*5.5, right: 100, bottom: 50, left: maxTrait*5.5},
        width = cellsize*n+space+barWidth,
        height = cellsize*n;
      var svg = d3.select('#plot').append('svg')
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
      var colorScale = d3.scale.linear().domain([0, 1]).range(["#fff", "#b30000"]);
      // var sizeScale = d3.scale.linear().domain([0.05, 1]).range([1, 0]);

      // legened
      var t = [];
      for(var i =0; i<11; i++){t.push(i);}
      var legendRect = svg.selectAll(".legend").data(t).enter().append("g")
        .append("rect")
        .attr("class", 'legendRect')
        .attr("x", width+20)
        .attr("y", function(d){return (d)*10+20})
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", function(d){return colorScale(1-d*0.1)});
      var legendText = svg.selectAll("text.legend").data([0,5,10]).enter().append("g")
        .append("text")
        .attr("text-anchor", "start")
        .attr("class", "legenedText")
        .attr("x", width+42)
        .attr("y", function(d){return (d)*10+11+20})
        .text(function(d){return 1-d*0.1})
        .style("font-size", "12px");

      // y axis label
      var rowLabels = svg.append("g").selectAll(".rowLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .attr("x", -3)
                      .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;})
                      .style("font-size", "10px")
                      .style("text-anchor", "end");
      // x axis label
      var colLabels = svg.append("g").selectAll(".colLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .style("text-anchor", "start")
                      .style("font-size", "10px")
                      .attr("transform", function(d){
                        return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
                      });

      // heatmap for non zero overlap
      var heatMap = svg.append("g").attr("class", "cell heatmapcell")
                    .selectAll("rect.cell").data(data.data.go).enter()
                    .append("rect")
                    .attr("width", cellsize-1).attr("height", cellsize-1)
                    .attr('x', function(d){return data.data.order.alph[d[0]]*cellsize})
                    .attr('y', function(d){return data.data.order.alph[d[1]]*cellsize})
                    .attr('fill', function(d){if(d[2]==-1){return "grey";}else{return colorScale(d[2])}});

      // n genes bar plot
      var x = d3.scale.linear().range([(cellsize+1)*n+space, width]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(3);
      x.domain([0, d3.max(data.data.ng, function(d){return d[1]})]);

      var barPlot = svg.append("g").attr("class", "bar")
                    .selectAll("bar").data(data.data.ng).enter()
                    .append("rect")
                    .attr("width", function(d){return x(d[1])-x(0)})
                    .attr("height", cellsize-1)
                    .attr("x", (cellsize+1)*n+space)
                    .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize})
                    .attr("fill", "skyblue");
      var barText = svg.append("g")
                    .selectAll("bar.text").data(data.data.ng).enter()
                    .append("text")
                    .attr("x", function(d){return x(d[1])})
                    .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2})
                    .text(function(d){return d[1];})
                    .style("text-anchor", "start")
                    .style("font-size", "10px");
      svg.append('g').attr("class", "x axis")
          .attr("transform", "translate(0,"+height+")")
          .call(xAxis).selectAll("text")
          .attr("transform", "translate(-12, 3)rotate(-60)")
          .style("text-anchor", "end");


      // reordering labels
      function sortOptions(type){
        if(type == "alph"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "domain"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.domain[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.domain[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.domain[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "clst"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.clst[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.clst[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.clst[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }
      }

      d3.select('#orderHeat').on("change", function(){
        var type = $('#orderHeat').val();
        sortOptions(type);
      })
    }
  });
}

function PlotMagmaGS(ids){
  d3.select('#plot').select('svg').remove();
  d3.json(subdir+"/multiGWAS/MagmaGSheat/"+ids, function(data){
    if(data == undefined || data == null || data.length==0){
      $('#plot').html("No MAGMA gene-set analysis is available for selected GWAS.");
    }else{
      var ids = data.data["id"];
      var n = ids.length;
      var cellsize = 10;
      if(n < 50){
        cellsize = 20;
      }

      data.data.gso.forEach(function(d){
        d[0] = +d[0]; //id1
        d[1] = +d[1]; //id2
        d[2] = +d[2]; //overlap
      });

      data.data.ngs.forEach(function(d){
        d[0] = +d[0] //id
        d[1] = +d[1] //n gene-sets
      });

      var maxTrait = 0;
      ids.forEach(function(d){
        if(data.data.Trait[d].length > maxTrait){
          maxTrait = data.data.Trait[d].length;
        }
      });

      var barWidth = 80;
      var space = 5;
      var margin = {top: maxTrait*5.5, right: 100, bottom: 50, left: maxTrait*5.5},
        width = cellsize*n+space+barWidth,
        height = cellsize*n;
      var svg = d3.select('#plot').append('svg')
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
      var colorScale = d3.scale.linear().domain([0, 1]).range(["#fff", "#b30000"]);
      // var sizeScale = d3.scale.linear().domain([0.05, 1]).range([1, 0]);

      // legened
      var t = [];
      for(var i =0; i<11; i++){t.push(i);}
      var legendRect = svg.selectAll(".legend").data(t).enter().append("g")
        .append("rect")
        .attr("class", 'legendRect')
        .attr("x", width+20)
        .attr("y", function(d){return (d)*10+20})
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", function(d){return colorScale(1-d*0.1)});
      var legendText = svg.selectAll("text.legend").data([0,5,10]).enter().append("g")
        .append("text")
        .attr("text-anchor", "start")
        .attr("class", "legenedText")
        .attr("x", width+42)
        .attr("y", function(d){return (d)*10+11+20})
        .text(function(d){return 1-d*0.1})
        .style("font-size", "12px");

      // y axis label
      var rowLabels = svg.append("g").selectAll(".rowLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .attr("x", -3)
                      .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;})
                      .style("font-size", "10px")
                      .style("text-anchor", "end");
      // x axis label
      var colLabels = svg.append("g").selectAll(".colLabel")
                      .data(ids).enter().append("text")
                      .text(function(d){return data.data.Trait[d];})
                      .style("text-anchor", "start")
                      .style("font-size", "10px")
                      .attr("transform", function(d){
                        return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
                      });

      // heatmap for non zero overlap
      var heatMap = svg.append("g").attr("class", "cell heatmapcell")
                    .selectAll("rect.cell").data(data.data.gso).enter()
                    .append("rect")
                    .attr("width", cellsize-1).attr("height", cellsize-1)
                    .attr('x', function(d){return data.data.order.alph[d[0]]*cellsize})
                    .attr('y', function(d){return data.data.order.alph[d[1]]*cellsize})
                    .attr('fill', function(d){if(d[2]==-1){return "grey";}else{return colorScale(d[2])}});

      // n genes bar plot
      var x = d3.scale.linear().range([(cellsize+1)*n+space, width]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(3);
      x.domain([0, d3.max(data.data.ngs, function(d){return d[1]})]);

      var barPlot = svg.append("g").attr("class", "bar")
                    .selectAll("bar").data(data.data.ngs).enter()
                    .append("rect")
                    .attr("width", function(d){return x(d[1])-x(0)})
                    .attr("height", cellsize-1)
                    .attr("x", (cellsize+1)*n+space)
                    .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize})
                    .attr("fill", "skyblue");
      var barText = svg.append("g")
                    .selectAll("bar.text").data(data.data.ngs).enter()
                    .append("text")
                    .attr("x", function(d){return x(d[1])})
                    .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2})
                    .text(function(d){return d[1];})
                    .style("text-anchor", "start")
                    .style("font-size", "10px");
      svg.append('g').attr("class", "x axis")
          .attr("transform", "translate(0,"+height+")")
          .call(xAxis).selectAll("text")
          .attr("transform", "translate(-12, 3)rotate(-60)")
          .style("text-anchor", "end");


      // reordering labels
      function sortOptions(type){
        if(type == "alph"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.alph[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.alph[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "domain"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.domain[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.domain[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.domain[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.domain[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }else if(type == "clst"){
          heatMap.transition().duration(1000)
            .attr("x", function(d){return data.data.order.clst[d[0]]*cellsize})
            .attr("y", function(d){return data.data.order.clst[d[1]]*cellsize});
          barPlot.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d[0]]*cellsize});
          barText.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d[0]]*cellsize+cellsize/2});
          rowLabels.transition().duration(1000)
            .attr("y", function(d){return data.data.order.clst[d]*cellsize+(cellsize-1)/2;});
          colLabels.transition().duration(1000)
          .attr("transform", function(d){
            return "translate("+(data.data.order.clst[d]*cellsize+(cellsize-1)/2)+",0)rotate(-60)";
          });
        }
      }

      d3.select('#orderHeat').on("change", function(){
        var type = $('#orderHeat').val();
        sortOptions(type);
      })
    }
  });
}
