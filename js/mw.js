function createMWPlot(dataset) {

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
	var width = 1000,
    	barHeight = 20,
    	no_bars = 30;
    var mws = [];
    dataset.forEach(function(d){
    	var mw_entry = select_mw(d);
    	mws.push(parse_mw(mw_entry));
    });
    
    var min_mws = d3.min(mws),
    	max_mws = d3.max(mws);
    	bar_data_size = (max_mws-min_mws)/no_bars;
    
    
    var data = [];
    
    //push frequency to bins array:
	for (var i = 0; i < no_bars; i++) {
		var freq = mws.filter(function(d) {
			var min_bin = min_mws + bar_data_size*i,
				max_bin = min_mws + bar_data_size*(i+1);
			return d > min_bin && d <= max_bin;
		}).length;
		data.push(freq);
	}
 
	var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, width]);    	
    
 var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
	var bar = chart.selectAll("g").data(data).enter().append("g").attr("transform", function(d, i) {
		return "translate(0," + i * barHeight + ")";
	});

	bar.append("rect").attr("width", x).attr("height", barHeight - 1);

	bar.append("text").attr("x", function(d) {
		return x(d) - 3;
	}).attr("y", barHeight / 2).attr("dy", ".35em").text(function(d) {
		return d;
	}); 

  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
}

function select_mw(species_entry){
	return d3.select(species_entry).select('molecular_weight')[0][0];
}
function parse_mw(mw_entry) {
	if (mw_entry == null) {
		return 0;
	}
	
	return parseFloat(mw_entry.textContent.trim());
}
