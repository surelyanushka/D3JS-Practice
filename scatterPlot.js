// Scatter Plot Script (scatterPlot.js)
d3.csv("Fashion_Retail_Sales.csv").then(function(data) {
    data.forEach(d => {
        d['Purchase Amount (USD)'] = +d['Purchase Amount (USD)'];
        d['Review Rating'] = +d['Review Rating'];
    });

    const scatterPlotData = data.filter(d => !isNaN(d['Review Rating']));

    const widthScatter = 500, heightScatter = 500, marginScatter = {top: 20, right: 30, bottom: 40, left: 50};
    const innerWidth = widthScatter - marginScatter.left - marginScatter.right;
    const innerHeight = heightScatter - marginScatter.top - marginScatter.bottom;

    const svgScatter = d3.select("#scatterPlot")
        .attr("width", widthScatter)
        .attr("height", heightScatter);

    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(scatterPlotData, d => d['Purchase Amount (USD)'])]).nice()
        .range([marginScatter.left, innerWidth]);

    const yScatter = d3.scaleLinear()
        .domain([0, 5]).nice()  // Assuming ratings are between 0 and 5
        .range([innerHeight, marginScatter.top]);

    svgScatter.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScatter));

    svgScatter.append("g")
        .attr("transform", `translate(${marginScatter.left},0)`)
        .call(d3.axisLeft(yScatter));

    // Create a tooltip div that is initially hidden
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#f9f9f9")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("border-radius", "4px");

    // Plot the scatter points
    svgScatter.append("g")
        .selectAll("dot")
        .data(scatterPlotData)
        .enter().append("circle")
        .attr("cx", d => xScatter(d['Purchase Amount (USD)']))
        .attr("cy", d => yScatter(d['Review Rating']))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                   .text(`Amount: $${d['Purchase Amount (USD)']} | Rating: ${d['Review Rating']}`)
                   .style("left", (event.pageX + 15) + "px")
                   .style("top", (event.pageY - 15) + "px");
            d3.select(this).attr("r", 8).attr("fill", "orange");  // Highlight the point
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 15) + "px")
                   .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("r", 5).attr("fill", "steelblue");  // Reset the point
        });
});
