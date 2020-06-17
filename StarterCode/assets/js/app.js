//set svg and chart dimensions
//set svg dimensions
var svgHeight = 500;
var svgWidth = 750;

//set borders in svg
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//calculate chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//append an svg element to the chart with appropriate height and width
var svg = d3.select("#scatter")
    .append("div")
    .classed("chart", true)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//read data from CSV file and capture healthcare and poverty info
d3.csv("./assets/data/data.csv").then(function(importedData) {
    importedData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //setup the Axis for the graph.  In order to get the data points in, min was decreased and max was increase by .1 factor
    var xLinearScale = d3.scaleLinear().domain([d3.min(importedData, d => d.poverty)*0.9, d3.max(importedData, d => d.poverty)*1.1]).range([0,width]);
    var yLinearScale = d3.scaleLinear().domain([d3.min(importedData, d => d.healthcare)*0.9, d3.max(importedData, d => d.healthcare)*1.1]).range([height, 0]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //label x axis
    chartGroup.append("g")
        .attr("transform", `translate(${width / 2.5}, ${height + 10 + margin.top})`)
        .append("text")
        .attr("value", "poverty")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

    //append y axis
    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    //label y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("font-weight", "bold")
        .text("Lacks Healtcare(%)");

    //draw circle data points
    chartGroup.selectAll("circle")
        .data(importedData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill","blue")
        .attr("opacity", .5);
    
    //put state initials
    chartGroup.append("text")
        .selectAll("tspan")
        .data(importedData)
        .enter()
        .append("tspan")
        .attr("x", d => xLinearScale(d.poverty -.18))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", 3)
        .attr("font-size","10px")
        .attr("fill", "white")
        .style("font-weight", "bold")
        .text(function(d) {return d.abbr});
});
