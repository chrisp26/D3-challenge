// Create svg canvas
var svgWidth = 825;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial x-axis value
var chosenXAxis = "smokes"
var chosenYAxis = "age"

// Function for updating x-scale var when axis label clicked
function xScale(healthData, chosenXAxis){
  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d[chosenXAxis]) * .8,
    d3.max(healthData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}

// Function for updating y-scale var when axis label clicked
function yScale(healthData, chosenYAxis){
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d[chosenYAxis]) * .95,
    d3.max(healthData, d => d[chosenYAxis]) * 1.05])
    .range([0, height]);

  return yLinearScale;
}

// Import Data
d3.csv("data.csv").then(function(healthData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  healthData.forEach(function(data) {
    data.smokes = +data.smokes;
    data.age = +data.age;
    // console.log(data.age)
  });

  // Step 2: Create scale functions
  // ==============================
  // OLD X
  // var xLinearScale = d3.scaleLinear()
  //   .domain([8, d3.max(healthData, d => d.smokes)])
  //   .range([0, width]);

  var xLinearScale = xScale(healthData, chosenXAxis); //NEW

  // OLD Y
  // var yLinearScale = d3.scaleLinear()
  //   .domain([26, d3.max(healthData, d => d.age)])
  //   .range([height, 0]);

  var yLinearScale = yScale(healthData, chosenYAxis); //NEW

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.age))
  .attr("r", "15")
  .attr("fill", "pink")
  .attr("opacity", ".5");

  // // Step 6: Initialize tool tip
  // // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -100])
    .html(function(d) {
      return (`<strong>${d.state}</strong><hr>% smokers: ${d.smokes}%<br>Average age: ${d.age} years`);
    });

  // // Step 7: Create tooltip in the chart
  // // ==============================
  chartGroup.call(toolTip);

  // // Step 8: Create event listeners to display and hide the tooltip
  // // ==============================
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    // onmouseout event
    .on("mouseout", function(d, index) {
      toolTip.hide(d);
    });


    // Create circle labels
  var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append('text');

  circleLabels
    .attr('x', function(d){
      return xLinearScale(d.smokes);
    })
    .attr('y', function(d){
      return yLinearScale(d.age);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "red");

    // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .text("Average Age");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
    .attr("class", "axisText")
    .attr("class", "axis-text")
    .text("Smokers (%)");


}).catch(function(error) {
  console.log(error);
});


