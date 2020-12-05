//set dimensions

var margin = {top: 30, right: 50, bottom: 10, left: 50},
	width = 1000 - margin.left - margin.right,
	height = 950 - margin.bottom - margin.top;

//append svg object
var svg = d3.select('#my_dataviz')
.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.csv("../cpugpu.csv", function(data)) {
	var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

	dimensions = ["Game Rating", "Desktop Rating", "Work Rating"]

	var y = {}

	for (i in dimensions) {
		name = dimensions[i]
		y[name] = d3.scaleLinear()
			.domain([0,350])
			.range([height, 0])
	}

	x = d3.scalePoint()
		.range([0, width])
		.domain(dimensions)

	var highlight = function(d) {
		selected_rating = d.CPU

		d3.selectAll(".line")
	      .transition().duration(200)
	      .style("stroke", "lightgrey")
	      .style("opacity", "0.2")
	    // Second the hovered specie takes its color
	    d3.selectAll("." + selected_specie)
	      .transition().duration(200)
	      .style("stroke", color(selected_specie))
	      .style("opacity", "1")
	}

	var doNotHighlight = function(d){
	    d3.selectAll(".line")
	      .transition().duration(200).delay(1000)
	      .style("stroke", function(d){ return( color(d.CPU))} )
	      .style("opacity", "1")
  	}
}



