function createScatterPlot(dataset) {

	//Width and height
	var w = 1000;
	var h = 500;
	var padding = 30;

	var xScale = d3.scale.linear().domain([d3.min(dataset, function(d) {
		var hf_entry = select_hf298_1(d);
		return parse(hf_entry)[0];
	}), d3.max(dataset, function(d) {
		var hf_entry = select_hf298_1(d);
		return parse(hf_entry)[0];
	})]).range([padding, w - padding]);

	var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) {
		var hf_entry = select_hf298_1(d);
		return parse(hf_entry)[1];
	})]).range([h - padding, padding]);

	var rScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) {
		var hf_entry = select_hf298_1(d);
		return parse(hf_entry)[1];
	})]).range([0, 5]);

	//Create SVG element
	var svg = d3.select(".scatter").attr("width", w).attr("height", h);

	svg.selectAll("circle").data(dataset).enter().append("circle").attr("cx", function(d) {
		var hf_entry = select_hf298_1(d);
		return xScale(parse(hf_entry)[0]);
	}).attr("cy", function(d) {
		var hf_entry = select_hf298_1(d);
		return yScale(parse(hf_entry)[1]);
	}).attr("r", function(d) {
		var hf_entry = select_hf298_1(d);
		var yval = parse(hf_entry)[1];
		return yval == 0 ? 0 : 2;
		//return hf_entry == null ? 0: rScale(parseUncertainty(hf_entry));
	});
	
	
	svg.selectAll("text")
	 .data(dataset)
	 .enter()
	 .append("text")
	 .text(function(d) {

		var hf_entry = select_hf298_1(d);
		var x = parse(hf_entry)[0].toFixed(0), y = parse(hf_entry)[1].toFixed(0);
		if (x == '' || y == '') {
			return '';
		} else {
			return 'CAS: '+d.getAttribute("CAS")+' ('+x + ',' + y+') kJ/mol';
		}

	 })
	 .attr("x", function(d) {
	 var hf_entry = select_hf298_1(d);
	 var x = xScale(parse(hf_entry)[0]);
	 return x;
	 })
	 .attr("y", function(d) {
	 var hf_entry = select_hf298_1(d);
	 var y = yScale(parse(hf_entry)[1]);
	 return y;
	 })
	 .attr('id', 'circle_label');

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
	//Set rough # of ticks

	svg.append("g").attr("class", "axis")//Assign "axis" class
	.attr("transform", "translate(0," + (h - padding) + ")").call(xAxis);

	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
	svg.append("g").attr("class", "axis")//Assign "axis" class
	.attr("transform", "translate(" + padding + ",0)").call(yAxis);

	svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", w).attr("y", h - padding - 6).text("\u0394Hf (298K) / kJ mol-1");

	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", padding + 10).attr("dy", "0.75em").attr("transform", "rotate(-90)").text("uncertainty \u0394Hf (298K) / kJ mol-1");

}

function select_hf298_1(species_entry){
	return d3.select(species_entry).select('hf298_1')[0][0];
}
function parse(hf_entry) {
	if (hf_entry == null) {
		return [0, 0];
	}
	var unit_kcal = false, //reset
	hf_val = hf_entry.textContent;
	unit_kcal = hf_val.toUpperCase().indexOf('CAL') > -1 ? true : false;

	hf_val = hf_val.split('KJ')[0].split('KCAL')[0]
	.split('+/-')
	.map(function(d) {
		return parseFloat(d.trim());
	})
	.map(function(d) {
		return unit_kcal ? d * 4.186 : d;
	});
	hf_val.length == 1 ? hf_val.push(0) : hf_val;
	return hf_val;
}
