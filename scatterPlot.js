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

    svgScatter.append("g")
        .selectAll("dot")
        .data(scatterPlotData)
        .enter().append("circle")
        .attr("cx", d => xScatter(d['Purchase Amount (USD)']))
        .attr("cy", d => yScatter(d['Review Rating']))
        .attr("r", 5)
        .attr("fill", "steelblue");
});
