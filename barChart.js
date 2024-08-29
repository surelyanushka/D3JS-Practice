
d3.csv("Fashion_Retail_Sales.csv").then(function(data) {
    // Aggregate total sales by item purchased and sort by total sales descending
    const salesByItem = d3.rollups(data, 
        v => d3.sum(v, d => +d['Purchase Amount (USD)']), 
        d => d['Item Purchased']
    ).sort((a, b) => d3.descending(a[1], b[1]));

    // Only taking the 
    const top10SalesByItem = salesByItem.slice(0, 10);

    const widthBar = 500, heightBar = 500, marginBar = {top: 20, right: 30, bottom: 80, left: 60};
    const innerWidth = widthBar - marginBar.left - marginBar.right;
    const innerHeight = heightBar - marginBar.top - marginBar.bottom;

    const svgBar = d3.select("#barChart")
        .attr("width", widthBar)
        .attr("height", heightBar);

    const xBar = d3.scaleBand()
        .domain(top10SalesByItem.map(d => d[0]))
        .range([marginBar.left, innerWidth])
        .padding(0.1);

    const yBar = d3.scaleLinear()
        .domain([0, d3.max(top10SalesByItem, d => d[1])]).nice()
        .range([innerHeight, marginBar.top]);

    svgBar.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect").data(top10SalesByItem).enter().append("rect")
        .attr("x", d => xBar(d[0]))
        .attr("y", d => yBar(d[1]))
        .attr("height", d => innerHeight - yBar(d[1]))
        .attr("width", xBar.bandwidth());

    svgBar.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xBar))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svgBar.append("g")
        .attr("transform", `translate(${marginBar.left},0)`)
        .call(d3.axisLeft(yBar));
});
