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


d3.csv("../cpugpu.csv", function(data) {
	//more like the scale of each
	svg.selectAll()
		.data(data, function(d) {return d.CPU + ':' + d.GPU;})
		

	
})



