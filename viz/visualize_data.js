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


var myColor = d3.scaleLinear()
	.range(["white", "pink"])
	.domain([1, 100])

d3.csv("../cpu.csv")
	.row(function(d) {return {CPU: d.CPU, GPU: d.GPU, gameRating: d.gameRating}})

var CPU = d3.map(data, function(d){return d.CPU;}).keys()
  var CPU = d3.map(data, function(d){return d.GPU;}).keys()

var x = d3.scaleBand()
	.range([0, width])
	.domain(CPU)

svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

var y = d3.scaleBand()
	.range([0, height])
	.domain(GPU)

d3.csv("../cpugpu.csv", function(data) {
	svg.selectAll()
		.data(data, function(d) {return CPU + ':' + GPU;})
		.enter()
		.append("rect")
		.attr("x", function(d) {return CPU})
		.attr("y", function(d) {return GPU})
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.style("fill", function(d) {return myColor(gameRating)})
})
