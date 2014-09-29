function createMWPlot(dataset) {

	//Width and height
	var w = 1000;
	var h = 500;
	var padding = 30;

	var xScale = d3.scale.linear().domain([d3.min(dataset, function(d) {
		var mw_entry = select_mw(d);
		return parse_mw(mw_entry);
	}), d3.max(dataset, function(d) {
		var mw_entry = select_mw(d);
		return parse_mw(mw_entry);
	})]).range([padding, w - padding]);

	var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) {
		var mw_entry = select_mw(d);
		return parse_mw(mw_entry);
	})]).range([h - padding, padding]);

	var rScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) {
		var mw_entry = select_mw(d);
		return parse_mw(mw_entry);
	})]).range([0, 5]);

	//Create SVG element
	var svg = d3.select("#mw").append("svg").attr("width", w).attr("height", h);

	svg.selectAll("circle").data(dataset).enter().append("circle").attr("cx", function(d) {
		var mw_entry = select_mw(d);
		return xScale(parse_mw(mw_entry));
	}).attr("cy", function(d) {
		var mw_entry = select_mw(d);
		return yScale(parse_mw(mw_entry));
	}).attr("r", function(d) {
		var mw_entry = select_mw(d);
		var yval = parse_mw(mw_entry);
		return yval == 0 ? 0 : 2;
	});
	
	
	svg.selectAll("text")
	 .data(dataset)
	 .enter()
	 .append("text")
	 .text(function(d) {

		var mw_entry = select_mw(d);
		var x = parse_mw(mw_entry).toFixed(0), y = parse_mw(mw_entry).toFixed(0);
		if (x == '' || y == '') {
			return '';
		} else {
			return 'CAS: '+d.getAttribute("CAS");
		}

	 })
	 .attr("x", function(d) {
	 var mw_entry = select_mw(d);
	 var x = xScale(parse_mw(mw_entry));
	 return x;
	 })
	 .attr("y", function(d) {
	 var mw_entry = select_mw(d);
	 var y = yScale(parse_mw(mw_entry));
	 return y;
	 })
	 .attr('id', 'mw_label');

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
	//Set rough # of ticks

	svg.append("g").attr("class", "axis")//Assign "axis" class
	.attr("transform", "translate(0," + (h - padding) + ")").call(xAxis);

	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
	svg.append("g").attr("class", "axis")//Assign "axis" class
	.attr("transform", "translate(" + padding + ",0)").call(yAxis);

	svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", w).attr("y", h - padding - 6).text("MW / g mol-1");

	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", padding + 10).attr("dy", "0.75em").attr("transform", "rotate(-90)").text("MW / g mol-1");

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
