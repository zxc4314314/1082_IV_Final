var units = "Words";

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = screen.width * 0.5 - margin.left - margin.right,
    height = screen.height * 0.6 - margin.top - margin.bottom;


// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; };


// append the svg object to the body of the page
var svg = d3.select("#sankey_diagram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(10)
    .size([width, height]); //一整個畫圖區域大小

var path = sankey.link();

// load the data
d3.csv("clusterDataPath.csv", function(error, clusterData) {
    d3.csv("nodeWords.csv", function(error, nodeWordsData) {

        /**************************
          建立sankey chart需要的物件
        ***************************/
        //set up graph in same style as original example but empty
        var graph = { "nodes": [], "links": [] };

        //資料處理
        clusterData.forEach(function(d) {
            graph.nodes.push({ "name": d.source });
            graph.nodes.push({ "name": d.target });
            graph.links.push({
                "source": d.source,
                "target": d.target,
                "value": +d.value,
                "words": d.words
            });
        });


        // return only the distinct / unique nodes
        graph.nodes = d3.keys(d3.nest()
            .key(function(d) { return d.name; })
            .object(graph.nodes));

        // loop through each link replacing the text with its index from node
        graph.links.forEach(function(d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });

        // now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
        graph.nodes.forEach(function(d, i) {
            graph.nodes[i] = { "name": d };
        });

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);


        /****************
          畫出node和link
        *****************/
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; }) //依照y距離排序
            .on("click", showLinkWords);

        // add the link titles
        link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + format(d.value);
            });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("id", function(d) { return d.name; })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", showNodeWords)
            .call(d3.drag() //節點的拖拉////////////////////////////////////////////////////////
                .subject(function(d) {
                    return d;
                })
                .on("start", function() {
                    this.parentNode.appendChild(this);
                })
                .on("drag", changePosition));

        //node color
        var color = d3.scaleOrdinal()
            .domain([0, graph.nodes.length])
            .range(['#FFB94E', '#F3C13A', '#455859', '#B95754', '#4D646C', '#C91F37', '#86A697',
                '#752E23', '#86ABA5', '#AB4C3D', '#6A7F7A', '#B56C60', '#AC8181',
                '#C57F2E', '#E69B3A', '#E29C45', '#E2B13C', '#E3B130'
            ])

        // add the rectangles for the nodes
        rect = node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            // .style("stroke", function(d) {
            //     return d3.rgb(d.color).darker(2);
            // })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // Fade-Effect on mouseover
        node.on("mouseover", function(d) {
                link.transition()
                    .duration(700)
                    .style("opacity", .1);
                link.filter(function(s) { return d.name == s.source.name; }).transition()
                    .duration(700)
                    .style("opacity", 1);
                link.filter(function(t) { return d.name == t.target.name; }).transition()
                    .duration(700)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.selectAll(".link").transition()
                    .duration(700)
                    .style("opacity", 1)
            });

        function sleep(milliseconds) {
            var start = new Date().getTime();
            while (1)
                if ((new Date().getTime() - start) > milliseconds)
                    break;
        }

        /***************
          過中間互換節點
        ****************/

        // 拖動的節點自動移動後又會跳回目前抓取的游標位置 /////////////////////////////////////////////////////////////////////////////
        // 幫我做個transition讓交換好看一點，這個最後再用
        function changePosition(d) {
            var upNode = { 'y': -1, 'dy': 0 }; //上面的節點
            var downNode = { 'y': 999, 'dy': 0 }; //下面的節點


            //找上下的節點
            for (i = 0; i < graph.nodes.length; i++) {
                if (graph.nodes[i].y < d.y && graph.nodes[i].y > upNode.y && graph.nodes[i].x == d.x) {
                    upNode = graph.nodes[i];
                }
                if (graph.nodes[i].y > d.y && graph.nodes[i].y < downNode.y && graph.nodes[i].x == d.x) {
                    downNode = graph.nodes[i];
                }
            }

            var upMidpoint = Math.max(0, Math.min(height - d.dy, (upNode.y + upNode.dy / 2))); //上個節點中點位置
            var downMidpoint = Math.max(0, Math.min(height - d.dy, (downNode.y + downNode.dy / 2 - d.dy))); //下個節點中點位置
            var nowY = Math.max(0, Math.min(height - d.dy, d3.event.y)); //現在節點的目前位置

            //console.log('upMidpoint:' + upMidpoint, 'downMidpoint:' + downMidpoint, 'nowY:' + nowY);
            //console.log(upNode.name, downNode.name);
            //console.log(downNode);

            //滑鼠過中點往上移
            if (nowY < upMidpoint) {

                //選擇的node往下
                d3.select(this)
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (d.y = upNode.y + (d.dy - upNode.dy)) + ")");
                //console.log(path);
                //console.log(link);

                //下面的node往上
                var temp = upNode.y + d.dy + 10 //用節點的相對位置更動
                d3.select("[id='" + upNode.name + "']")
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (upNode.y = temp) + ")");
                sankey.relayout();
                link.attr("d", path);
                //sleep(500);

            }
            //滑鼠過中點往下移
            else if (nowY > downMidpoint) {

                //選擇的node往下
                d3.select(this)
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (d.y = downNode.y - (d.dy - downNode.dy)) + ")");
                //console.log(path);
                //console.log(link);

                //下面的node往上 
                var temp = downNode.y - d.dy - 10 //用節點的相對位置更動
                d3.select("[id='" + downNode.name + "']")
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (downNode.y = temp) + ")");
                sankey.relayout();
                link.attr("d", path);
                
            }
            //若仍未過中點
            else {
                d3.select(this)
                    .attr("transform",
                        "translate(" +
                        d.x + "," +
                        (d.y = nowY) + ")");
                sankey.relayout();
                link.attr("d", path);
            }

        }

        /*****************
         點擊顯示情緒詞說明
        ******************/
        function showLinkWords(d) {
            console.log()
            var linkWordsDiv = document.getElementById('link_text_container').innerText = 'Emotional words in link: ' + d.source.name + ' to ' + d.target.name + '\n' + d.words;
        }

        function showNodeWords(d, i) {
            //console.log(d.name, i);
            //console.log(nodeWordsData[0]["subset"]);
            for (var i = nodeWordsData.length - 1; i >= 0; i--) {
                if (nodeWordsData[i]["subset"] == d.name) {
                    var linkWordsDiv = document.getElementById('node_text_container').innerText = 'Emotional words in node: ' + d.name + '\n' + nodeWordsData[i]["words"];
                }
            }
        }
    });
});