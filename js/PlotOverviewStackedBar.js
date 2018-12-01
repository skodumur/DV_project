function plotOverviewGraph(index, selectedBrowser, selectedLocation){
    d3.select("#stacked").selectAll("*").remove();
	var margin = {top: 0, right: 20, bottom: 30, left: 40};
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
    let curpos = 0;
    d3.json(`data/data1/sequences${index}.json`, function(error, data) {
        let temp = [];
		_.each(data.urls,(d)=>{
            if (selectedBrowser && selectedBrowser != 'All') {
                if (selectedBrowser == d.Browser)
                    temp.push(d.sequences);
            } else if (selectedLocation && selectedLocation != 'All') {
				if (selectedLocation == d.Location)
                    temp.push(d.sequences);
			} else {
				temp.push(d.sequences);
			}
		});
		data = temp;
		var size;
		let y_min = y_max = 0;
		if(data.length > 60){
			size = 600 + (data.length - 60)*10;
		}
		else
			size = 600;
		var width = size - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom; 
        var x = d3.scaleLinear()
		.range([0, width]);

		var y = d3.scaleLinear()
			.range([height, margin.top]);

		var center = d3.scaleLinear()
			.range([0, width]);

		var color = d3.scaleOrdinal()
            .range(["#DBDB8D", "#FFBB78", "#FF9896", "#2F4F4F","#98DF8A", "#C5B0D5", "#AEC7E8", "#F7B6D2","#FFFF38", "#0000CD", "#808000", "#483D8B"]);
            for(let i in data){
                colorMap = {};
                for(let cur in data[i]){
                    let curColor = urlMap[data[i][cur]];
                    colorMap[curColor] = colorMap[curColor] ? (colorMap[curColor]+1) : 1;
                }
                data[i].components = [];
                let yVal = 0;
                for (let key in colorMap) {
                    data[i].components.push({key: key, y0: yVal, y1: yVal -= colorMap[key]})
                }
            }
            
        var datestart = 0;
        var dateend = data.length;
        y_max = 100;
        // if(y_min + y_max > 90)
        //     height = 400 + (y_min + y_max - 90)*5;
        var x = d3.scaleLinear()
        .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, margin.top]);

        var center = d3.scaleLinear()
            .range([0, width]);
        var centerLine = d3.axisTop(center).ticks(0)
        x.domain([0, dateend]);
        y.domain([-y_max, y_min]);
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
            .attr("transform", function(d) {
                return "translate(" + x(counter++) + ", 0)"; });
        var tooltip = d3.select("#stacked")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("font-size", "12px")
            .style("width", "80px")
            .style("visibility", "hidden")
            .style("border", "solid 1px")
            .style("background-color", "white");
        entry.selectAll("rect")
            .data(function(d) {
                return d.components;
                })
            .enter().append("rect")
            .attr("width", 5)
            .attr("y", function(d) { 
                return y(d.y0); 
            })
            .attr("height", function(d) { return  Math.abs(y(d.y0) - y(d.y1))-1; })
            .style("fill", function(d) { 
                return colorCode[d.key]; 
            } )

            .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(d,a,b,event){
                return tooltip.html(b[a].__data__.key).style("top", (event.offsetY+180)+"px").style("left",(event.offsetX)+"px");
            })
        barchargraph(size, index, false, selectedBrowser, selectedLocation);
    
        })
}

