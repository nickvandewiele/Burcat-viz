//Width and height
var w = 1000;
var h = 500;
var padding = 30;

d3.xml("/data/BURCAT_THR.xml", function(xml) {
	dataset = d3.select(xml).selectAll("specie")[0];
	
	var xScale = d3.scale.linear()
                     .domain(
                     	[d3.min(dataset, function(d) {
                     	var hf_entry = d3.select(d).select('hf298_1')[0][0];
                     	return hf_entry == null ? 0: parseHf(hf_entry); 
                     	}), d3.max(dataset, function(d) {
                     	var hf_entry = d3.select(d).select('hf298_1')[0][0];
                     	return hf_entry == null ? 0: parseHf(hf_entry); 
                     	})])
                     .range([padding, w - padding]);
    
    var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) {
                     	var hf_entry = d3.select(d).select('hf298_1')[0][0];
                     	return hf_entry == null ? 0: parseUncertainty(hf_entry); 
                     	})])
                     .range([h - padding, padding]);       
    
    var rScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { 
                     	var hf_entry = d3.select(d).select('hf298_1')[0][0];
                     	return hf_entry == null ? 0: parseUncertainty(hf_entry); 
                     	})])
                     .range([0, 5]);
                                    
	//Create SVG element
	var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

	svg.selectAll("circle").data(dataset).enter().append("circle").attr("cx", function(d) {
			var hf_entry = d3.select(d).select('hf298_1')[0][0];
			return hf_entry == null ? 0: xScale(parseHf(hf_entry)); 
		}).attr("cy", function(d) {
			var hf_entry = d3.select(d).select('hf298_1')[0][0];
			return hf_entry == null ? 0: yScale(parseUncertainty(hf_entry)); 
		}).attr("r", function(d) {
			var hf_entry = d3.select(d).select('hf298_1')[0][0];
			var yval = hf_entry == null ? 0: parseUncertainty(hf_entry);
			return yval == 0 ? 0: 2;
			//return hf_entry == null ? 0: rScale(parseUncertainty(hf_entry)); 
		});; 
/*
	svg.selectAll("text")
	   .data(dataset)
	   .enter()
	   .append("text")
	   .text(function(d) {
	   	var hf_entry = d3.select(d).select('hf298_1')[0][0];
	   	var x = hf_entry == null ? '': xScale(parseHf(hf_entry)).toFixed(0),
	   		y = hf_entry == null ? '': yScale(parseUncertainty(hf_entry)).toFixed(0);
	   	if (x == '' || y == ''){
	   		return '';
	   	} 
	   	else{
	   		return x + "," + y;	
	   	}
        
   })
    .attr("x", function(d) {
    	var hf_entry = d3.select(d).select('hf298_1')[0][0];
	   	var x = hf_entry == null ? 0: xScale(parseHf(hf_entry));
        return x;
   })
   .attr("y", function(d) {
   		   	var hf_entry = d3.select(d).select('hf298_1')[0][0];
	   	var y = hf_entry == null ? 0: yScale(parseUncertainty(hf_entry)); 
        return y;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "red");
*/

var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);  //Set rough # of ticks

                  
svg.append("g")
 	.attr("class", "axis")  //Assign "axis" class
 	.attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
   
   
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);
svg.append("g")
 	.attr("class", "axis")  //Assign "axis" class
 	.attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);                      
});


function parseHf(hf_entry) {

	var unit_kcal = false, //reset
	hf_val = hf_entry.textContent;
	unit_kcal = hf_val.toUpperCase().indexOf('CAL') > -1 ? true : false;

	hf_val = hf_val.split('KJ')[0].split('KCAL')[0];
	arr = hf_val.split('+/-');
	hf_val = parseFloat(arr[0].trim());
	return (unit_kcal ? hf_val * 4.186 : hf_val);
}

function parseUncertainty(hf_entry){
	
	var unit_kcal = false, //reset
	hf_val = hf_entry.textContent;
	
	unit_kcal = hf_val.toUpperCase().indexOf('CAL') > -1 ? true: false;
	
	hf_val = hf_val.split('KJ')[0].split('KCAL')[0];
	hf_val = hf_val.split('+/-');

	if (hf_val.length > 1) {
		uncertainty = parseFloat(hf_val[1].trim());
		uncertainty = ( unit_kcal ? uncertainty * 4.186 : uncertainty);
	} else {
		uncertainty = 0;
	}
	
	return uncertainty;
}
