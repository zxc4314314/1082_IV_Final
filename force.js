var color = d3.scaleQuantize()
    .domain([0,7])
    .range(["#000", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#2c6785", "#ffee9c", "#6b6f8a"]);

file = "./final.csv"

var margin = {top: 50, right: 50, bottom: 50, left: 50},
    w = 1*(window.screen.width), //- margin.left - margin.right,
    h = 1*(window.screen.height); //+ margin.top - margin.bottom;

var radius = 8;
// var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([margin.left, w-margin.right]);
var textScale = d3.scalePoint().padding(1).range([0, w]);
var forceStrength = 0.1;

d3.csv(file, function(data){
    var svg = d3.select("#svg_bubbles").append("svg")
        .attr("width", w)
        .attr("height", h)

    var simulation = d3.forceSimulation()
        .force("collide",d3.forceCollide( function(d){
            return d.r + 4 }).iterations(16) 
        )
        .force("charge", d3.forceManyBody())
        .force("y", d3.forceY().y(h / 2))
        .force("x", d3.forceX().x(w / 2))

    data.forEach(function(d){
        // d.r = d[Dimension]*2;
        d.r = radius;
        d.x = w / 2;
        d.y = h / 2;
    })

    var circles = svg.selectAll("circle")
        .data(data, function(d){ return d.ID ;});

    var div = d3.select("#svg").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    var circlesEnter = circles.enter().append("circle")
        .attr("r", function(d, i){ return d.r; })
        .attr("cx", function(d, i){ return 175 + 25 * i + 2 * i ** 2; })
        .attr("cy", function(d, i){ return 0; })
        .style("fill", "none")
        .style("stroke", function(d, i){ return color(0); })
        .style("stroke-width", 1)
        .style("pointer-events", "all")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(d.Term)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    circles = circles.merge(circlesEnter)

    function ticked() {
        circles
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; });
    }   

    simulation
        .nodes(data)
        .on("tick", ticked);


    function dragstarted(d,i) {
        if (!d3.event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d,i) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d,i) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        var me = d3.select(this)
        console.log(me.classed("selected"))
        me.classed("selected", !me.classed("selected"))
    } 

    function splitBubbles(Group) {

        centerScale.domain(data.map(function(d){ return d[Group]; }).sort());
        textScale.domain(data.map(function(d){ return d[Group]; }).sort());

        // console.log(data.map(function(d){ return d[Group]; }));

        showTitles(Group, textScale);
        d3.selectAll("circle")
            .transition()
            .duration(3000)
            .style("fill", function(d){ return color(d[Group]);})
            .style("stroke-width", 0)

        a =  function(d, i){ return color(+(d[Group])); }

        console.log()

        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){ 
            return centerScale(d[Group]);
        }));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
    }

    function hideTitles() {
        svg.selectAll('.title').remove();
    }

    function showTitles(Group, scale) {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        var titles = svg.selectAll('.title')
            .data(scale.domain());

        console.log((scale(1)));

        titles.enter().append('text')
            .attr('class', 'title')
            .merge(titles)
            .attr('x', function (d) { return scale(d); })
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) { return  'Cluster' + d; });

        titles.exit().remove() 
    }


    d3.selectAll('.group')
        .on('click', function () {

            // Remove active class from all buttons
            d3.selectAll('.group').classed('active', false);
            // Find the button just clicked
            var group = d3.select(this);

            // Set it as the active button
            group.classed('active', true);

            // Get the id of the button
            var modal_group = group.attr('id');

            // console.log(buttonClass.search("modal"));
            // console.log(buttonClass);
            splitBubbles(modal_group);

            // Toggle the bubble chart based on
            // the currently clicked button.
        });

    d3.selectAll('.dimension')
        .on('click', function(){
            d3.selectAll('.dimension').classed('active', false);

            var dimension = d3.select(this);

            dimension.classed('active', true);
            
            var Dimension = dimension.attr('id');

            data.forEach(function(d){
                d.r = d[Dimension]*2;
            })

            // update = circles.data(data);

            // update
            circles.transition()
                .duration(1000)
                .attr("r", function(d){ return d.r; });
        });
});
