// Pie Chart Script (pieChart.js)
d3.csv("Fashion_Retail_Sales.csv").then(function(data) {
    const salesByPaymentMethod = d3.rollups(data, 
        v => d3.sum(v, d => +d['Purchase Amount (USD)']), 
        d => d['Payment Method']
    );

    const widthPie = 400, heightPie = 500, radiusPie = Math.min(widthPie, heightPie) / 2;

    const colorPie = d3.scaleOrdinal()
        .domain(salesByPaymentMethod.map(d => d[0]))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d[1]);

    const arc = d3.arc()
        .outerRadius(radiusPie - 10)
        .innerRadius(0);

    const labelArc = d3.arc()
        .outerRadius(radiusPie - 100)
        .innerRadius(radiusPie - 100);

    const svgPie = d3.select("#pieChart")
        .attr("width", widthPie)
        .attr("height", heightPie)
      .append("g")
        .attr("transform", `translate(${widthPie / 2},${heightPie / 2})`);

    const arcs = svgPie.selectAll(".arc")
        .data(pie(salesByPaymentMethod))
      .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => colorPie(d.data[0]));

    arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => d.data[0]);
});
