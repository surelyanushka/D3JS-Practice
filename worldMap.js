const width = 1000;
const height = 600;

const svg = d3.select("#worldMap")
    .attr("width", width)
    .attr("height", height);


const projection = d3.geoMercator()
    .scale(150)  
    .translate([width / 2, height / 1.5]);  // Centering the map

//zoom funcitonality   
const zoom = d3.zoom()
    .scaleExtent([1, 8]) 
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed(event) {
    svg.selectAll('path')
        .attr('transform', event.transform);
}

const path = d3.geoPath().projection(projection);


const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "12px");


d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {
    
    svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "country")
        .attr("fill", "#ccc")
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", "steelblue"); 
            

            tooltip.style("visibility", "visible")
                .html(`<strong>${d.properties.name}</strong>`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {

            d3.select(this).style("fill", "#ccc"); 
            

            tooltip.style("visibility", "hidden");
        })

}).catch(function(error){
    console.error("Error loading the GeoJSON data: " + error);
});
