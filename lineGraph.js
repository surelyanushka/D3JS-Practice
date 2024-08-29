// Line Graph Script (lineGraph.js)
d3.csv("Fashion_Retail_Sales.csv").then(function(data) {
    const parseDate = d3.timeParse("%Y-%m-%d");

    const salesByDate = d3.rollups(data, 
        v => d3.sum(v, d => +d['Purchase Amount (USD)']), 
        d => parseDate(d['Date Purchase'])
    ).sort((a, b) => d3.ascending(a[0], b[0]));

    const widthLine = 500, heightLine = 500, marginLine = {top: 20, right: 30, bottom: 30, left: 50};
    const innerWidth = widthLine - marginLine.left - marginLine.right;
    const innerHeight = heightLine - marginLine.top - marginLine.bottom;

    const svgLine = d3.select("#lineGraph")
        .attr("width", widthLine)
        .attr("height", heightLine);

    const xLine = d3.scaleTime()
        .domain(d3.extent(salesByDate, d => d[0]))
        .range([marginLine.left, innerWidth]);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(salesByDate, d => d[1])]).nice()
        .range([innerHeight, marginLine.top]);

    const line = d3.line()
        .x(d => xLine(d[0]))
        .y(d => yLine(d[1]));

    svgLine.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xLine));

    svgLine.append("g")
        .attr("transform", `translate(${marginLine.left},0)`)
        .call(d3.axisLeft(yLine));

    svgLine.append("path")
        .datum(salesByDate)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
});
