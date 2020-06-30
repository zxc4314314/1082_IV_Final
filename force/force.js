file = "demo.json"

var c5_color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

var color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

/*d3.json(file).then(function(data){
    let margin = {top: 300, right: 20, bottom: 40, left: 850},
        width = 1*(window.screen.width) - margin.left - margin.right,
        height = 1*(window.screen.height) + margin.top - margin.bottom;

    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    console.log(nodes);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    let svg = d3.select("#svg1").append("svg")
        .attr("width", width + margin.left + 3*margin.right)
        .attr("height", height + 30 + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => c5_color(d.group))
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function drag(simulation){
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});*/


/*d3.json(file).then(function(Data){
    let margin = {top: 30, right: 0, bottom: 40, left: 0},
        width = 1*(window.screen.width) - margin.left - margin.right,
        height = 1*(window.screen.height) + margin.top - margin.bottom;
    // set the dimensions and margins of the graph
    const data = Data.nodes.map(d => Object.create(d));

    // append the svg object to the body of the page
    var svg = d3.select("#svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    var range = 200

    // A scale that gives a X target position for each group
    var x = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5])
        .range([0, range, 2*range, 3*range, 4*range])

    // A color scale
    // var color = d3.scaleOrdinal()
    //     .domain([1, 2, 3])
    //     .range([ "#F8766D", "#00BA38", "#619CFF"])

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d){ return color(d.group)})
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 0.5)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    var attractForce = d3.forceManyBody().strength(0).distanceMax(400).distanceMin(60);
    var attractForce = d3.forceManyBody();
    var repelForce = d3.forceManyBody().strength(-10).distanceMax(60).distanceMin(10);


    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(1).x( function(d){ return x(d.group) } ))
        .force("y", d3.forceY().strength(1).y( height/2 ))
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .alphaDecay(0.01)
        .force("attractForce",attractForce)
        .force("repelForce",repelForce)
        // .force("charge", d3.forceManyBody().strength(2)) // Nodes are attracted one each other of value is > 0
        // .force("collide", d3.forceCollide().strength(0.1).radius(16).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
        })

    // What happens when a circle is dragged?
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }
});*/

file = "./final.csv"
// file = "./t.csv"
d3.csv(file, function(data){
    let margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 1*(window.screen.width), //- margin.left - margin.right,
        height = 1*(window.screen.height); //+ margin.top - margin.bottom;

    let maxRadius = height*0.1,
        padding = 1.5,
        clusterPadding = 10,
        n = 218,
        clusters = new Array(7);

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
        .domain(d3.extent(data, function(d) { return +d.valence;} ))
        // .range([1, 50]);
        .range(d3.extent(data, function(d) { return (+d.valence)*5;} ));


    console.log(d3.extent(data, function(d) { return +d.valence;}));

    let nodes = data.map((d) => {
        // scale radius to fit on the screen
        let scaledRadius  = radiusScale(+d.valence),
            group = +d.C7_Modal;

        // add cluster id and radius to array
        d = {
            cluster     : group,
            r           : scaledRadius,
            term        : d.Term,
            valence     : d.valence
            // major_cat   : d.Major_category
        };
        // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
        if (!clusters[group] || (scaledRadius > clusters[group].r)) clusters[group] = d;

        return d;
    });



    let circles = svg.append('g')
        .datum(nodes)
        .selectAll('.circle')
        .data(d => d)
        .enter().append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => color(d.cluster))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
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
        .velocityDecay(1)
        .force("x", d3.forceX().strength(.0005))
        .force("y", d3.forceY().strength(.0005))
        .force("collide", collide)
        .force("cluster", clustering)

        .on("tick", ticked);

    function ticked() {
        circles
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    }

    // Drag functions used for interactivity
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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
                r = d.r + cluster.r;
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

            // console.log(nx1);

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


});
