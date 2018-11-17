function plotStacked(index) {
	d3.select("#stacked").selectAll("*").remove();
	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = parseInt(d3.select("#stacked").style("width")) - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom; 
	var counter = 0;
	var urlMap = {
		"url": "category",
		"http://www.acme.com/": "books",
		"http://www.acme.com/SH55126545/VD55149415": "movies",
		"http://www.acme.com/SH55126545/VD55163347": "games",
		"http://www.acme.com/SH55126545/VD55165149": "electronics",
		"http://www.acme.com/SH55126545/VD55166807": "computers",
		"http://www.acme.com/SH55126545/VD55170364": "home&garden",
		"http://www.acme.com/SH55126545/VD55173061": "handbags",
		"http://www.acme.com/SH55126545/VD55177927": "clothing",
		"http://www.acme.com/SH55126545/VD55179433": "shoes",
		"http://www.acme.com/SH55126554/VD55147564": "outdoors",
		"http://www.acme.com/SH5568487/VD55169229": "automotive",
		"http://www.acme.com/SH5580165/VD55156528": "clothing",
		"http://www.acme.com/SH5580165/VD55173281": "tools",
		"http://www.acme.com/SH5582037/VD5582082": "accessories",
		"http://www.acme.com/SH5584743/VD55162989": "grocery",
		"http://www.acme.com/SH5584743/VD55178549": "clothing",
		"http://www.acme.com/SH5585921/VD55178554": "clothing",
		"http://www.acme.com/SH5585921/VD55179070": "clothing",
		"http://www.acme.com/SH5587637/VD55129406": "clothing",
		"http://www.acme.com/SH5587637/VD55134536": "shoes",
		"http://www.acme.com/SH5587637/VD55137665": "shoes",
		"http://www.acme.com/SH5587637/VD55167939": "shoes",
		"http://www.acme.com/SH5587637/VD55178312": "shoes",
		"http://www.acme.com/SH5587637/VD55178699": "shoes",
		"http://www.acme.com/SH559026/VD5568891": "handbags",
		"http://www.acme.com/SH559026/VD5582785": "handbags",
		"http://www.acme.com/SH559040/VD55175948": "handbags",
		"http://www.acme.com/SH559044/VD5586386": "handbags",
		"http://www.acme.com/SH559056/VD55178907": "handbags",
		"http://www.acme.com/SH559056/VD55179132": "handbags",
		"http://www.acme.com/SH559056/VD55181666": "handbags"
	}
	var colorCode = {
		"accessories": "#BBCDA3",
		"automotive": "#055C81",
		"books": "#B13C3D",
		"clothing": "#CCB40C",
		"computers": "#BBCDA3",
		"electronics": "#055C81",
		"games": "#B13C3D",
		"grocery": "#CCB40C",
		"handbags": "#BBCDA3",
		"home&garden": "#055C81",
		"movies": "#B13C3D",
		"outdoors": "#CCB40C",
		"shoes": "#CCB40C"
	}

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


	d3.json(`data/sequences${index}.json`, function(error, data) {
		data = data.urls

		data.forEach(function(d,i) {

			var y0_positive = 0;
			var y0_negative = 0;
			//var keys = d3.keys(data[i]);
			d.components = data[i].map(function(key) {
				return {key: key, y1: y0_positive, y0: y0_positive += 1 };
				// if (d[key]) {
				// 	return {key: key, y1: y0_positive, y0: y0_positive += 0.5 };
				// } else if (d[key] < 0) {
				// 	return {key: key, y0: y0_negative, y1: y0_negative += 0.5 };
				// }
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
			.attr("width", 5)
			.attr("y", function(d) { return y(d.y0); })
			.attr("height", function(d) { return Math.abs(y(d.y0) - y(d.y1)); })
			.style("fill", function(d) { 
				return colorCode[urlMap[d.key]]; 
			} );


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
}	