const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Chart settings
const margin = { top: 60, right: 40, bottom: 50, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// Tooltip
const tooltip = d3.select("#tooltip");

// SVG container
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetch and draw data
d3.json(url).then(data => {
  const dataset = data.data;

  // X and Y scales
  const xScale = d3.scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height, 0]);

  // X axis
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Y axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  // Bar width
  const barWidth = width / dataset.length;

  // Draw bars
  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", d => height - yScale(d[1]))
    .on("mouseover", (event, d) => {
      tooltip
        .attr("data-date", d[0])
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 40) + "px")
        .classed("hidden", false);
    })
    .on("mouseout", () => tooltip.classed("hidden", true));
});
