function barchargraph(size, index, counts, selectedBrowser, selectedLocation){
  d3.select("#barChart").selectAll("*").remove();
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = size - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

var yAxis = d3.axisLeft().scale(y)
    .ticks(3);
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg1 = d3.select("#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
if (counts && counts.length) {
  data = _.map(counts, (c, i) => {
    return {"sequence": "sequence" + (i+1), "count": c};
  })
  data.columns = ["sequence", "count"];
  plot(data);
} else {
// get the data
d3.csv(`data/data1/vistorCount${index}.csv`, function(error, data) {
  if (error) throw error;
  let temp = [];
  _.each(data,(d)=>{
    if (selectedBrowser && selectedBrowser != 'All') {
      if (selectedBrowser == d.Browser)
          temp.push(d);
      } else if (selectedLocation && selectedLocation != 'All') {
            if (selectedLocation == d.Location)
              temp.push(d);
      } else {
          temp.push(d);
      }
  });
  plot(temp);
});
}

function plot(data) {
    // format the data
    data.forEach(function(d) {
      d.count = +d.count;
    });
  
    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.sequence; }));
    // y.domain([0, d3.max(data, function(d) { return d.count; })]);
    y.domain([0, 10]);
  
  
    // append the rectangles for the bar chart
    svg1.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.sequence); })
        .attr("width", 5)
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });
  
    // add the x Axis
    // svg1.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));
  
    // add the y Axis
    svg1.append("g")
        .call(yAxis);
}
}