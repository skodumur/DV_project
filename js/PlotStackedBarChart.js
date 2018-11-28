function plotStacked(index, isHighlight, categoryVal) {
	const highlights = [];
	var check = 0;
	let curData = mainPatternData[index];
	for(let i in curData){
		highlights.push(curData[i].label);
	}
	highlights.splice(-1,1);
	//console.log(highlights);
	d3.select("#stacked").selectAll("*").remove();
	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	let barHeight = 1;
	var counter = 0;
	var urlMap = {
		"url": "category",
		"http://www.acme.com/": "books",
		"http://www.acme.com/SH55126545/VD55149415": "movies",
		"http://www.acme.com/SH55126545/VD55163347": "games",
		"http://www.acme.com/SH55126545/VD55165149": "electronics",
		"http://www.acme.com/SH55126545/VD55166807": "computers",
		"http://www.acme.com/SH55126545/VD55170364": "home",
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

	d3.json(`data/sequences${index}.json`, function(error, data) {
		var size;
		let ymin = ymax = 0;
		let y_min = y_max = 0;
		if(data.urls.length > 60){
			size = 600 + (data.urls.length - 60)*10;
		}
		else
			size = 600;
		var width = size - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom; 
		data = data.urls

		var color = d3.scaleOrdinal()
			.range(["#DBDB8D", "#FFBB78", "#FF9896", "#2F4F4F","#98DF8A", "#C5B0D5", "#AEC7E8", "#F7B6D2","#FFFF38", "#0000CD", "#808000", "#483D8B"]);

		data.forEach(function(d,i) {

			var y0_positive = 0;
			var y0_negative = 0;
			let newArr = highlights.slice();
			check = 0;
			if(ymin > y_min)
				y_min = ymin;
			if(ymax > y_max)
				y_max = ymax;

			ymin = 0;
			ymax = 0;
			d.components = data[i].map(function(key) {
				if(categoryVal){
					let obj ;
					if(check == 0){
						if(newArr[0] == urlMap[key] && categoryVal == urlMap[key]){
							obj = {key: key, y1: y0_positive, y0: y0_positive += barHeight };
							ymax++;
							check = 1;
						}
						else if(newArr[0] == urlMap[key]){
							newArr.shift();
							obj = {key: key, y0: y0_negative, y1: y0_negative -= barHeight };
							ymin++;
						}
						else{
							obj = {key: key, y0: y0_negative, y1: y0_negative -= barHeight };
							ymin++
						}
					}
					else{
						 obj = {key: key, y1: y0_positive, y0: y0_positive += barHeight };
						 ymax++;
					}
					return obj;					
				}
				else{
					let obj = {key: key, y1: y0_positive, y0: y0_positive += barHeight };
					ymax++;
					if (newArr[0] == urlMap[key] && isHighlight) {
						obj.highlight = true;
						newArr.shift();
					}
					return obj;
				}
			})
		})


		//var y_min = d3.min(data, function(d) { return Object.keys(d).length});
		//var y_max = d3.max(data, function(d){ return Object.keys(d).length});

		var datestart = 0;
		var dateend = Object.keys(data).length;
		if(y_min + y_max > 90)
			height = 400 + (y_min + y_max - 90)*5;
		var x = d3.scaleLinear()
		.range([0, width]);

		var y = d3.scaleLinear()
			.range([height, margin.top]);

		var center = d3.scaleLinear()
			.range([0, width]);
		var centerLine = d3.axisTop(center).ticks(0)
		x.domain([0, dateend]);
		y.domain([-y_min, y_max]);
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

		var tooltip = svg.append("g").style("display", "none");
		var entry = svg.selectAll(".entry")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) {
				return "translate(" + x(counter++) + ", 0)"; });
		entry.selectAll("rect")
			.data(function(d) {
				return d.components;
			 })
			.enter().append("rect")
			.attr("width", 5)
			.attr("y", function(d) { 
				return y(d.y0); 
			})
			.attr("height", function(d) { return  Math.abs(y(d.y0) - y(d.y1)+1); })
			.attr('stroke', function(d) {
				return d.highlight &&'#000000';
				})
			.attr("stroke-width", 2)
			.style("fill", function(d) { 
				return colorCode[urlMap[d.key]]; 
			} )
			.on("mouseover", function() { 
				console.log("mouseover")
				tooltip.style("display", null); 
			})
			.on("mouseout", function() {
				console.log("mouseout") 
				tooltip.style("display", "none"); 
			})
			 .on("mousemove", function(d) {
				console.log("mousemove")
			   var xPosition = d3.mouse(this)[0] - 1;
			   var yPosition = d3.mouse(this)[1] - 1;
			   tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			   tooltip.select("text").text(d.key);
			 });

		
			
		tooltip.append("rect")
			.attr("width", 60)
			.attr("height", 60)
			.attr("fill", "white")
			.style("opacity", 0.5);
		
		tooltip.append("text")
			.attr("x", 30)
			.attr("dy", "1.2em")
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("font-weight", "bold");
	barchargraph(size, index);

	})
}	