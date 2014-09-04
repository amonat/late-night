function renderRoads(zips) {
  mapElement = $("#map-canvas");

  var width = mapElement.width(),
    height = mapElement.height();

  svg = d3.select("#map-canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geo.mercator()
    .rotate([0, 0])
    .center([-70.95, 42.05])
    .scale(20000)
    .translate([width / 2, height / 2]);


  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  var zipFeature = svg.append("g");


  var zipFeatures = zipFeature.selectAll("path")
    .data(zips.features)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr('class','segment')
    .on('click',function(d, i) {
      console.log(d);
    })
    .on('mouseover', function(d, i) {
      console.log(d);
    })
  svg.call(zoom);

  function zoomed() {
    zipFeature.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    var strokeWidth = zipFeature.style("stroke-width");
    zipFeature.style("stroke-width", strokeWidth / zoom.scale());
  }

};

$.getJSON("data/clip8.json").then( function (zipsResults) {
  renderRoads(zipsResults);
});
