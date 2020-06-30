file = "demo.json"

var c5_color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

var color = d3.scaleQuantize()
    .domain([0,5])
    .range(["#fff", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

d3.json(file).then(function(data){
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
});


d3.json(file).then(function(Data){
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
});
