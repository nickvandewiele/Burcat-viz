
d3.xml("data/BURCAT_THR.xml", function(xml) {
	dataset = d3.select(xml).selectAll("specie")[0];
	createBubbleChart();
	createScatterPlot(dataset);
	createMWPlot(dataset);
	createTable(dataset);
});




