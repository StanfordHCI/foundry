/* diagram.js
 * ---------------------------------------------
 * 
 * 
 */

var diagram_width = $("#diagram-container").width(),
    diagram_height = 200,
    diagram_margin = 20;

// var workers = {
//     "nodes": [
//         {"name": "UX Researcher", "id": 0, "color": "green"},
//         {"name": "Web Developer 1", "id": 1, "color": "blue"},
//         {"name": "Web Developer 2", "id": 2, "color": "blue"},
//         {"name": "Web Developer 3", "id": 3, "color": "blue"},
//         {"name": "UI Designer", "id": 4, "color": "red"}
//     ],
//     "links": [
//         {"source":1,"target":2,"value":1},
//         {"source":2,"target":3,"value":8},
//         {"source":3,"target":1,"value":10},
//         {"source":0,"target":2,"value":6},
//         {"source":0,"target":1,"value":6},
//         {"source":0,"target":3,"value":6},
//         {"source":0,"target":4,"value":6},
//     ]
// }

var workers = {
    "nodes": [],
    "links": []
}

var color = d3.scale.category20();

var force = d3.layout.force()
    .nodes(workers.nodes)
    .links(workers.links)
    .charge(-400)
    .linkDistance(60)
    .size([diagram_width, diagram_height])
    .on("tick", tick);

var diagram_svg = d3.select("#diagram-container").append("svg")
    .attr("width", diagram_width)
    .attr("height", diagram_height);

var node = diagram_svg.selectAll(".node"),
    link = diagram_svg.selectAll(".link");







// force.nodes(workers.nodes)
//     .links(workers.links)
//     .start();

// var link = diagram_svg.selectAll(".link")
//     .data(workers.links)
//     .enter().append("line")
//     .attr("class", "link")
//     .style("stroke-width", function(d) { return 2*Math.sqrt(d.value); });

// var node = diagram_svg.selectAll(".node")
//     .data(workers.nodes)
//     .enter().append("circle")
//     .attr("class", "node")
//     .attr("r", 10)
//     .style("fill", function(d) { return d.color; })
//     .call(force.drag);

// node.append("title")
//     .text(function(d) { return d.name; });



function start() {
    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
    link.enter()
        .insert("line", ".node")
        .attr("class", "link");
    link.exit()
        .remove();

    node = node.data(force.nodes(), function(d) { return d.id;});
    node.style("fill", function(d) { return d.color; });
    node.enter()
        .append("circle")
        .attr("class", function(d) { return "node node-" + d.id; })
        .attr("r", 8)
        .style("fill", function(d) { return d.color; })
        .text(function(d) { return d.name; })
        .call(force.drag);
    node.exit()
        .remove();

    force.start();
}

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}

function addMemberNode(memberTitle, memberId, memberColor) {
    var newNode = {"name" : memberTitle, "id" : memberId, "color" : memberColor};
    workers.nodes.push(newNode);
    start();
}

function updateNodeColor() {
    start();
}

function removeMemberNode(memberId) {
    workers.nodes.splice(searchById(workers.nodes, memberId), 1);
    start();
}

function removeAllMemberNodes() {
    workers.nodes = [];
    start();
}

$(window).resize(function() {
    diagram_width = $("#diagram-container").width();
    diagram_svg.attr("width", diagram_width);
    force.size([diagram_width, diagram_height])
        .start();
});

