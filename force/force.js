
var c5_color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

var color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#000", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#2c6785", "#ffee9c", "#6b6f8a"]);

var temp;

file = "./final.csv"
// file = "./t.csv"
/*d3.csv(file, function(data){
    let margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 1*(window.screen.width), //- margin.left - margin.right,
        height = 1*(window.screen.height); //+ margin.top - margin.bottom;

    let maxRadius =  height*0.1,
        padding = 20,
        clusterPadding = 20,
        n = 218,
        clusters = new Array(5);

    let svg = d3.select("#svg").append("svg")
        .attr("width", width)
        .attr("height", height )
        .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        // .attr("transform",
        //     "translate(" + margin.left + "," + margin.top + ")");

    let div = d3.select("#svg").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    let radiusScale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return (+d.valence);} ))
        // .range([1, 10]);
        .range(d3.extent(data, function(d) { return (+d.valence)*2;} ));


    // console.log(d3.extent(data, function(d) { return +d.valence;}));

    // console.log(data);
    
    (generate_node(5, "valence"));
    function generate_node(Cluster, Dimension){


        Dimension = "valence";

         nodes = data.map((d) => {
            // scale radius to fit on the screen
            let scaledRadius  = radiusScale(((+d[Dimension])*1)),
                group = +d.C5_Modal-1;

            // add cluster id and radius to array
            d = {
                cluster     : group,
                r           : scaledRadius,
                term        : d.Term,
                valence     : +(d[Dimension]),
                // major_cat   : d.Major_category
            };
            // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
            if (!clusters[group] || (scaledRadius > clusters[group].r)) clusters[group] = d;

            // console.log(d);

            return d;
        });

        console.log(nodes);
    }


    let circles = svg.append('g')
        .datum(nodes)
        .selectAll('.circle')
        .data(d => d)
        .enter().append('circle')
        .attr('r', (d) => d.r)
    // .transition()
    // .duration(1000)
        .attr('fill', (d) => color(d.cluster))
        .attr('stroke', 'black')
        .attr('stroke-width', 0)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
    // add tooltips to each circle
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(d.term + " " + d.valence)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // create the clustering/collision force simulation
    let simulation = d3.forceSimulation(nodes)
        .velocityDecay(0.2)
        .force("x", d3.forceX().strength(.0005))
        .force("y", d3.forceY().strength(.0005))
        .force("cluster", clustering)
        .force("collide", collide)
        .on("tick", ticked);

    function ticked() {
        circles
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    }

    // Drag functions used for interactivity
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }


    // These are implementations of the custom forces.
    function clustering(alpha) {
        nodes.forEach(function(d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = (d.r + cluster.r);

            if (l !== r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        });
    }


    function collide(alpha) {
        var quadtree = d3.quadtree()
            .x((d) => d.x)
            .y((d) => d.y)
            .addAll(nodes);

        nodes.forEach(function(d) {
            var r = d.r + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;

            quadtree.visit(function(quad, x1, y1, x2, y2){
                if (quad.data && (quad.data !== d)) {
                    var x = d.x - quad.data.x,
                        y = d.y - quad.data.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.data.x += x;
                        quad.data.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        });
    }


});*/

// file = "./test.csv"

var margin = {top: 50, right: 50, bottom: 50, left: 50},
    w = 1*(window.screen.width), //- margin.left - margin.right,
    h = 1*(window.screen.height); //+ margin.top - margin.bottom;

var radius = 15;
// var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([0, w]);
var forceStrength = 0.05;

var svg = d3.select("#svg").append("svg")
    .attr("width", w)
    .attr("height", h)

var simulation = d3.forceSimulation()
    .force("collide",d3.forceCollide( function(d){
        return d.r + 4 }).iterations(16) 
    )
    .force("charge", d3.forceManyBody())
    .force("y", d3.forceY().y(h / 2))
    .force("x", d3.forceX().x(w / 2))

d3.csv(file, function(data){
    Dimension = "valence";
    Group = "C5_Modal";

    data.forEach(function(d){
        // d.r = d[Dimension]*2;
        d.r = radius;
        d.x = w / 2;
        d.y = h / 2;
    })

    console.table(data); 

    var circles = svg.selectAll("circle")
        .data(data, function(d){ return d.ID ;});

    var circlesEnter = circles.enter().append("circle")
        .attr("r", function(d, i){ return d.r; })
        .attr("cx", function(d, i){ return 175 + 25 * i + 2 * i ** 2; })
        .attr("cy", function(d, i){ return 250; })
        .style("fill", "none")
        .style("stroke", function(d, i){ return color(0); })
        .style("stroke-width", 1)
        .style("pointer-events", "all")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

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
        //console.log("dragstarted " + i)
        if (!d3.event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d,i) {
        //console.log("dragged " + i)
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d,i) {
        //console.log("dragended " + i)
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        var me = d3.select(this)
        console.log(me.classed("selected"))
        me.classed("selected", !me.classed("selected"))
    } 

    function groupBubbles() {
        hideTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(w / 2));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    function splitBubbles(Group) {

        centerScale.domain(data.map(function(d){ return d[Group]; }));

        if(Group == "all"){
            hideTitles()
            d3.selectAll("circle")
                .transition()
                .style("fill", "none")
                .style("stroke", function(d, i){ return color(0); })
                .style("stroke-width", 1)
        } else {
            showTitles(Group, centerScale);
            d3.selectAll("circle")
                .transition()
                .duration(3000)
                .style("fill", function(d, i){ return color(d[Group]); })
                .style("stroke-width", 0)
        }

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

        titles.enter().append('text')
            .attr('class', 'title')
            .merge(titles)
            .attr('x', function (d) { return scale(d); })
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) { return Group + ' ' + d; });

        titles.exit().remove() 
    }

    function setupButtons() {
        d3.selectAll('.button')
            .on('click', function () {

                // Remove active class from all buttons
                d3.selectAll('.button').classed('active', false);
                // Find the button just clicked
                var button = d3.select(this);

                // Set it as the active button
                button.classed('active', true);

                // Get the id of the button
                var buttonId = button.attr('id');
                var buttonClass = button.attr("class");

                if(buttonClass.search("modal")>0)
                {
                    console.log(buttonClass.search("modal"));
                    console.log(buttonClass);
                    splitBubbles(buttonId);
                }
                // Toggle the bubble chart based on
                // the currently clicked button.
            });
    }

    setupButtons();

})

