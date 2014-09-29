//keep track of the order in which the IDs are ordered:
var aAsc = [];


/*
 *  https://github.com/Sjeiti/TinySort
 *  bower install tinysort
 */

function sortTable(id) {
	aAsc[id] = aAsc[id] == 'asc' ? 'desc' : 'asc';
	//use jQuery ID selector to access td element with ID = parameter:
	$('table>tbody>tr').tsort('td#' + id, {
		order : aAsc[id]
	});

}

function redraw() {
	sortTable(menu.property("value"));
}

function change() {
	d3.transition().each(redraw);
}
function sortColumns(header_entries){
	//select thead header elements: which contain the same strings as the td elements in tbody:
	d3.selectAll("thead th").on('click', sortTable);

	//append 'change' event to menu select elements:
	var menu = d3.select("#menu select").on("change", change);

	//create menu options:
	menu.selectAll("option")
      .data(header_entries)
    .enter().append("option")
      .text(function(d) { return d; });
	//set default option:
  	menu.property("value", "formula");
}