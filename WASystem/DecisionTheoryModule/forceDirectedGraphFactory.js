// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// this creates a force directed graph using the graph data and inserts
// it into id specified
function createForceDirectedGraph(graph, id){
var svg = d3.select("#"+id),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg.append('defs').append('marker')
            .attrs({'id':'arrowhead',
                'viewBox':'-0 -5 10 10',
                'refX':22.5,
                'refY':0,
                'orient':'auto',
                'markerWidth':10,
                'markerHeight':10,
                'xoverflow':'visible'})
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(50))
    .force("charge", d3.forceManyBody()
        .strength(-10))
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("arrow")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke", "black")
    .attr('marker-end','url(#arrowhead)')
    // .attr("stroke-width", 1);
    // .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 15)
      .attr("fill", function(d) { return color(d.color); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  var texts = svg.selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class", "label")
      .attr("fill", "black")
      .attr("fill", "black")
      .attr('x', -7.5)
      .attr('y', 7.5)
      .attr("font-size", 15)
      .text(function(d) {  return d.name;  });

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    texts
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
  }

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
}
