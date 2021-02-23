var data = [
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
];

Promise.all(data.map(url => d3.json(url))).then(items => {

    JSON.stringify(items[0]);
    JSON.stringify(items[1]);

    var svg = d3.select('svg')
        .attr("width", 1000)
        .attr("height", 1000)
        .append("g")
        .attr("transform", "translate(45 15)");

    var color = d3.scaleThreshold()
        .domain(d3.range((d3.min(items[1], d => d.bachelorsOrHigher)), (d3.max(items[1], d => d.bachelorsOrHigher)), 9))
        .range(d3.schemeGreens[9]);

    var x = d3.scaleLinear()
        .domain([(d3.min(items[1], d => d.bachelorsOrHigher)), (d3.max(items[1], d => d.bachelorsOrHigher))])
        .rangeRound([300, 800]);

    var tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style("height", "40px")
        .style("width", "500px")
        .style("z-index", "500")
        .style("visibility", "visible")
        .style("text-align", "center")
        .style("color", "black")
        .style("position", "fixed")
        .style("bottom", "80px")
        .style("left", "50%")
        .style("font-size", "20px")
        .style("font-weight", "bold");






    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(items[0], items[0].objects.counties).features)
        .enter().append('path')
        .attr('class', 'county')
        .attr('data-fips', function(d) { return d.id })
        .attr('data-education', function(d) {
            var D = function(f) { return f.fips == d.id };

            return (items[1]).find(D).bachelorsOrHigher;
        })
        .attr('fill', function(d) {
            var D = function(f) { return f.fips == d.id };

            return color((items[1]).find(D).bachelorsOrHigher);
        })
        .attr('d', (d3.geoPath()))

    .on('mouseover', function handleMouseOver(d) {
        var D = function(f) { return f.fips === d.id }
        var R = (items[1]).find(D);
        tooltip.text(function() {
            if (R) { return R.area_name + ", " + R.state + " : " + R.bachelorsOrHigher + "%" }
        });

        tooltip.attr('data-education', function() { if (R) { return R.bachelorsOrHigher } });
        tooltip.style('visibility', 'visible');
    })

    .on('mouseout', function handleMouseOut() {
        tooltip.style('visibility', 'hidden');
    });






});

//Reference: https://codepen.io/askov/pen/rZaqwz