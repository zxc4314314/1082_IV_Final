
var c5_color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

var color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

var temp;

file = "./final.csv"
// file = "./t.csv"
d3.csv(file, function(data){
    let margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 1*(window.screen.width), //- margin.left - margin.right,
        height = 1*(window.screen.height); //+ margin.top - margin.bottom;

    let maxRadius =  height*0.1,
        padding = 20,
        clusterPadding = 10,
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
        .range(d3.extent(data, function(d) { return (+d.valence)*3;} ));


    console.log(d3.extent(data, function(d) { return +d.valence;}));

    console.log(data);
    let nodes = data.map((d) => {
        // scale radius to fit on the screen
        let scaledRadius  = radiusScale(((+d.valence)*1)),
            group = +d.C5_Modal-1;

        // add cluster id and radius to array
        d = {
            cluster     : group,
            r           : scaledRadius,
            term        : d.Term,
            valence     : +(d.valence)
            // major_cat   : d.Major_category
        };
        // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
        if (!clusters[group] || (scaledRadius > clusters[group].r)) clusters[group] = d;

        console.log(d);
        
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
        .attr('stroke-width', 0.5)
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
        // .force("x", d3.forceX().strength(.0005))
        // .force("y", d3.forceY().strength(.0005))
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


});
