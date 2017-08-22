$(document).ready(function(){
  dbSum();
  yearSumPlot();
  DomainPiePlot();
  domainSumPlot();
});

function dbSum(){
	$.ajax({
		url: subdir+"/stats/dbSum",
		type: "POST",
		success: function(data){
			data = JSON.parse(data);
			$('#totalGWAS').html(data.GWAS);
			$('#uniqTrait').html(data.trait);
			$('#uniqStudy').html(data.study);
			$('#uniqDomain').html(data.domain);
		}
	})
}

function yearSumPlot(){
	var margin = {top:10, right: 50, bottom:30, left:50},
        width = 600,
        height = 280;
	var svg = d3.select("#yearSumPlot").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");
	var hist_height = 60;
	var hist_space = 10;
	var ipanel = 0;

	d3.json(subdir+'/stats/yearSumPlot', function(data){
		data.forEach(function(d){
			d[0] = +d[0]; //year
			d[1] = +d[1]; //Nstudy
			d[2] = +d[2]; //Ngwas
			d[3] = +d[3]; //Ntrait
			d[4] = +d[4]; //Nsample_avg
			d[5] = +d[5]; //Nsample_min
			d[6] = +d[6]; //Nsample_max
		});

		var years = data.map(function(d){return d[0]});
		var x = d3.scale.ordinal().domain(years).rangeBands([0, width], 0.1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		// Nstudy
		ipanel = 1;
		var y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		var ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip1 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[1]});
		svg.call(tip1);
		svg.selectAll('.Nstudy').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "pink")
			.on("mouseover", tip1.show)
			.on("mouseout", tip1.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis);
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N studies")
			.style("font-size", "12px");

		//Ngwas
		ipanel = 2;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip2 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[2]});
		svg.call(tip2);
		svg.selectAll('.Ngwas').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "orange")
			.on("mouseover", tip2.show)
			.on("mouseout", tip2.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N GWAS")
			.style("font-size", "12px");

		//Ntrait
		ipanel = 3;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip3 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[3]});
		svg.call(tip3);
		svg.selectAll('.Ntrait').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "lightgreen")
			.on("mouseover", tip3.show)
			.on("mouseout", tip3.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N traits")
			.style("font-size", "12px");

		//Nsample
		ipanel = 4;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[6]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip4 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return "Max: "+d[6]+"<br/>Avg: "+d[4]+"<br/>Min: "+d[5]});
		svg.call(tip4);
		svg.selectAll('.Nsample').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "skyblue")
			.on("mouseover", tip4.show)
			.on("mouseout", tip4.hide);
		svg.selectAll('.Nsamplemin').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[5])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "black");
		svg.selectAll('.Nsamplemax').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", "black");
		svg.selectAll('.Nsamplebar').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()/2})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()/2})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "black");
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N samples")
			.style("font-size", "12px");
	});
}

function domainSumPlot(){
	var margin = {top:20, right: 50, bottom:100, left:50},
        width = 800,
        height = 320;
	var svg = d3.select("#domainSumPlot").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");
	var hist_height = 70;
	var hist_space = 10;
	var ipanel = 0;

	d3.json(subdir+'/stats/domainSumPlot', function(data){
		data.forEach(function(d){
			d[1] = +d[1]; //Nstudy
			d[2] = +d[2]; //Ngwas
			d[3] = +d[3]; //Ntrait
			d[4] = +d[4]; //Nsample_avg
			d[5] = +d[5]; //Nsample_min
			d[6] = +d[6]; //Nsample_max
		});

		var years = data.map(function(d){return d[0]});
		var x = d3.scale.ordinal().domain(years).rangeBands([0, width], 0.1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		// Nstudy
		ipanel = 1;
		var y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		var ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip1 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[1]});
		svg.call(tip1);
		svg.selectAll('.Nstudy').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect').attr('class', 'bar')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "pink")
			.on("mouseover", tip1.show)
			.on("mouseout", tip1.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-60)")
			.attr("dy", "-.25em")
			.attr("dx", "-.85em");
		svg.append('g').attr("class", "y axis")
			.call(yAxis);
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N studies")
			.style("font-size", "12px");

		//Ngwas
		ipanel = 2;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip2 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[2]});
		svg.call(tip2);
		svg.selectAll('.Ngwas').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "orange")
			.on("mouseover", tip2.show)
			.on("mouseout", tip2.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N GWAS")
			.style("font-size", "12px");

		//Ntrait
		ipanel = 3;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip3 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[3]});
		svg.call(tip3);
		svg.selectAll('.Ntrait').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "lightgreen")
			.on("mouseover", tip3.show)
			.on("mouseout", tip3.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N traits")
			.style("font-size", "12px");

		//Nsample
		ipanel = 4;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data, function(d){return d[6]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip4 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return "Max: "+d[6]+"<br/>Avg: "+d[4]+"<br/>Min: "+d[5]});
		svg.call(tip4);
		svg.selectAll('.Nsample').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "skyblue")
			.on("mouseover", tip4.show)
			.on("mouseout", tip4.hide);
		svg.selectAll('.Nsamplemin').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[5])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "black");
		svg.selectAll('.Nsamplemax').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", "black");
		svg.selectAll('.Nsamplebar').data(data.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()/2})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()/2})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "black");

		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N samples")
			.style("font-size", "12px");
	});
}

function DomainPiePlot(){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;
	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
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

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.Domain)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#DomainPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

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

		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.Domain; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
				if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -5)
			.text("Studies");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text(total);
	});
}

function ChapterPiePlot(domain){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;

	// d3.select('#ChapterPie').select('svg').remove();
	$('#ChapterPie').html("Selected domain: "+domain+"<br/>");

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcOver = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 85);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
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

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.ChapterLevel)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#ChapterPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

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
		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.ChapterLevel; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
			if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -5)
			.text("Studies");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text(total);
	});
}

function SubchapterPiePlot(domain, chapter){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;

	// d3.select('#SubchapterPie').select('svg').remove();
	$('#SubchapterPie').html("Selected domain: "+domain+"<br/>Selected chapter: "+chapter+"<br/>");

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcOver = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 85);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
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

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.SubchapterLevel)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#SubchapterPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

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
		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.SubchapterLevel; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
				if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -5)
			.text("Studies");
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text(total);
	});
}

function PieCorrdinate(data, label, arc){
	var label_pos = [];
	var links = [];
	data.forEach(function(d){
		label_pos.push(arc.centroid(d));
	});

	for(var i=0; i<label.length; i++){
		label_pos[i].push(label[i])
	}

	// Split into blocks
	var rt_idx = [], rb_idx = [], lt_idx = [], lb_idx = [];

	for(var i=0; i<label_pos.length; i++){
		if(label_pos[i][0]>=0 && label_pos[i][1]<0){rt_idx.push(i)}
		else if(label_pos[i][0]>=0 && label_pos[i][1]>=0){rb_idx.push(i)}
		else if(label_pos[i][0]<0 && label_pos[i][1]<0){lt_idx.push(i)}
		else if(label_pos[i][0]<00 && label_pos[i][1]>=0){lb_idx.push(i)}
	}

	// process each block
	if(rt_idx.length > 1){
		for(var i = rt_idx.length-2; i>=0; i--){
			if(Math.abs(label_pos[rt_idx[i]][1] - label_pos[rt_idx[i+1]][1])<10){
				links.push([label_pos[rt_idx[i]][0], label_pos[rt_idx[i]][1], label_pos[rt_idx[i+1]][1]-11])
				label_pos[rt_idx[i]][1] = label_pos[rt_idx[i+1]][1]-11;
			}else if(label_pos[rt_idx[i]][1]>label_pos[rt_idx[i+1]][1]){
				links.push([label_pos[rt_idx[i]][0], label_pos[rt_idx[i]][1], label_pos[rt_idx[i+1]][1]-11])
				label_pos[rt_idx[i]][1] = label_pos[rt_idx[i+1]][1]-11;
			}
		}
	}
	if(rb_idx.length > 1){
		for(var i = 1; i<rb_idx.length; i++){
			if(Math.abs(label_pos[rb_idx[i]][1] - label_pos[rb_idx[i-1]][1])<10){
				links.push([label_pos[rb_idx[i]][0], label_pos[rb_idx[i]][1], label_pos[rb_idx[i-1]][1]+11])
				label_pos[rb_idx[i]][1] = label_pos[rb_idx[i-1]][1]+11;
			}else if(label_pos[rb_idx[i]][1]<label_pos[rb_idx[i-1]][1]){
				links.push([label_pos[rb_idx[i]][0], label_pos[rb_idx[i]][1], label_pos[rb_idx[i-1]][1]+11])
				label_pos[rb_idx[i]][1] = label_pos[rb_idx[i-1]][1]+11;
			}
		}
	}
	if(lt_idx.length > 1){
		for(var i = 1; i<lt_idx.length; i++){
			if(Math.abs(label_pos[lt_idx[i]][1] - label_pos[lt_idx[i-1]][1])<10){
				links.push([label_pos[lt_idx[i]][0], label_pos[lt_idx[i]][1], label_pos[lt_idx[i-1]][1]-11])
				label_pos[lt_idx[i]][1] = label_pos[lt_idx[i-1]][1]-11;
			}else if(label_pos[lt_idx[i]][1]>label_pos[lt_idx[i-1]][1]){
				links.push([label_pos[lt_idx[i]][0], label_pos[lt_idx[i]][1], label_pos[lt_idx[i-1]][1]-11])
				label_pos[lt_idx[i]][1] = label_pos[lt_idx[i-1]][1]-11;
			}
		}
	}
	if(lb_idx.length > 1){
		for(var i = lb_idx.length-2; i>=0; i--){
			if(Math.abs(label_pos[lb_idx[i]][1] - label_pos[lb_idx[i+1]][1])<10){
				links.push([label_pos[lb_idx[i]][0], label_pos[lb_idx[i]][1], label_pos[lb_idx[i+1]][1]+11])
				label_pos[lb_idx[i]][1] = label_pos[lb_idx[i+1]][1]+11;
			}else if(label_pos[lb_idx[i]][1]<label_pos[lb_idx[i+1]][1]){
				links.push([label_pos[lb_idx[i]][0], label_pos[lb_idx[i]][1], label_pos[lb_idx[i+1]][1]+11])
				label_pos[lb_idx[i]][1] = label_pos[lb_idx[i+1]][1]-11;
			}
		}
	}

	var max_x = []
	var top = 0;
	var bottom = 0;
	label_pos.forEach(function(d){
			if(d[0]>0){
				max_x.push(d[0]+d[2].length*5)
			}else{
				max_x.push(d[0]-d[2].length*5)
			}
			if(d[1]<top){top = d[1]}
			if(d[1]>bottom){bottom = d[1]}
	});

	return [label_pos, links, Math.max(...max_x), Math.min(...max_x), top, bottom]
}
