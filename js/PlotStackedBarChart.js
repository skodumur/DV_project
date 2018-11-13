    var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 600 - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom; 
	var counter = 0;	

	var x = d3.scaleLinear()
		.range([0, width]);

	var y = d3.scaleLinear()
		.range([height, margin.top]);

	var center = d3.scaleLinear()
		.range([0, width]);

	var color = d3.scaleOrdinal()
		.range(["#BBCDA3", "#055C81", "#B13C3D", "#CCB40C","#BBCDA3", "#055C81", "#B13C3D", "#CCB40C","#BBCDA3", "#055C81", "#B13C3D", "#CCB40C"]);

	var labels = ["Production and Income", "Employment, Unemployment, and Hours", "Consumption and Housing", "Sales, Orders, and Inventories"];

	// var xAxis = d3.axisBottom(x).ticks(10);
	// var yAxis = d3.axisLeft(y).ticks(10);

	var centerLine = d3.axisTop(center).ticks(0);


	d3.json("data/StackedBarData.json", function(error, data) {
		data = data.urls

		data.forEach(function(d,i) {

			var y0_positive = 0;
			var y0_negative = 0;
			var keys = d3.keys(data[i]);
			d.components = keys.map(function(key) {
				return {key: key, y1: y0_positive, y0: y0_positive += 0.5 };
				if (d[key]) {
					return {key: key, y1: y0_positive, y0: y0_positive += 0.5 };
				} else if (d[key] < 0) {
					return {key: key, y0: y0_negative, y1: y0_negative += 0.5 };
				}
			})
		})


		var y_min = d3.min(data, function(d) { return Object.keys(d).length});
		var y_max = d3.max(data, function(d){ return Object.keys(d).length});

		var datestart = 0;
		var dateend = Object.keys(data).length;

		x.domain([0, dateend]);
		y.domain([0, y_max]);
		color.domain(data);

		var svg = d3.select("#stacked").append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.append("g")
									.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		svg.append("g")
			.attr("class", "centerline")
			.attr("transform", "translate(0," + y(0) + ")")
			.call(centerLine);

		var entry = svg.selectAll(".entry")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { return "translate(" + x(counter++) + ", 0)"; });

		entry.selectAll("rect")
			.data(function(d) { return d.components; })
			.enter().append("rect")
			.attr("width", 3)
			.attr("y", function(d) { return y(d.y0); })
			.attr("height", function(d) { return Math.abs(y(d.y0) - y(d.y1)); })
			.style("fill", function(d) { return color(d.key); } );


		var legend = svg.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
			.attr("class", "legend");
			//.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", 675)
			.attr("y", function(d, i) { return i * 25 + 300 })
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color );

		legend.append("text")
			.attr("x", 700)
			.attr("y", function(d, i) { return i * 25 + 309; })
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d, i) { return labels[i]; });

	})